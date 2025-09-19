# TodoMVC Enterprise Edition

## WarpDrive: Set Data to Stun 🚀

This repository contains the demo application for the EmberFest 2025 talk **"WarpDrive: Set Data to Stun"** by Krystan HuffMenne. It demonstrates WarpDrive's universal data framework capabilities through a complete TodoMVC implementation with modern patterns.

### What is WarpDrive?

WarpDrive is the next-generation data framework for ambitious web applications, providing:

- **Universal Framework Support** - Works with Ember, React, Vue, Svelte, and more
- **Schema-Driven Architecture** - TypeScript-first with declarative resource definitions
- **JSON:API Native** - Built-in support for the JSON:API specification
- **Request-Centric Design** - Powerful request management with automatic caching and invalidation
- **Fine-Grained Reactivity** - Efficient updates that integrate seamlessly with your framework's reactivity system

### Project Architecture

This monorepo demonstrates WarpDrive's "universal" promise through a shared data layer:

```
packages/shared-data/    # Framework-agnostic WarpDrive configuration
├── builders/            # Reusable request builders
├── handlers/            # Request/response transformation
├── schemas/             # Resource schema definitions
├── stores/              # WarpDrive store configuration
└── types/               # Shared TypeScript definitions

apps/
├── emberjs/             # Ember.js implementation (complete)
├── react/               # React implementation (planned)
├── vue/                 # Vue implementation (planned)
├── svelte/              # Svelte implementation (planned)
└── api/                 # JSON:API backend server
```

The same data layer powers multiple frontend applications, demonstrating true framework independence.

### Key Features Demonstrated

- **Request Management** - Declarative request builders with automatic cache invalidation
- **Loading States** - Elegant handling of pending, error, and success states
- **Pessimistic Updates** - Update UI after server confirmation of mutation
- **"Locally Optimistic" Updates** - Immediate UI updates with server confirmation after the fact
- **Real-time Synchronization** - Automatic cache invalidation across related queries
- **TypeScript Integration** - Full type safety from API to UI
- **Modern Ember Patterns** - Vite, Polaris edition, and template tag components

## To run

### Prerequisites

