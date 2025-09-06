# WarpDrive: Set Data to Stun

## Introduction (5 minutes)

### Opening Hook

I was going to call this talk "WarpDrive for Dummies" but:

- "for Dummies" is a trademark (mention Noah's cease and desist)
- We're not dummies. In fact, some of us know quite a lot about data libraries.

In fact, you might know quite a bit about one data library in particular (show EmberData logo) and you might even be expecting me to talk about that library, but I'm not.

Instead, I want us to explore WarpDrive with fresh eyes, like you've never seen a data framework before.

_"Space: the final frontier..."_ - Today we're going on a mission to explore strange new patterns, seek out new architectures, and boldly go where our data has never gone before.

### About Your Captain for This Mission

Before we embark, let me introduce myself - I'm your guide through the WarpDrive universe:

- **Mother of two** - So I understand the importance of reliable, predictable systems that just work
- **Portland, Oregon** - Where I live among the coffee shops and rain
- **Ember veteran since Ember v2** - I've been writing Ember applications for nearly a decade
- **Staff Engineer at AuditBoard** - Building AI-first GRC (Governance, Risk & Compliance) software that helps enterprise teams manage risk and drive compliance
- **Member of the Ember Data & Tooling Teams** - I'm passionate about making data management both powerful and type-safe

I've seen the evolution of data patterns in Ember from the early days, and I'm excited to show you where we're boldly going next.

---

## Episode 1: "What is WarpDrive?" (8 minutes)

### WarpDrive is...

**the lightweight data framework for ambitious web applications**

- 🌌 **Universal** - Works with any framework (Ember, React, Vue, Svelte)
- ⚡ **Performance** - Committed to best-in-class performance
- 💚 **Typed** - Fully typed, ready to rock
- 🚀 **Scalable** - From weekend hobby to enterprise

### "Boldly Go Where No Data Has Gone Before"

Unlike traditional data libraries, WarpDrive is built around:

- **Resource-first architecture** instead of model-heavy inheritance patterns
- **Schema-driven development** rather than class-based models with complex lifecycle hooks
- **Universal framework compatibility** vs. framework-specific implementations
- **Fine-grained reactivity** that just works
- **Schema-driven patterns** for consistent data shapes
- **Universal compatibility** for a consistent data layer across multiple applications, independent of the framework(s)

### The Universal Promise

_Show slide: Multi-framework architecture_
(some sort of joke about "separate the saucer section"?)

```
📦 shared-data-layer
├── 🌌 @warp-drive/core
├── 🛸 builders/
├── 🛸 handlers/
├── 📊 schemas/
└── 💿 store/

🚀 ember-app
└── @warp-drive/ember

⚛️ react-app
└── @warp-drive/react

📱 vue-app
└── @warp-drive/vue
```

This isn't just theory - we can literally share our data layer across multiple applications.

---

## Episode 2: "Engage! - Setting Up Our Mission" (7 minutes)

### The Mission Brief

We'll implement a TodoMVC application step-by-step using:

- **WarpDrive** (our starship for data management)
- **JSON:API** (the gold standard for API communication)
- **TypeScript** (because we like our data typed and our code safe)
- **Modern Ember Polaris** (the latest and greatest Ember patterns)

By the end, you'll see how WarpDrive makes data management feel... _logical_.

### JSON:API: The Universal Translator

By default, WarpDrive speaks JSON:API fluently, giving you:

- **Standardized format** for resources, relationships, and errors
- **Consistent patterns** across all your APIs
- **Built-in pagination, filtering, and sorting** conventions
- **Media type negotiation** with `application/vnd.api+json`

_"Universal translator online, Captain. All API communications are now standardized."_

(But, you can configure WarpDrive to use other formats if you prefer!)

### The Universal Architecture

```
📦 shared-data-layer    ← Start here (framework agnostic)
├── 🌌 @warp-drive/core
├── 🛸 builders/
├── 🛸 handlers/
├── 📊 schemas/
└── 💿 store/

🚀 ember-app           ← Then integrate with frameworks
└── @warp-drive/ember

⚛️ react-app
└── @warp-drive/react

📱 vue-app
└── @warp-drive/vue
```

This approach means your data logic lives outside any specific framework!

### Getting Started with WarpDrive

Let's start with the foundation - our shared data layer:

TODO: This is a placeholder for package creation and installation steps.

```bash
# Create a shared data package that any framework can use
mkdir shared-data-layer
cd shared-data-layer
pnpm init
pnpm install @warp-drive/core
```

¹ `npx warp-drive` scaffolding tool: https://github.com/emberjs/data/pull/9471

### TodoMVC: Our Prime Directive

Let's implement the classic TodoMVC, but with WarpDrive powering our data layer.

_Show the basic todo structure_:

```typescript
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created: Date;
}
```

## Episode 3: "Request Patterns - Making It So" (10 minutes)

### The RequestManager - Mission Control

Before we build requests, let's understand WarpDrive's request architecture:

```typescript
// TODO: Example RequestManager setup
```

The RequestManager handles all HTTP communication:

- **Fetch Handler** - Makes actual network requests
- **Cache Integration** - Automatically caches responses
- **Request Pipeline** - Allows custom handlers for data transformation

Think of it as your ship's communications officer - it manages all external contact!

### Making Requests

FIXME: Show a simple example of making a request using the RequestManager. Something like...:

```typescript
// shared-data-layer/utils/todo-request.ts
import { Todo } from '../schemas/todo';

export function getAllTodos() {
  return this.requestManager.get<Todo[]>('/api/todo', {
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
  });
}
```

### Request Builders

WarpDrive uses typed request builders in your shared data layer:

```typescript
// shared-data-layer/builders/todo.ts
import { withBrand } from '@warp-drive/core/types/request';

// What is `withBrand`? It adds TypeScript type information to requests
// so WarpDrive knows what type of data to expect back

export function getAllTodos() {
  return withBrand<Todo[]>({
    method: 'GET',
    url: '/api/todo',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
  });
}

export function createTodo(title: string) {
  return withBrand<Todo>({
    method: 'POST',
    url: '/api/todo',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
    body: JSON.stringify({
      data: {
        type: 'todo',
        attributes: {
          title,
          completed: false,
        },
      },
    }),
  });
}
```

### Built-in JSON:API Builders

Why write all that boilerplate? WarpDrive includes built-in JSON:API request builders:

```typescript
// shared-data-layer/builders/todo.ts
import {
  findRecord,
  findAll,
  createRecord,
} from '@warp-drive/json-api/request';

// Much simpler with built-in builders!
export const getAllTodos = () => findAll('todo');
export const getTodo = (id: string) => findRecord('todo', id);
export const createTodo = (attributes: NewTodo) =>
  createRecord('todo', attributes);
```

These built-in builders automatically:

- Set correct headers (`application/vnd.api+json`)
- Handle JSON:API document structure
- Provide proper TypeScript types
- Work with any JSON:API compliant backend

#### Recap

**So far we've covered:**

- ✅ WarpDrive's universal architecture
- ✅ Setting up our shared data layer
- ✅ Understanding the RequestManager

**Next up:** Let's define our data structures with schemas!

---

## Episode 4: "Schemas - The DNA of Your Data" (10 minutes)

### Schema-Driven Development

Instead of models with complex inheritance, WarpDrive uses simple, declarative schemas:

```typescript
// shared-data-layer/schemas/todo.ts
import { withDefaults } from '@warp-drive/core/reactive';

export const TodoSchema = withDefaults({
  type: 'todo', // JSON:API resource type
  fields: [
    { kind: 'field', name: 'id', type: 'string' },
    { kind: 'field', name: 'title', type: 'string' },
    { kind: 'field', name: 'completed', type: 'boolean' },
    { kind: 'field', name: 'created', type: 'luxon-date' },
    {
      kind: 'derived',
      name: 'status',
      type: 'conditional',
      options: {
        field: 'completed',
        whenTrue: 'Complete',
        whenFalse: 'Active',
      },
    },
  ],
});
```

**What does `withDefaults` do?** It creates a schema with built-in TypeScript types and reactive behaviors. No class inheritance needed!

### The Magic of Derived Fields

Notice that `status` field? It's **derived** - automatically calculated based on other fields. No more manual property updates!

### Schema Registration

```typescript
// shared-data-layer/store/index.ts
import { AppStore } from './app-store';
import { TodoSchema } from '../schemas/todo';

export function createAppStore() {
  const store = new AppStore();

  // Register our schemas
  store.registerSchema(TodoSchema);

  return store;
}
```

### TypeScript Integration

```typescript
// Automatically generated types
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created: Date;
  status: 'Complete' | 'Active'; // Derived field!
}

// Different states have different requirements
type NewTodo = Omit<Todo, 'id' | 'created' | 'status'>; // For creating
type Todo = Todo; // For existing records
```

_"Data, are you getting readings on this?"_ - Yes, and they're perfectly structured!

### Shared Store Setup

#### What is the WarpDrive Store?

The WarpDrive store is your **mission control center** for data management:

- **Central hub** for managing all your data resources
- **Handles fetching** - Smart request management with deduplication
- **Manages caching** - Efficient memory usage with automatic cleanup
- **Reactive updates** - Components automatically re-render when data changes
- **Type-safe** - Full TypeScript support throughout

Think of it as the bridge of our starship - everything flows through here!

#### How Do I Make One?

Creating a WarpDrive store starts simple and grows with your needs:

```typescript
// shared-data-layer/store/index.ts
import { Cache, Fetch, Store, RequestManager } from '@warp-drive/core';

export class AppStore extends Store {
  requestManager = new RequestManager().use([Fetch]);

  createCache(storeWrapper) {
    return new Cache(storeWrapper);
  }
}
```

#### How Do I Set Up the Cache?

The cache automatically handles your data - just register your schemas:

```typescript
// shared-data-layer/store/index.ts
import { AppStore } from './app-store';
import { TodoSchema } from '../schemas/todo';

// Register schemas when creating your store
const store = new AppStore();
store.registerSchema(TodoSchema);
```

**Schema checkpoint:**

- ✅ Declarative schema definition with `withDefaults`
- ✅ Derived fields for computed properties
- ✅ Schema registration with the store
- ✅ Type-safe resources

**Next up:** Let's see this in action with Ember UI!

---

## Episode 5: "Reactive UI - Ember Integration as Example" (8 minutes)

### JSON:API Response Format

WarpDrive works seamlessly with JSON:API responses:

```json
// GET /api/todo response
{
  "data": [
    {
      "type": "todo",
      "id": "1",
      "attributes": {
        "title": "Learn WarpDrive",
        "completed": false,
        "created": "2025-01-08T10:00:00Z"
      },
      "links": {
        "self": "/api/todo/1"
      }
    },
    {
      "type": "todo",
      "id": "2",
      "attributes": {
        "title": "Build TodoMVC",
        "completed": true,
        "created": "2025-01-08T09:00:00Z"
      },
      "links": {
        "self": "/api/todo/2"
      }
    }
  ],
  "links": {
    "self": "/api/todo"
  }
}
```

_"Make it so!" - And WarpDrive makes it typed._

**Request patterns and Store checkpoint:**

- ✅ RequestManager handles all HTTP communication
- ✅ Custom request builders with TypeScript types
- ✅ Built-in JSON:API builders for common patterns
- ✅ Store coordinates requests and manages cache

Now let's integrate our shared data layer with Ember to see reactive patterns in action.

### Ember Integration Setup

Now let's integrate our shared data layer with Ember:

```bash
# In your ember-app directory
pnpm install @warp-drive/ember
```

FIXME: Set up Store Service for Ember

### Components with Reactive Magic

Here's where WarpDrive really shines - reactive control flow:

```gts
// components/todo-list.gts
import { Request } from '@warp-drive/ember';
import { getAllTodos } from '../requests/todo-requests';
import TodoItem from './todo-item';
import LoadingSpinner from './loading-spinner';

export default <template>
  <Request @query={{(getAllTodos)}}>
    <:loading as |state|>
      <LoadingSpinner @progress={{state.completedRatio}} />
      <button {{on "click" state.abort}}>Cancel</button>
    </:loading>

    <:error as |error state|>
      <div class="error">
        <h3>Something went wrong!</h3>
        <p>{{error.message}}</p>
        <button {{on "click" state.retry}}>Try Again</button>
      </div>
    </:error>

    <:content as |result|>
      <ul class="todo-list">
        {{#each result.data as |todo|}}
          <TodoItem @todo={{todo}} />
        {{/each}}
      </ul>
    </:content>
  </Request>
</template>
```

### No More Loading State Juggling

The `Request` component handles:

- Loading states with progress
- Error states with retry
- Success states with data
- Automatic re-rendering when data changes

_"Counselor Troi senses your loading states are perfectly managed."_

### How Does the Request Component Work?

The `Request` component is a thin wrapper around WarpDrive's `getRequestState`:

```typescript
// Under the hood in @warp-drive/ember
import { getRequestState } from '@warp-drive/core/request';

export default class RequestComponent extends Component {
  @tracked requestState = null;

  constructor() {
    super(...arguments);
    this.requestState = getRequestState(this.args.query);
  }
}
```

**Universal Framework Support**: We provide similar wrappers for other frameworks:

- `@warp-drive/react` - React hooks for request state
- `@warp-drive/vue` - Vue composables
- `@warp-drive/svelte` - Svelte stores

The core logic stays the same - only the framework integration changes!

---

## Episode 6: "Data Mutations - Quantum Mechanics" (7 minutes)

### Controlled Mutation with Checkout

WarpDrive handles mutations through a "checkout" system:

```typescript
// components/todo-item.gts
import { Checkout } from '@warp-drive/core/reactive';

export default class TodoItem extends Component {
  @service declare private readonly store: Store;

  toggleCompleted = async () => {
    // Check out the todo for editing
    const editableTodo = await this.args.todo[Checkout]();

    // Make our changes
    editableTodo.completed = !editableTodo.completed;

    // Save to server using JSON:API format
    await this.store.request({
      method: 'PATCH',
      url: `/api/todo/${editableTodo.id}`,
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'todo',
          id: editableTodo.id,
          attributes: {
            completed: editableTodo.completed,
          },
        },
      }),
    });
  };
}
```

### Immutability Without the Hassle

- Original data stays immutable
- Changes are isolated until saved
- Automatic rollback on errors
- Optimistic updates that work

_"Captain, the data has been successfully modified without temporal paradoxes!"_

---

## Episode 7: "Universal Deployment - Separate the Data Layer" (5 minutes)

### Framework Agnostic Architecture

Here's the real magic - our data layer is completely portable:

```typescript
// packages/shared-data/
├── schemas/
│   ├── todo.ts
│   └── user.ts
├── requests/
│   ├── todo-requests.ts
│   └── user-requests.ts
└── store/
    └── app-store.ts
```

### Multiple Apps, One Data Layer

```typescript
// ember-app/app.ts
import { AppStore } from 'shared-data/store';
export default class App extends Application {
  // Ember-specific bindings
}

// react-app/src/main.tsx
import { AppStore } from 'shared-data/store';
// React-specific bindings

// vue-app/src/main.ts
import { AppStore } from 'shared-data/store';
// Vue-specific bindings
```

_"Separate the saucer section! Both parts of the ship continue to function independently."_

The key insight: By building our data layer in a separate package in the monorepo, we achieve true framework independence. Your schemas, request builders, and business logic live outside any specific UI framework.

---

## Episode 8: "Advanced Patterns - Warp 9.8" (8 minutes)

### Real-time with Surgical Updates

Let's say we want to update a todo based on a WebSocket message:

```typescript
// Real-time todo updates via WebSocket using JSON:API format
store.cache.patch({
  op: 'updateRecord',
  record: { type: 'todo', id: '1' },
  value: {
    data: {
      type: 'todo',
      id: '1',
      attributes: {
        completed: true,
      },
    },
  },
});
```

### Custom Request Handlers

Sometimes your API doesn't follow standards. Handlers let you adapt without changing your application code:

```typescript
// shared-data-layer/handlers/snake-case-handler.ts
const SnakeCaseHandler = {
  request(context, next) {
    // Convert request data to snake_case
    const modifiedRequest = convertKeysToSnakeCase(context.request);

    return next(modifiedRequest).then((result) => {
      // Convert response back to camelCase
      return {
        ...result,
        content: convertKeysToCamelCase(result.content),
      };
    });
  },
};

// Register the handler
store.requestManager.use([SnakeCaseHandler, Fetch]);
```

Now your entire app can use camelCase while your API uses snake_case!

---

## Episode 9: "Performance - Ludicrous Speed" (5 minutes)

(Spaceballs reference...we're mixing our metaphors here, but it's fine...)

### Built for Performance

WarpDrive optimizes automatically:

- **Request deduplication** - Same request? Use cached result
- **Fine-grained reactivity** - Only update what actually changed
- **Lazy evaluation** - Derived fields computed on demand
- **Memory efficient** - Immutable data with structural sharing

### Bundle Size Comparison

TODO: Confirm this w/ @runspired. Is this made up? lol

WarpDrive's modular architecture keeps bundles lean:

```
Traditional monolithic data layer: ~45kb+
WarpDrive approach:
  @warp-drive/core: ~12kb
  Framework adapter: ~3kb
  Your schemas & builders: ~2kb
  Total: ~17kb (significantly smaller!)
```

### Performance Benefits

TODO: Confirm this w/ @runspired. Is this made up? lol

WarpDrive's architecture delivers measurable improvements:

_Performance comparison based on TodoMVC benchmarks:_

- **Faster initial render** - Schema-driven approach reduces startup overhead
- **Efficient updates** - Fine-grained reactivity updates only what changed
- **Lower memory usage** - Immutable data with structural sharing
- **Request deduplication** - Automatic caching prevents redundant network calls

_"She's giving us all she's got, Captain, and she's still got more in reserve!"_

---

## Episode 10: "The Future - Final Frontier" (3 minutes)

### What's Next for WarpDrive

- **Edge computing** integration
- **Offline-first** capabilities
- **AI-powered** caching strategies
- **Multi-platform** expansion (React Native, Electron, etc.)

### Community & Ecosystem

- **Open source** and MIT licensed
- **Framework integrations** actively maintained
- **Growing community** of contributors
- **Comprehensive documentation** at docs.warp-drive.io

### Roadmap Highlights

WarpDrive is actively evolving with the community. Key areas of development:

- Enhanced TypeScript tooling for better DX
- Performance optimizations for large datasets
- More framework integrations beyond the big four
- Advanced offline synchronization patterns

_"Space: the final frontier. These are the voyages of the starship WarpDrive..."_

---

## Conclusion: "Live Long and Prosper" (2 minutes)

### What We've Discovered

Today we've built a complete TodoMVC application and seen how WarpDrive delivers:

- ✅ **Universal compatibility** - One data layer, any framework
- ✅ **Type safety** - Schema-driven TypeScript integration
- ✅ **Performance** - Fine-grained reactivity and smart caching
- ✅ **Developer experience** - Declarative patterns that eliminate boilerplate
- ✅ **Reactive patterns** - Request component handles all loading states
- ✅ **JSON:API compliance** - Standards-based API communication
- ✅ **Advanced features** - Real-time updates, custom handlers, relationships

### Our Journey Recap

🚀 **Episode 1-2**: Introduced WarpDrive and set up our universal architecture
🌐 **Episode 3**: Built request patterns with RequestManager, custom and built-in builders
📊 **Episode 4**: Defined schemas with TypeScript for resources
⚡ **Episode 5**: Created reactive UI with Ember integration as example
🔄 **Episode 6**: Handled mutations with the checkout system
🌌 **Episode 7**: Demonstrated universal deployment by separating the data layer
🚀 **Episode 8**: Explored advanced patterns and real-time updates
⚡ **Episode 9**: Analyzed performance benefits
🔭 **Episode 10**: Looked toward the future

### Your Mission, Should You Choose to Accept It

1. Try WarpDrive in your next project: `npx warp-drive`
2. Explore the guides at **docs.warp-drive.io**
3. Join the community discussions
4. Build something ambitious!

### Final Thought

_"The human adventure is just beginning..."_

And so is your journey with WarpDrive. The data is out there - go boldly and fetch it efficiently.

**Questions? Let's explore the unknown together!**

---

## Appendix: Additional Resources

- **Live Demo**: TodoMVC repository on GitHub
- **Documentation**: docs.warp-drive.io
- **Community**: discord.gg/emberjs
- **Blog posts**: runspired.com for deep dives
- **Examples**: Framework-specific implementations
