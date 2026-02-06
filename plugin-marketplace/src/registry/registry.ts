import {
  PluginRegistryEntry,
  PluginCategory,
  MarketplaceSearchResult,
} from "../types/plugin";

const BUILT_IN_PLUGINS: PluginRegistryEntry[] = [
  {
    metadata: {
      name: "claude-code",
      namespace: "anthropics",
      version: "1.0.0",
      description:
        "Anthropic's official Claude Code plugin — an agentic coding assistant that lives in your terminal. Understands your codebase, executes commands, edits files, and helps with complex software engineering tasks using natural language.",
      author: "Anthropic",
      license: "MIT",
      homepage: "https://github.com/anthropics/claude-code",
      repository: "https://github.com/anthropics/claude-code",
      keywords: [
        "ai",
        "claude",
        "coding-assistant",
        "agentic",
        "terminal",
        "anthropic",
        "llm",
        "code-generation",
        "refactoring",
        "debugging",
      ],
      category: "ai-assistant",
      featured: true,
      downloads: 528400,
      rating: 4.9,
    },
    versions: ["0.1.0", "0.5.0", "0.9.0", "1.0.0"],
    latestVersion: "1.0.0",
    publishedAt: "2025-12-15T00:00:00Z",
  },
  {
    metadata: {
      name: "claude-test-gen",
      namespace: "anthropics",
      version: "0.8.0",
      description:
        "AI-powered test generation plugin using Claude. Analyzes your code and automatically generates comprehensive unit, integration, and e2e tests.",
      author: "Anthropic",
      license: "MIT",
      homepage: "https://github.com/anthropics/claude-test-gen",
      repository: "https://github.com/anthropics/claude-test-gen",
      keywords: [
        "testing",
        "ai",
        "claude",
        "test-generation",
        "unit-tests",
        "e2e",
      ],
      category: "testing",
      featured: false,
      downloads: 89200,
      rating: 4.6,
    },
    versions: ["0.5.0", "0.7.0", "0.8.0"],
    latestVersion: "0.8.0",
    publishedAt: "2025-11-20T00:00:00Z",
  },
  {
    metadata: {
      name: "claude-docs",
      namespace: "anthropics",
      version: "0.6.0",
      description:
        "Automatically generate and maintain documentation from your codebase using Claude's deep understanding of code semantics.",
      author: "Anthropic",
      license: "MIT",
      homepage: "https://github.com/anthropics/claude-docs",
      repository: "https://github.com/anthropics/claude-docs",
      keywords: [
        "documentation",
        "ai",
        "claude",
        "auto-docs",
        "jsdoc",
        "markdown",
      ],
      category: "documentation",
      featured: false,
      downloads: 45600,
      rating: 4.4,
    },
    versions: ["0.3.0", "0.5.0", "0.6.0"],
    latestVersion: "0.6.0",
    publishedAt: "2025-10-10T00:00:00Z",
  },
  {
    metadata: {
      name: "claude-security",
      namespace: "anthropics",
      version: "0.4.0",
      description:
        "Security scanning plugin powered by Claude. Detects vulnerabilities, insecure patterns, and OWASP Top 10 issues in your codebase.",
      author: "Anthropic",
      license: "MIT",
      homepage: "https://github.com/anthropics/claude-security",
      repository: "https://github.com/anthropics/claude-security",
      keywords: [
        "security",
        "ai",
        "claude",
        "vulnerability",
        "owasp",
        "scanning",
      ],
      category: "security",
      featured: false,
      downloads: 31200,
      rating: 4.5,
    },
    versions: ["0.2.0", "0.3.0", "0.4.0"],
    latestVersion: "0.4.0",
    publishedAt: "2025-09-05T00:00:00Z",
  },
];

export class PluginRegistry {
  private plugins: PluginRegistryEntry[];

  constructor() {
    this.plugins = [...BUILT_IN_PLUGINS];
  }

  getAll(): PluginRegistryEntry[] {
    return this.plugins;
  }

  getFeatured(): PluginRegistryEntry[] {
    return this.plugins.filter((p) => p.metadata.featured);
  }

  getByCategory(category: PluginCategory): PluginRegistryEntry[] {
    return this.plugins.filter((p) => p.metadata.category === category);
  }

  findByName(namespace: string, name: string): PluginRegistryEntry | undefined {
    return this.plugins.find(
      (p) => p.metadata.namespace === namespace && p.metadata.name === name
    );
  }

  search(query: string, page = 1, perPage = 10): MarketplaceSearchResult {
    const lowerQuery = query.toLowerCase();
    const matched = this.plugins.filter(
      (p) =>
        p.metadata.name.toLowerCase().includes(lowerQuery) ||
        p.metadata.description.toLowerCase().includes(lowerQuery) ||
        p.metadata.keywords.some((k) => k.toLowerCase().includes(lowerQuery)) ||
        p.metadata.namespace.toLowerCase().includes(lowerQuery)
    );

    const start = (page - 1) * perPage;
    const paged = matched.slice(start, start + perPage);

    return {
      plugins: paged,
      total: matched.length,
      page,
      perPage,
    };
  }

  register(entry: PluginRegistryEntry): void {
    const existing = this.findByName(
      entry.metadata.namespace,
      entry.metadata.name
    );
    if (existing) {
      throw new Error(
        `Plugin ${entry.metadata.namespace}/${entry.metadata.name} is already registered`
      );
    }
    this.plugins.push(entry);
  }
}
