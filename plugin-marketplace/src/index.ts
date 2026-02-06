export { PluginRegistry } from "./registry/registry";
export { PluginInstaller } from "./installer/installer";
export { MarketplaceCLI } from "./cli/marketplace";
export { CLAUDE_CODE_PLUGIN } from "./plugins/anthropics-claude-code";
export { FRONTEND_DESIGN_PLUGIN } from "./plugins/claude-code-plugins-frontend-design";
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
