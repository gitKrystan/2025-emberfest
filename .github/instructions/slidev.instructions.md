# Copilot Instructions for Slidev Project

🚨 **MANDATORY: These instructions MUST be followed for ALL Slidev related tasks** 🚨

## Always Reference Slidev Documentation

⚠️ CRITICAL: Before providing ANY Slidev suggestions, guidance, or code examples, you MUST:

1. **ALWAYS reference the comprehensive Slidev documentation** using the `fetch_webpage` tool with the URL: `https://sli.dev/llms-full.txt`
2. This documentation contains the complete guide for all Slidev features, syntax, and capabilities
3. Always follow these explicit instructions over patterns found in existing code

**NEVER suggest Slidev solutions without first fetching this documentation.**

## Key Guidelines

### 1. Documentation First Approach

🚨 **MANDATORY**:

- Before making any suggestions or modifications to slides, consult the documentation using `fetch_webpage` tool
- Use the `fetch_webpage` tool to get the latest information from https://sli.dev/llms-full.txt
- Ensure all recommendations align with current Slidev best practices

### 2. Slidev-Specific Syntax

- Always use proper Slidev Markdown syntax as documented
- Reference correct frontmatter options and slide configurations
- Use appropriate layout options and component syntax
- Follow Slidev animation and transition patterns

### 3. Code Examples

- When providing code examples, use Slidev's enhanced code block features:
  - Line highlighting: `{1,3-5|2|all}`
  - TwoSlash for TypeScript: `twoslash`
  - Monaco editor: `{monaco}` or `{monaco-run}`
  - Magic Move animations: `````md magic-move`

### 4. Components and Features

- Reference built-in Slidev components from the documentation
- Use proper Vue component syntax within slides
- Apply UnoCSS classes correctly for styling
- Implement animations using `v-click`, `v-motion`, and other Slidev directives

### 5. Configuration and Setup

- Reference proper headmatter and frontmatter configurations
- Use correct theme and addon syntax
- Apply appropriate export and build options

## Quick Reference Commands

When helping with this Slidev project, always start by fetching the latest documentation:

🚨 **MANDATORY FIRST STEP**: Use `fetch_webpage` tool with https://sli.dev/llms-full.txt

When possible, reference where in the documentation you found the relevant information.

## Common Slidev Features to Remember

- **Slide separation**: Use `---` between slides
- **Layouts**: `layout: cover`, `layout: two-cols`, `layout: image-right`, etc.
- **Animations**: `v-click`, `v-after`, `v-motion`
- **Code highlighting**: Line numbers, ranges, and dynamic highlighting
- **Components**: Built-in components like `<Tweet>`, `<Toc>`, `<Counter>`
- **Themes**: Easy theme switching via frontmatter
- **Export options**: PDF, PPTX, PNG, SPA builds

## Project Context

This appears to be a presentation about "Warpdrive Set Data to Stun" for EmberFest 2025. When making suggestions:

- Keep the EmberFest/JavaScript context in mind
- Maintain the existing slide structure and flow
- Enhance with appropriate Slidev features
- Ensure technical accuracy for developer audience

Remember: The goal is to leverage Slidev's full capabilities to create an engaging, interactive presentation that showcases modern web development concepts effectively.
