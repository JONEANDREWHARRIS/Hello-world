#!/usr/bin/env node

import { MarketplaceCLI } from "./cli/marketplace";

const cli = new MarketplaceCLI();
const args = process.argv.slice(2);

// Default action: install anthropics/claude-code if run with no args
if (args.length === 0) {
  console.log("\n  Welcome to the Claude Plugin Marketplace!\n");
  console.log("  Installing featured plugin: anthropics/claude-code...\n");
  cli.run(["install", "anthropics/claude-code"]);
  cli.run(["info", "anthropics/claude-code"]);
} else {
  cli.run(args);
}
