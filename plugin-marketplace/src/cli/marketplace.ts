import { PluginRegistry } from "../registry/registry";
import { PluginInstaller } from "../installer/installer";

const DIVIDER = "─".repeat(60);

function formatRating(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "☆" : "") + "·".repeat(empty);
}

function formatDownloads(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export class MarketplaceCLI {
  private registry: PluginRegistry;
  private installer: PluginInstaller;

  constructor() {
    this.registry = new PluginRegistry();
    this.installer = new PluginInstaller(this.registry);
  }

  run(args: string[]): void {
    const command = args[0] || "help";

    switch (command) {
      case "search":
        this.search(args.slice(1).join(" ") || "claude");
        break;
      case "install":
        this.install(args[1]);
        break;
      case "remove":
        this.remove(args[1]);
        break;
      case "list":
        this.list();
        break;
      case "info":
        this.info(args[1]);
        break;
      case "featured":
        this.featured();
        break;
      case "update":
        this.update(args[1]);
        break;
      case "help":
      default:
        this.help();
        break;
    }
  }

  private search(query: string): void {
    const results = this.registry.search(query);
    console.log(`\n  Plugin Marketplace — Search: "${query}"\n`);
    console.log(`  ${DIVIDER}`);

    if (results.plugins.length === 0) {
      console.log(`  No plugins found matching "${query}"\n`);
      return;
    }

    console.log(`  Found ${results.total} plugin(s):\n`);

    for (const entry of results.plugins) {
      const m = entry.metadata;
      const installed = this.installer.isInstalled(m.namespace, m.name);
      const badge = m.featured ? " [FEATURED]" : "";
      const installedTag = installed ? " [INSTALLED]" : "";

      console.log(`  ${m.namespace}/${m.name}@${entry.latestVersion}${badge}${installedTag}`);
      console.log(`    ${m.description}`);
      console.log(
        `    ${formatRating(m.rating)} (${m.rating})  |  ${formatDownloads(m.downloads)} downloads  |  ${m.category}`
      );
      console.log();
    }
    console.log(`  ${DIVIDER}\n`);
  }

  private install(pluginRef?: string): void {
    if (!pluginRef) {
      console.log("\n  Usage: marketplace install <namespace/name>\n");
      return;
    }

    const parts = pluginRef.split("/");
    if (parts.length !== 2) {
      console.log("\n  Invalid plugin reference. Use format: namespace/name\n");
      return;
    }

    const [namespace, name] = parts;
    console.log(`\n  Installing ${namespace}/${name}...`);

    const result = this.installer.install(namespace, name);
    if (result.success) {
      console.log(`  ✓ ${result.message}\n`);
    } else {
      console.log(`  ✗ ${result.message}\n`);
    }
  }

  private remove(pluginRef?: string): void {
    if (!pluginRef) {
      console.log("\n  Usage: marketplace remove <namespace/name>\n");
      return;
    }

    const parts = pluginRef.split("/");
    if (parts.length !== 2) {
      console.log("\n  Invalid plugin reference. Use format: namespace/name\n");
      return;
    }

    const [namespace, name] = parts;
    console.log(`\n  Removing ${namespace}/${name}...`);

    const result = this.installer.remove(namespace, name);
    if (result.success) {
      console.log(`  ✓ ${result.message}\n`);
    } else {
      console.log(`  ✗ ${result.message}\n`);
    }
  }

  private list(): void {
    const plugins = this.installer.list();
    console.log(`\n  Installed Plugins\n`);
    console.log(`  ${DIVIDER}`);

    if (plugins.length === 0) {
      console.log(`  No plugins installed yet.`);
      console.log(`  Run: marketplace install anthropics/claude-code\n`);
      return;
    }

    for (const p of plugins) {
      const m = p.metadata;
      console.log(`  ${m.namespace}/${m.name}@${m.version}`);
      console.log(`    ${m.description}`);
      console.log(`    Installed: ${p.installedAt.split("T")[0]}  |  Enabled: ${p.config.enabled}`);
      console.log();
    }
    console.log(`  ${DIVIDER}\n`);
  }

  private info(pluginRef?: string): void {
    if (!pluginRef) {
      console.log("\n  Usage: marketplace info <namespace/name>\n");
      return;
    }

    const parts = pluginRef.split("/");
    if (parts.length !== 2) {
      console.log("\n  Invalid plugin reference. Use format: namespace/name\n");
      return;
    }

    const [namespace, name] = parts;
    const entry = this.registry.findByName(namespace, name);

    if (!entry) {
      console.log(`\n  Plugin ${namespace}/${name} not found in registry.\n`);
      return;
    }

    const m = entry.metadata;
    const installed = this.installer.isInstalled(namespace, name);

    console.log(`\n  ${DIVIDER}`);
    console.log(`  ${m.namespace}/${m.name}`);
    console.log(`  ${DIVIDER}`);
    console.log(`  Description:  ${m.description}`);
    console.log(`  Version:      ${entry.latestVersion}`);
    console.log(`  Author:       ${m.author}`);
    console.log(`  License:      ${m.license}`);
    console.log(`  Category:     ${m.category}`);
    console.log(`  Rating:       ${formatRating(m.rating)} (${m.rating}/5)`);
    console.log(`  Downloads:    ${formatDownloads(m.downloads)}`);
    console.log(`  Homepage:     ${m.homepage}`);
    console.log(`  Repository:   ${m.repository}`);
    console.log(`  Keywords:     ${m.keywords.join(", ")}`);
    console.log(`  Versions:     ${entry.versions.join(", ")}`);
    console.log(`  Published:    ${entry.publishedAt.split("T")[0]}`);
    console.log(`  Installed:    ${installed ? "Yes" : "No"}`);
    if (m.featured) {
      console.log(`  Featured:     Yes`);
    }
    console.log(`  ${DIVIDER}\n`);
  }

  private featured(): void {
    const featured = this.registry.getFeatured();
    console.log(`\n  Featured Plugins\n`);
    console.log(`  ${DIVIDER}`);

    for (const entry of featured) {
      const m = entry.metadata;
      const installed = this.installer.isInstalled(m.namespace, m.name);
      const tag = installed ? " [INSTALLED]" : "";

      console.log(`  ★ ${m.namespace}/${m.name}@${entry.latestVersion}${tag}`);
      console.log(`    ${m.description}`);
      console.log(
        `    ${formatRating(m.rating)} (${m.rating})  |  ${formatDownloads(m.downloads)} downloads`
      );
      console.log();
    }
    console.log(`  ${DIVIDER}\n`);
  }

  private update(pluginRef?: string): void {
    if (!pluginRef) {
      console.log("\n  Usage: marketplace update <namespace/name>\n");
      return;
    }

    const parts = pluginRef.split("/");
    if (parts.length !== 2) {
      console.log("\n  Invalid plugin reference. Use format: namespace/name\n");
      return;
    }

    const [namespace, name] = parts;
    console.log(`\n  Updating ${namespace}/${name}...`);

    const result = this.installer.update(namespace, name);
    if (result.success) {
      console.log(`  ✓ ${result.message}\n`);
    } else {
      console.log(`  ✗ ${result.message}\n`);
    }
  }

  private help(): void {
    console.log(`
  Plugin Marketplace CLI
  ${"─".repeat(40)}

  Commands:
    search <query>          Search for plugins
    install <ns/name>       Install a plugin
    remove <ns/name>        Remove a plugin
    update <ns/name>        Update a plugin
    list                    List installed plugins
    info <ns/name>          Show plugin details
    featured                Show featured plugins
    help                    Show this help message

  Examples:
    marketplace search claude
    marketplace install anthropics/claude-code
    marketplace info anthropics/claude-code
    marketplace list
    marketplace featured
`);
  }
}
