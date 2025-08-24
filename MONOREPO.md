# EmberFest 2025 - WarpDrive "Set Data to Stun" Monorepo

This is a pnpm monorepo showcasing WarpDrive data layer implementation across different frameworks.

## Structure

```
├── apps/
│   └── emberjs/           # Ember.js TodoMVC implementation
├── packages/
│   ├── shared-data/       # Shared WarpDrive data layer
│   └── shared-utils/      # Shared utilities
├── pnpm-workspace.yaml    # pnpm workspace configuration
└── package.json           # Root package.json
```

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start the Ember app:

   ```bash
   cd apps/emberjs
   pnpm start
   ```

3. Build all apps:
   ```bash
   pnpm run build:apps
   ```

## Workspace Commands

- `pnpm run build:apps` - Build all apps
- `pnpm run dev:apps` - Start all apps in development mode
- `pnpm run lint:apps` - Lint all apps
- `pnpm run test:apps` - Test all apps

## Packages

### @workspace/shared-data

Contains the shared WarpDrive data layer implementation that can be used across multiple framework implementations.

### @workspace/shared-utils

Contains shared utilities that can used independent of the framework.

## Adding New Apps

To add a new framework implementation:

1. Create a new directory under `apps/`
2. Add the shared data dependency: `"@workspace/shared-data": "workspace:*"`
3. Import and use the shared data layer in your app
