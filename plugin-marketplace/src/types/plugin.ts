export interface PluginMetadata {
  name: string;
  namespace: string;
  version: string;
  description: string;
  author: string;
  license: string;
  homepage: string;
  repository: string;
  keywords: string[];
  category: PluginCategory;
  featured: boolean;
  downloads: number;
  rating: number;
}

export type PluginCategory =
  | "ai-assistant"
  | "code-generation"
  | "debugging"
  | "testing"
  | "devops"
  | "documentation"
  | "linting"
  | "formatting"
  | "security"
  | "utility";

export interface PluginConfig {
  enabled: boolean;
  settings: Record<string, unknown>;
}

export interface InstalledPlugin {
  metadata: PluginMetadata;
  config: PluginConfig;
  installedAt: string;
  updatedAt: string;
  path: string;
}

export interface PluginRegistryEntry {
  metadata: PluginMetadata;
  versions: string[];
  latestVersion: string;
  publishedAt: string;
}

export interface MarketplaceSearchResult {
  plugins: PluginRegistryEntry[];
  total: number;
  page: number;
  perPage: number;
}

export interface PluginInstallResult {
  success: boolean;
  plugin: string;
  version: string;
  message: string;
}

export interface PluginRemoveResult {
  success: boolean;
  plugin: string;
  message: string;
}
