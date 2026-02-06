/**
 * anthropics/claude-code plugin definition
 *
 * Anthropic's official Claude Code plugin — an agentic AI coding assistant
 * that lives in your terminal. It can understand your entire codebase,
 * edit files, execute commands, and help with complex software engineering
 * tasks using natural language.
 *
 * Features:
 *  - Codebase understanding and navigation
 *  - File editing and creation
 *  - Terminal command execution
 *  - Multi-step task planning and execution
 *  - Git operations (commit, PR creation, etc.)
 *  - Test running and debugging
 *  - Code review and refactoring
 *
 * @see https://github.com/anthropics/claude-code
 */

export const CLAUDE_CODE_PLUGIN = {
  name: "claude-code",
  namespace: "anthropics",
  displayName: "Claude Code",
  version: "1.0.0",
  description:
    "Anthropic's official agentic coding assistant — understands your codebase, executes commands, edits files, and helps with complex software engineering tasks.",
  author: "Anthropic",
  license: "MIT",

  capabilities: [
    "codebase-navigation",
    "file-editing",
    "command-execution",
    "task-planning",
    "git-operations",
    "test-running",
    "code-review",
    "refactoring",
    "documentation-generation",
    "debugging",
  ],

  configuration: {
    model: {
      type: "string",
      default: "claude-opus-4-6",
      description: "The Claude model to use for code assistance",
      options: ["claude-opus-4-6", "claude-sonnet-4", "haiku"],
    },
    maxTurns: {
      type: "number",
      default: 50,
      description: "Maximum number of agentic turns per task",
    },
    autoCommit: {
      type: "boolean",
      default: false,
      description: "Automatically commit changes after task completion",
    },
    workingDirectory: {
      type: "string",
      default: ".",
      description: "Default working directory for code operations",
    },
    enabledTools: {
      type: "array",
      default: [
        "Read",
        "Write",
        "Edit",
        "Bash",
        "Glob",
        "Grep",
        "WebFetch",
        "WebSearch",
      ],
      description: "List of tools available to the Claude Code agent",
    },
  },

  hooks: {
    onInstall: "echo 'Claude Code plugin installed successfully'",
    onEnable: "echo 'Claude Code plugin enabled'",
    onDisable: "echo 'Claude Code plugin disabled'",
  },

  commands: [
    {
      name: "code",
      description: "Start an interactive Claude Code session",
      usage: "plugin run anthropics/claude-code code",
    },
    {
      name: "review",
      description: "Review code changes in the current branch",
      usage: "plugin run anthropics/claude-code review",
    },
    {
      name: "fix",
      description: "Automatically fix issues in the codebase",
      usage: "plugin run anthropics/claude-code fix <file-or-pattern>",
    },
    {
      name: "explain",
      description: "Explain a file or code section",
      usage: "plugin run anthropics/claude-code explain <file>",
    },
  ],
} as const;