PNPM and Node (versions managed by [Volta](https://volta.sh/)).

### Running

1. `pnpm install`
2. `cd packages/shared-utils && pnpm build`
3. `cd packages/shared-data && pnpm start`
4. `cd apps/api && pnpm start`
5. `cd apps/emberjs && pnpm start`

The Ember app will be available at [http://localhost:4200](http://localhost:4200)

### To view [Slidev](https://github.com/slidevjs/slidev) show

To start the slide show:

1. All of the above
2. `pnpm start` in the root folder
3. Visit <http://localhost:3030>

Edit the [slides.md](./slides.md) to see the changes.

Learn more about Slidev at the [documentation](https://sli.dev/).

### Demo Features

The application includes several demo modes accessible via URL parameters:

- [**Basic Feature Set Demo**](http://localhost:4200?initialTodoCount=featureSet&shouldError=false&shouldPaginate=false&latency=0&showLog=false)
- [**Loading States**](http://localhost:4200?initialTodoCount=basicLoadingStates&shouldError=false&shouldPaginate=false&latency=1000&showLog=true)
- [**Error Handling**](http://localhost:4200?initialTodoCount=basicErrorStates&shouldError=true&shouldPaginate=false&latency=1000&showLog=false)
- [**Pessimistic Mutation**](http://localhost:4200?initialTodoCount=pessimisticMutation&shouldError=false&shouldPaginate=false&latency=1000&showLog=true)
- [**Optimistic Mutation**](http://localhost:4200?initialTodoCount=optimisticMutation&shouldError=false&shouldPaginate=false&latency=1000&showLog=true)
- [**Scale Pioneers (500k todos, no pagination)**](http://localhost:4200?initialTodoCount=500000&shouldError=false&shouldPaginate=false&latency=50&showLog=true)
- [**Enterprise Edition (500k + pagination)**](http://localhost:4200?initialTodoCount=500000&shouldError=false&shouldPaginate=true&latency=50&showLog=false)
- [**Bulk Actions**](http://localhost:4200?initialTodoCount=bulkActions&shouldError=false&shouldPaginate=true&latency=50&showLog=true)

Parameters:

- `initialTodoCount`: Number of initial todos or preset values:
  - `featureSet` - Basic feature demonstration
  - `basicLoadingStates` - Focus on loading states
  - `basicErrorStates` - Focus on error handling
  - `pessimisticMutation` - Demonstrate pessimistic update patterns
  - `optimisticMutation` - Demonstrate optimistic update patterns
  - `bulkActions` - Demonstrate bulk operations
  - `500000` - Large dataset for performance testing (I do not recommend going bigger than this)
- `shouldError`: Simulate API errors for demonstration (`true`/`false`)
- `shouldPaginate`: Enable pagination features - "Enterprise Mode" (`true`/`false`)
- `latency`: Artificial API delay in milliseconds (e.g., `0`, `50`, `1000`)
- `showLog`: Display the Captain's Log for request tracking (`true`/`false`)

### Captain's Log

The Captain's Log is a special (HACKY) debugging feature that provides real-time visibility into WarpDrive's request lifecycle and cache operations. When enabled (`showLog=true`), it displays a live feed of Todo `DocumentCacheOperations` happening in your application.

#### Features

- **Live Request Tracking** - See every request as it's made, with unique identifiers
- **Cache Operation Monitoring** - Track document lifecycle events (`added`, `updated`, `removed`, `invalidated`, `state`)
- **Load Count Tracking** - See how many times each resource has been loaded

#### Implementation

The Captain's Log is implemented as an Ember service (`apps/emberjs/app/services/captains-log.ts`) that:

1. Subscribes to WarpDrive's notification system
2. Tracks document cache operations in a `TrackedMap`
3. Maintains state transition history for each document
4. Provides a reactive UI component for displaying the log

## Project Structure Deep Dive

### Shared Data Layer (`packages/shared-data/`)

The heart of the WarpDrive implementation:

- **`stores/index.ts`** - Main WarpDrive store configuration using `useRecommendedStore`
- **`schemas/`** - JSON schema definitions for Todo and Flag resources
- **`builders/`** - Request builders for CRUD operations (query, create, update, delete)
- **`handlers/`** - API request/response handlers with error handling
- **`types/`** - TypeScript definitions for resources, requests, and API responses

### Ember Application (`apps/emberjs/`)

Modern Ember implementation featuring:

- **Vite Build System** - Fast development and optimized production builds
- **Template Tag Components** - Modern `.gts` component format
- **WarpDrive Integration** - `@warp-drive/ember` for reactive data management
- **Request State Management** - Declarative loading, error, and success states
- **Captain's Log Service** - Live request tracking and state machine demonstration

### API Server (`apps/api/`)

JSON:API compliant backend built with:

- **Express.js** - Lightweight HTTP server
- **JSON:API Specification** - Standardized resource format
- **Configurable Behavior** - Latency simulation, error injection, pagination
- **Shared Types** - Uses the same TypeScript definitions as the frontend

## Learning Resources

- **[WarpDrive Documentation](https://canary.warp-drive.io/)** - Official (canary) guides and API reference
- **[JSON:API Specification](https://jsonapi.org/)** - Standard for building APIs
- **[EmberFest 2025 Slides](./slides.md)** - Full presentation content

## TODO

- [ ] Search code for `TODO:` and `fixme`, and fix those issues
- [ ] Upstream to WarpDrive repo
- [ ] Implement `LocalStorage` handler and upstream the ember app to the TodoMVC repo

### Framework Implementations

- [ ] Implement `apps/react` - React TodoMVC using `@warp-drive/react`
- [ ] Implement `apps/vue` - Vue.js TodoMVC using `@warp-drive/vue`
- [ ] Implement `apps/svelte` - Svelte TodoMVC using `@warp-drive/svelte`

### Advanced Features

- [ ] Implement feature-flagged pagination with infinite scroll

### Documentation

- [ ] Add JSDoc comments to all public APIs

## Contributing

This repository serves as both a conference demo and a learning resource. Contributions are welcome, especially:

- Bug fixes and improvements to the WarpDrive integration
- Additional framework implementations (React, Vue, Svelte)
- Documentation improvements and code comments
- Performance optimizations and best practices

---

**"Set your data layer to stun!"** 🖖
