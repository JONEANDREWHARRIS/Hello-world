export { PluginRegistry } from "./registry/registry";
export { PluginInstaller } from "./installer/installer";
export { MarketplaceCLI } from "./cli/marketplace";
export { CLAUDE_CODE_PLUGIN } from "./plugins/anthropics-claude-code";
export type {
  PluginMetadata,
  PluginCategory,
  PluginConfig,
  InstalledPlugin,
  PluginRegistryEntry,
  MarketplaceSearchResult,
  PluginInstallResult,
  PluginRemoveResult,
} from "./types/plugin";
