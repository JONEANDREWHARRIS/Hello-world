/**
 * claude-code-plugins/frontend-design plugin definition
 *
 * AI-powered frontend design plugin for Claude Code. Generates responsive
 * UI components, layouts, and full design systems from natural language
 * descriptions. Supports multiple frameworks and styling approaches.
 *
 * Features:
 *  - Component generation from text descriptions
 *  - Responsive layout scaffolding
 *  - Design system creation (colors, typography, spacing)
 *  - Framework support: React, Vue, Svelte, vanilla HTML/CSS
 *  - Styling support: Tailwind CSS, CSS Modules, styled-components
 *  - Accessibility-first defaults (WCAG 2.1 AA)
 *  - Dark mode generation
 *  - Animation and transition helpers
 *
 * @see https://github.com/claude-code-plugins/frontend-design
 */

export const FRONTEND_DESIGN_PLUGIN = {
  name: "frontend-design",
  namespace: "claude-code-plugins",
  displayName: "Frontend Design",
  version: "1.2.0",
  description:
    "AI-powered frontend design plugin — generates responsive UI components, layouts, and design systems from natural language descriptions.",
  author: "Claude Code Plugins",
  license: "MIT",

  capabilities: [
    "component-generation",
    "layout-scaffolding",
    "design-system-creation",
    "responsive-design",
    "dark-mode-generation",
    "accessibility-audit",
    "animation-helpers",
    "style-conversion",
    "color-palette-generation",
    "typography-system",
  ],

  supportedFrameworks: [
    "react",
    "vue",
    "svelte",
    "html",
  ],

  supportedStyling: [
    "tailwind",
    "css-modules",
    "styled-components",
    "vanilla-css",
    "scss",
  ],

  configuration: {
    framework: {
      type: "string",
      default: "react",
      description: "Default frontend framework for generated components",
      options: ["react", "vue", "svelte", "html"],
    },
    styling: {
      type: "string",
      default: "tailwind",
      description: "Default styling approach",
      options: ["tailwind", "css-modules", "styled-components", "vanilla-css", "scss"],
    },
    typescript: {
      type: "boolean",
      default: true,
      description: "Generate TypeScript components by default",
    },
    responsive: {
      type: "boolean",
      default: true,
      description: "Include responsive breakpoints by default",
    },
    accessibility: {
      type: "string",
      default: "AA",
      description: "WCAG compliance level",
      options: ["A", "AA", "AAA"],
    },
    darkMode: {
      type: "boolean",
      default: true,
      description: "Generate dark mode variants",
    },
    outputDir: {
      type: "string",
      default: "src/components",
      description: "Default output directory for generated components",
    },
  },

  hooks: {
    onInstall: "echo 'Frontend Design plugin installed successfully'",
    onEnable: "echo 'Frontend Design plugin enabled'",
    onDisable: "echo 'Frontend Design plugin disabled'",
  },

  commands: [
    {
      name: "component",
      description: "Generate a UI component from a text description",
      usage: "plugin run claude-code-plugins/frontend-design component 'A responsive navbar with logo, links, and mobile hamburger menu'",
    },
    {
      name: "layout",
      description: "Scaffold a page layout",
      usage: "plugin run claude-code-plugins/frontend-design layout 'Dashboard with sidebar, header, and grid content area'",
    },
    {
      name: "design-system",
      description: "Generate a design system (colors, typography, spacing tokens)",
      usage: "plugin run claude-code-plugins/frontend-design design-system 'Modern SaaS with blue primary, clean typography'",
    },
    {
      name: "audit",
      description: "Audit existing components for accessibility and responsiveness",
      usage: "plugin run claude-code-plugins/frontend-design audit src/components/",
    },
    {
      name: "convert",
      description: "Convert component styling between frameworks (e.g. CSS to Tailwind)",
      usage: "plugin run claude-code-plugins/frontend-design convert --from css --to tailwind src/App.css",
    },
  ],
} as const;
