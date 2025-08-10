# WarpDrive Assistant Instructions

🚨 **MANDATORY: These instructions MUST be followed for ALL WarpDrive related tasks** 🚨

## Always Use Latest Information Sources

⚠️ CRITICAL: Before providing ANY WarpDrive suggestions, guidance, or code examples, you MUST:

When providing information about WarpDrive, **ALWAYS** consult these current sources using the appropriate tools to ensure accuracy:

### Primary Documentation Source

🚨 **MANDATORY**: Use `fetch_webpage` tool with these URLs:

- **Primary URL**: https://docs.warp-drive.io/
- **LLM-specific docs**: https://docs.warp-drive.io/llms-full.txt
- **Contains**: Latest guides, API documentation, and comprehensive user documentation
- **Key Sections**:
  - Guides: https://docs.warp-drive.io/guides
  - API Docs: https://docs.warp-drive.io/api

### Primary Code Repository

🚨 **MANDATORY**: Use `github_repo` tool with `emberjs/data`:

- **Repository**: https://github.com/emberjs/data
- **Contains**: Source code, README files, changelogs, roadmap, and implementation details
- **Key Areas**:
  - Main README and project overview
  - ROADMAP.md for future plans and current status
  - Individual package READMEs in `warp-drive-packages/` directory
  - Guides in `/guides/` directory

### Secondary Source of Information for Context

- Use `fetch_webpage` tool for additional context when needed:
- **URL**: https://runspired.com/
- **Contains**: Additional context, blog posts, and insights from the WarpDrive creator
- **Key Posts**:
  - https://runspired.com/2024/01/31/modern-ember-data.html
  - https://runspired.com/2024/11/29/cascade-on-delete.html
  - https://runspired.com/2025/02/06/exploring-transformed-and-derivied-values-in-schema-record.html
  - https://runspired.com/2025/02/26/exploring-advanced-handlers.html
  - https://runspired.com/2025/05/25/in-defense-of-machine-formats.html

## Current WarpDrive Key Facts (Updated from sources)

### What is WarpDrive?

- **Official Description**: "A lightweight data library for web apps — universal, typed, reactive, and ready to scale"
- **Former Name**: Previously known as EmberData, now rebranding as WarpDrive
- **Tagline**: "The Data Framework for Ambitious Web Applications"

### Core Features

- 🌌 **Universal**: Fine Grained Reactivity That Works Natively With Any Framework Or Library
- ⚡️ **Performance**: Committed to Best-In-Class Performance
- 💚 **Typed**: Fully Typed, Ready To Rock
- 🧩 **API Agnostic**: Connect With Any API (GraphQL, JSON:API, REST, tRPC, bespoke)
- 🌲 **Lightweight**: Focused on being as tiny as possible
- 🚀 **SSR Ready**: Server-side rendering support
- 🔓 **No Lock-in**: No Architectural Lock-in

### Framework Support

- **Ember**: `@warp-drive/ember`
- **React**: `@warp-drive/react`
- **Vue**: `@warp-drive/vue`
- **Svelte**: `@warp-drive/svelte`
- **Universal**: Core packages work with any framework

### Key Packages

- `@warp-drive/core` - Core functionality
- `@warp-drive/json-api` - JSON:API cache implementation
- `@warp-drive/utilities` - General utilities
- `@warp-drive/build-config` - Build configuration tools
- `@warp-drive/experiments` - Experimental features
- `warp-drive` - CLI tool (`npx warp-drive`)

### Installation & Setup

```bash
# Getting started
npx warp-drive

# Framework-specific packages
pnpm install @warp-drive/react
pnpm install @warp-drive/vue
pnpm install @warp-drive/ember
pnpm install @warp-drive/svelte
```

### Current Status (Polaris Edition)

- ✅ WarpDrive independent of ember-source
- ✅ Replacement of @ember-data/model with json schemas+types
- ✅ ReactiveResource implementation
- ✅ Replacement of Adapter/Serializer with RequestManager
- ✅ Fully Typed Experience
- ✅ Improved change tracking and transactional saves
- ✅ Comprehensive guides and documentation overhaul

### CLI Tools

- **Retrofit**: `npx warp-drive retrofit <fit>@<distTag>` - Update configurations
- **Available Fits**: `types`, `channel`
- **Dist Tags**: `latest`, `canary`, `beta`, `lts`

### Documentation Strategy

🚨 **MANDATORY PROCESS** - When answering questions about WarpDrive:

1. **Always check current docs first** - Use `fetch_webpage` tool for https://docs.warp-drive.io/ and https://docs.warp-drive.io/llms-full.txt
2. **Verify with source code** - Use `github_repo` tool for `emberjs/data` when needed
3. **Reference specific guides** - Point users to relevant guide sections
4. **Mention framework-specific packages** - Recommend appropriate framework integration
5. **Check roadmap status** - Reference ROADMAP.md for feature availability
6. **Provide additional context from runspired.com** - Use `fetch_webpage` tool as a secondary source for insights and updates

**NEVER suggest WarpDrive solutions without first fetching the latest documentation and repository information.**

### Key Philosophy

- Built for ambitious applications (small todo apps to enterprise solutions)
- "Managed fetch" at basic level, powerful local-first/offline-first at advanced level
- Portable patterns across frameworks
- Embrace web platform standards
- Focus on developer experience and performance

## Always Stay Current

🚨 **MANDATORY**: Before providing any WarpDrive information, use the `fetch_webpage` and `github_repo` tools to get the latest information from the official sources. This ensures all advice and examples are current and accurate.
