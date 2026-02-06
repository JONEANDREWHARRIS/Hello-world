# Project: Hello-world

Multi-project TypeScript/React monorepo for Remotion-based video generation and automation tooling.

---

## Installed Plugins

### anthropics/claude-code (v1.0.0)
Active by default. Claude Code is the agentic assistant powering this workspace.

### claude-code-plugins/frontend-design (v1.2.0)
When the user asks to generate frontend UI — components, layouts, pages, or design systems — follow these rules:

**Defaults:**
- Framework: React + TypeScript
- Styling: Tailwind CSS
- Responsive: Always include mobile/tablet/desktop breakpoints
- Accessibility: WCAG 2.1 AA compliant (aria labels, semantic HTML, keyboard navigation, sufficient contrast)
- Dark mode: Generate light + dark variants using Tailwind `dark:` classes
- Output directory: `src/components/`

**Component Generation:**
- Use functional components with typed props interfaces
- Include JSDoc description on the exported component
- Name files in PascalCase matching the component name
- Co-locate types in the same file unless shared

**Layout Scaffolding:**
- Use CSS Grid or Flexbox via Tailwind utilities
- Include a mobile-first responsive approach
- Provide clear landmark regions (header, nav, main, footer)

**Design System Generation:**
- Output a `design-tokens.ts` file with colors, typography scale, spacing scale, border radii, and shadows
- Generate a Tailwind config extension that maps tokens to Tailwind theme values
- Include a sample component that demonstrates the system

**Commands (natural language triggers):**
- "generate component [description]" → create a component
- "scaffold layout [description]" → create a page layout
- "create design system [description]" → generate design tokens + config
- "audit [path]" → review components for accessibility and responsiveness
- "convert styles [from] to [to]" → convert between styling approaches
