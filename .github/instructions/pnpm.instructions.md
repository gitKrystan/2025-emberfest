# Package Manager Instructions

## 🚨 MANDATORY: Always Use pnpm

When working with this project or providing code examples, you MUST always use `pnpm` as the package manager.

### ✅ Correct Usage:

```bash
pnpm install
pnpm add @warp-drive/core
pnpm install @warp-drive/ember
pnpm run build
pnpm run dev
```

### ❌ Never Use:

- `npm install`
- `yarn add`
- `npm run`
- Any other package manager commands

### Why pnpm?

1. **Performance** - Faster installs and better disk space usage
2. **Consistency** - This project is configured for pnpm
3. **Modern Standards** - pnpm is the preferred package manager for modern JavaScript projects
4. **Workspace Support** - Better monorepo and workspace management

### Project-Specific Requirements:

- All installation commands in code examples must use `pnpm`
- All package.json scripts should be run with `pnpm run`
- Documentation and tutorials must reference `pnpm` commands
- Conference talk examples should demonstrate `pnpm` usage

### Exception Handling:

If you encounter a situation where pnpm is not available or cannot be used:

1. First, suggest installing pnpm: `npm install -g pnpm`
2. Only then provide alternative commands with a clear note about the preference for pnpm

**This instruction takes precedence over any other package manager suggestions.**
