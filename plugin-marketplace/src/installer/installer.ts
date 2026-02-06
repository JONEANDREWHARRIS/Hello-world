import * as fs from "fs";
import * as path from "path";
import {
  InstalledPlugin,
  PluginConfig,
  PluginInstallResult,
  PluginRemoveResult,
} from "../types/plugin";
import { PluginRegistry } from "../registry/registry";

const INSTALL_DIR = path.resolve(__dirname, "../../installed-plugins");
const MANIFEST_FILE = path.join(INSTALL_DIR, "manifest.json");

export class PluginInstaller {
  private registry: PluginRegistry;
  private installed: Map<string, InstalledPlugin>;

  constructor(registry: PluginRegistry) {
    this.registry = registry;
    this.installed = new Map();
    this.ensureInstallDir();
    this.loadManifest();
  }

  private ensureInstallDir(): void {
    if (!fs.existsSync(INSTALL_DIR)) {
      fs.mkdirSync(INSTALL_DIR, { recursive: true });
    }
  }

  private loadManifest(): void {
    if (fs.existsSync(MANIFEST_FILE)) {
      const data = JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf-8"));
      for (const [key, value] of Object.entries(data)) {
        this.installed.set(key, value as InstalledPlugin);
      }
    }
  }

  private saveManifest(): void {
    const data: Record<string, InstalledPlugin> = {};
    for (const [key, value] of this.installed.entries()) {
      data[key] = value;
    }
    fs.writeFileSync(MANIFEST_FILE, JSON.stringify(data, null, 2));
  }

  private pluginKey(namespace: string, name: string): string {
    return `${namespace}/${name}`;
  }

  install(
    namespace: string,
    name: string,
    version?: string
  ): PluginInstallResult {
    const key = this.pluginKey(namespace, name);

    if (this.installed.has(key)) {
      return {
        success: false,
        plugin: key,
        version: "",
        message: `Plugin ${key} is already installed. Use update to change versions.`,
      };
    }

    const entry = this.registry.findByName(namespace, name);
    if (!entry) {
      return {
        success: false,
        plugin: key,
        version: "",
        message: `Plugin ${key} not found in the marketplace registry.`,
      };
    }

    const targetVersion = version || entry.latestVersion;
    if (!entry.versions.includes(targetVersion)) {
      return {
        success: false,
        plugin: key,
        version: targetVersion,
        message: `Version ${targetVersion} not found. Available: ${entry.versions.join(", ")}`,
      };
    }

    const pluginDir = path.join(INSTALL_DIR, namespace, name);
    fs.mkdirSync(pluginDir, { recursive: true });

    const defaultConfig: PluginConfig = {
      enabled: true,
      settings: {},
    };

    // Write plugin config
    fs.writeFileSync(
      path.join(pluginDir, "config.json"),
      JSON.stringify(defaultConfig, null, 2)
    );

    // Write plugin info
    fs.writeFileSync(
      path.join(pluginDir, "plugin.json"),
      JSON.stringify(
        { ...entry.metadata, installedVersion: targetVersion },
        null,
        2
      )
    );

    const now = new Date().toISOString();
    const installedPlugin: InstalledPlugin = {
      metadata: { ...entry.metadata, version: targetVersion },
      config: defaultConfig,
      installedAt: now,
      updatedAt: now,
      path: pluginDir,
    };

    this.installed.set(key, installedPlugin);
    this.saveManifest();

    return {
      success: true,
      plugin: key,
      version: targetVersion,
      message: `Successfully installed ${key}@${targetVersion}`,
    };
  }

  remove(namespace: string, name: string): PluginRemoveResult {
    const key = this.pluginKey(namespace, name);

    if (!this.installed.has(key)) {
      return {
        success: false,
        plugin: key,
        message: `Plugin ${key} is not installed.`,
      };
    }

    const plugin = this.installed.get(key)!;
    if (fs.existsSync(plugin.path)) {
      fs.rmSync(plugin.path, { recursive: true, force: true });
    }

    this.installed.delete(key);
    this.saveManifest();

    return {
      success: true,
      plugin: key,
      message: `Successfully removed ${key}`,
    };
  }

  list(): InstalledPlugin[] {
    return Array.from(this.installed.values());
  }

  isInstalled(namespace: string, name: string): boolean {
    return this.installed.has(this.pluginKey(namespace, name));
  }

  getInstalled(namespace: string, name: string): InstalledPlugin | undefined {
    return this.installed.get(this.pluginKey(namespace, name));
  }

  update(namespace: string, name: string): PluginInstallResult {
    const key = this.pluginKey(namespace, name);

    if (!this.installed.has(key)) {
      return {
        success: false,
        plugin: key,
        version: "",
        message: `Plugin ${key} is not installed.`,
      };
    }

    const entry = this.registry.findByName(namespace, name);
    if (!entry) {
      return {
        success: false,
        plugin: key,
        version: "",
        message: `Plugin ${key} no longer exists in the registry.`,
      };
    }

    const current = this.installed.get(key)!;
    if (current.metadata.version === entry.latestVersion) {
      return {
        success: true,
        plugin: key,
        version: entry.latestVersion,
        message: `Plugin ${key} is already at the latest version (${entry.latestVersion}).`,
      };
    }

    // Update metadata and version
    current.metadata = { ...entry.metadata, version: entry.latestVersion };
    current.updatedAt = new Date().toISOString();

    fs.writeFileSync(
      path.join(current.path, "plugin.json"),
      JSON.stringify(
        { ...entry.metadata, installedVersion: entry.latestVersion },
        null,
        2
      )
    );

    this.installed.set(key, current);
    this.saveManifest();

    return {
      success: true,
      plugin: key,
      version: entry.latestVersion,
      message: `Updated ${key} to v${entry.latestVersion}`,
    };
  }
}
