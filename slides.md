---
theme: ./theme
title: 'WarpDrive: Set Data to Stun'
info: |
  Discover WarpDrive, the next-generation data framework that brings universal compatibility and performance to ambitious web applications.

  This talk explores WarpDrive's schema-driven architecture through building a real application, demonstrating how to boldly go where your data has never gone before with a truly framework-agnostic layer. Learn how WarpDrive's TypeScript-first approach delivers enterprise-grade features while eliminating traditional data management complexity.
author: Krystan HuffMenne
keywords: WarpDrive,EmberData,JavaScript,TypeScript,Framework,Data Layer,EmberFest
lineNumbers: true
drawings:
  enabled: true
  persist: false
transition: slide-left
mdc: true
---

# WarpDrive: Set Data to Stun

## EmberFest 2025

Krystan HuffMenne • Staff Engineer @ AuditBoard

<div class="abs-br m-6 flex gap-2 z-10">
  <a href="https://github.com/gitKrystan/2025-emberfest" target="_blank" alt="GitHub" title="Open in GitHub"
    class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon-logo-github />
  </a>
</div>

<!--
I was going to call this talk "WarpDrive for Dummies" but we're not dummies. Some of us know quite a lot about data libraries.
-->

---
layout: default
---

# A Fresh Perspective

<v-click>

You might know quite a bit about **one data library** in particular...

</v-click>

<v-click>

And you might even be expecting me to talk about that library.

</v-click>

<v-click>

**But I'm not.**

</v-click>

<v-click>

<div class="callout max-w-2xl float-right">
Today we're going on a mission to <strong>explore strange new patterns</strong>, seek out new architectures, and <strong>boldly go where our data has never gone before</strong>.
</div class="callout">

</v-click>

---
layout: image-right
image: '/images/captain-profile.jpg'
---

# About Your Captain for This Mission

<div class="callout">

<p>Portland, Oregon</p>
<p>Answers to "mom"</p>
<p>Staff Engineer at AuditBoard</p>
<p>EmberData/WarpDrive & Tooling Teams</p>
<p>Ember veteran since v2</p>

</div>

<!--
Before we embark, let me introduce myself - I'm your guide through the WarpDrive universe...

 🌧️ **Portland, Oregon** - Where I live among the coffee shops and rain
- 👩‍👧‍👦 **Mother of two** - I understand the importance of reliable, predictable systems that just work
- 🛡️ **Staff Engineer at AuditBoard** - Building AI-first GRC software for enterprise risk
- ⚡ **Ember Data & Tooling Teams** - Passionate about making data management both powerful and type-safe
- 🔥 **Ember veteran since v2** - Nearly a decade of writing Ember applications
-->

---
layout: center
---

# The Evolution Continues

I've seen the evolution of data patterns in Ember from the early days,<br />and I'm excited to show you where we're **boldly going next**.

---
layout: section
---

# Episode 1

## "What is WarpDrive?"

---

# WarpDrive is...

...the lightweight data framework for ambitious web applications.

<div class="grid grid-cols-2 gap-4">

<v-clicks>

<div class="callout-solid">
  <h3>Universal</h3>
  <p>Works with any framework (Ember, React, Vue, Svelte)</p>
</div>

<div class="callout-solid">
  <h3>Performant</h3>
  <p>Committed to best-in-class performance</p>
</div>

<div class="callout-solid">
  <h3>Typed</h3>
  <p>Fully typed, ready to rock</p>
</div>

<div class="callout-solid">
  <h3>Scalable</h3>
  <p>From weekend hobby to enterprise</p>
</div>

</v-clicks>

</div>

---

# "Boldly Go Where No Data Has Gone Before"

Unlike traditional data libraries, WarpDrive is built around:

<v-clicks>

- **Resource-first architecture** <span class="text-gray-400">instead of model-heavy inheritance patterns</span>
- **Schema-driven development** <span class="text-gray-400">rather than class-based models with complex lifecycle hooks</span>
- **Universal framework compatibility** <span class="text-gray-400">vs. framework-specific implementations</span>
- **Fine-grained reactivity** <span class="text-gray-400">that just works</span>
- **Schema-driven patterns** <span class="text-gray-400">for consistent data shapes</span>
- **Universal compatibility** <span class="text-gray-400">for a consistent data layer across multiple applications, independent of the framework(s)</span>

</v-clicks>

---

# The Universal Promise

"Separate the saucer section!"

<div class="grid grid-cols-2 gap-4">

<div class="callout">

```{all}
📦 shared-data-layer
├── 🌌 @warp-drive/core
├── 🛸 builders/
├── 👋 handlers/
├── 📊 schemas/
└── 💿 store/

🐹 ember-app
└── @warp-drive/ember

⚛️ react-app
└── @warp-drive/react

👀 vue-app
└── @warp-drive/vue

```

</div>

<v-click>

<div class="callout-solid bg-lcars-magenta text-2xl">
<strong>This isn't just theory</strong> - we can literally share our data layer across multiple applications.
</div>

</v-click>

</div>

---
layout: section
---

# Episode 2

## "Engage! - Setting Up Our Mission"

---

# The Mission Brief

We'll implement a TodoMVC application step-by-step using:

<v-clicks>

- **WarpDrive** <span class="text-gray-400">(our starship for data management)</span>
- **JSON:API** <span class="text-gray-400">(the gold standard for API communication)</span>
- **TypeScript** <span class="text-gray-400">(because we like our data typed and our code safe)</span>
- **Modern Ember Polaris** <span class="text-gray-400">(the latest and greatest Ember patterns)</span>

</v-clicks>

<v-click>

<div class="callout mt-8 float-right">
By the end, you'll see how WarpDrive makes data management feel... <em>logical</em>.
</div>

</v-click>

---

# JSON:API: The Universal Translator

By default, WarpDrive speaks JSON:API fluently, giving you:

<v-clicks>

- **Standardized format** for resources, relationships, and errors
- **Consistent patterns** across all your APIs
- **Built-in pagination, filtering, and sorting** conventions

</v-clicks>

<v-click>

<div class="callout mt-10 float-right max-w-lg">
"Universal translator online, Captain. All API communications are now standardized."
</div>

</v-click>

<v-click>

<div class="mt-4 text-sm text-gray-400 max-w-xs">
(But, you can configure WarpDrive to use other formats if you prefer!)
</div>

</v-click>

---

# TodoMVC: Our Prime Directive

Let's implement the classic TodoMVC, but with WarpDrive powering our data layer.

<v-click>

<div class="callout max-w-xs m-auto mt-10">
```typescript
interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```
</div>

</v-click>

<!--
TodoMVC is a spec for a simple Todo app, implemented in multiple frameworks to compare approaches.

It's built around a simple Todo resource.
-->

---
layout: section
---

# Episode 3

## "Request Patterns - Making It So"

---

# The RequestManager

Think of it as your ship's communications officer - it manages all external contact!

<MacWindow title="packages/shared-data/src/stores/index.ts" class="max-w-2xl">
<<< @/packages/shared-data/src/stores/index.ts ts {21|26|22-27|28|21-28}{maxHeight: '200px'}
</MacWindow>

<v-clicks at=1>

- **Fetch Handler** - Makes actual network requests
- **Request Pipeline** - Allows custom handlers for data transformation
- **Cache Integration** - Automatically caches responses
- **Does What It Says** - On the tin

</v-clicks>

<v-click>

</v-click>

<!--
To make a WarpDrive request,
-->

---

# Request Builders

WarpDrive uses typed request builders in your shared data layer:

```typescript twoslash {1,5-7|9-13|15-25} {lines:true}
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

---

# Built-in JSON:API Builders

Why write all that boilerplate? WarpDrive includes built-in JSON:API request builders:

```typescript twoslash {1-5|7-12} {lines:true}
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

<v-click>

These built-in builders automatically:

- Set correct headers (`application/vnd.api+json`)
- Handle JSON:API document structure
- Provide proper TypeScript types
- Work with any JSON:API compliant backend

</v-click>

---

# Recap

**So far we've covered:**

<v-clicks>

- ✅ WarpDrive's universal architecture
- ✅ Setting up our shared data layer
- ✅ Understanding the RequestManager

</v-clicks>

<v-click>

**Next up:** Let's define our data structures with schemas!

</v-click>

---
layout: section
---

# Episode 4

## "Schemas - The DNA of Your Data"

<div class="text-6xl mb-8">🧬</div>

_10 minutes_

---

# Schema-Driven Development

Instead of models with complex inheritance, WarpDrive uses simple, declarative schemas:

```typescript twoslash {1,4-14} {lines:true}
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

<v-click>

**What does `withDefaults` do?** It creates a schema with built-in TypeScript types and reactive behaviors. No class inheritance needed!

</v-click>

---

# The Magic of Derived Fields

Notice that `status` field? It's **derived** - automatically calculated based on other fields.

<v-click>

```typescript {6-13}
{
  kind: 'derived',
  name: 'status',
  type: 'conditional',
  options: {
    field: 'completed',
    whenTrue: 'Complete',
    whenFalse: 'Active',
  },
}
```

</v-click>

<v-click>

<div class="mt-6 p-4 bg-green-900 rounded">
No more manual property updates!
</div>

</v-click>

---

# The WarpDrive Store

The WarpDrive store is your **mission control center** for data management:

<v-clicks>

- **Central hub** for managing all your data resources
- **Handles fetching** - Smart request management with deduplication
- **Manages caching** - Efficient memory usage with automatic cleanup
- **Reactive updates** - Components automatically re-render when data changes
- **Type-safe** - Full TypeScript support throughout

</v-clicks>

<v-click>

<div class="mt-6 p-4 bg-blue-900 rounded text-center">
Think of it as the bridge of our starship - everything flows through here!
</div>

</v-click>

---

# Creating a WarpDrive Store

Creating a WarpDrive store starts simple and grows with your needs:

```typescript {1,4-10} {lines:true}
// shared-data-layer/store/index.ts
import { Cache, Fetch, Store, RequestManager } from '@warp-drive/core';

export class AppStore extends Store {
  requestManager = new RequestManager().use([Fetch]);

  createCache(storeWrapper) {
    return new Cache(storeWrapper);
  }
}
```

<v-click>

The cache automatically handles your data - just register your schemas:

```typescript {5-6}
import { AppStore } from './app-store';
import { TodoSchema } from '../schemas/todo';

const store = new AppStore();
store.registerSchema(TodoSchema);
```

</v-click>

---

# TypeScript Integration

```typescript twoslash {1-8|10-12} {lines:true}
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

<v-click>

<div class="mt-6 text-center text-lg italic text-green-400">
"Data, are you getting readings on this?" - Yes, and they're perfectly structured!
</div>

</v-click>

---

# Schema Checkpoint

<v-clicks>

- ✅ Declarative schema definition with `withDefaults`
- ✅ Derived fields for computed properties
- ✅ Schema registration with the store
- ✅ Type-safe resources

</v-clicks>

<v-click>

**Next up:** Let's see this in action with Ember UI!

</v-click>

---
layout: section
---

# Episode 5

## "Reactive UI - Ember Integration"

<div class="text-6xl mb-8">⚛️</div>

_8 minutes_

---

# JSON:API Response Format

WarpDrive works seamlessly with JSON:API responses:

```json {2-15|16-18} {lines:true}
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
    }
  ],
  "links": {
    "self": "/api/todo"
  }
}
```

<v-click>

<div class="mt-6 text-center text-lg italic text-green-400">
"Make it so!" - And WarpDrive makes it typed.
</div>

</v-click>

---

# Components with Reactive Magic

Here's where WarpDrive really shines - reactive control flow:

```gts {4,6-8|10-15|17-23|25-31} {lines:true}
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

---

# No More Loading State Juggling

The `Request` component handles:

<v-clicks>

- Loading states with progress
- Error states with retry
- Success states with data
- Automatic re-rendering when data changes

</v-clicks>

<v-click>

<div class="callout float-right text-green-400">
"Counselor Troi senses your loading states are perfectly managed."
</div>

</v-click>

---

# Universal Framework Support

The core logic stays the same - only the framework integration changes!

<v-clicks>

- `@warp-drive/react` - React hooks for request state
- `@warp-drive/vue` - Vue composables
- `@warp-drive/svelte` - Svelte stores

</v-clicks>

<v-click>

```typescript {4-9} {lines:true}
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

</v-click>

---
layout: section
---

# Episode 6

## "Data Mutations - Quantum Mechanics"

<div class="text-6xl mb-8">🔄</div>

_7 minutes_

---

# Controlled Mutation with Checkout

WarpDrive handles mutations through a "checkout" system:

```typescript {8-17} {lines:true}
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
      // ... JSON:API payload
    });
  };
}
```

---

# Immutability Without the Hassle

<v-clicks>

- Original data stays immutable
- Changes are isolated until saved
- Automatic rollback on errors
- Optimistic updates that work

</v-clicks>

<v-click>

<div class="callout float-right text-green-400">
"Captain, the data has been successfully modified without temporal paradoxes!"
</div>

</v-click>

---
layout: section
---

# Episode 7

## "Universal Deployment"

<div class="text-6xl mb-8">🌌</div>

_5 minutes_

---

# Framework Agnostic Architecture

Here's the real magic - our data layer is completely portable:

```
📦 packages/shared-data/
├── schemas/
│   ├── todo.ts
│   └── user.ts
├── requests/
│   ├── todo-requests.ts
│   └── user-requests.ts
└── store/
    └── app-store.ts
```

---

# Multiple Apps, One Data Layer

```typescript {1-4|6-8|10-12} {lines:true}
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

<v-click>

<div class="callout float-right text-green-400">
"Separate the saucer section! Both parts of the ship continue to function independently."
</div>

</v-click>

<v-click>

<div class="mt-4 p-4 bg-blue-900 rounded">
By building our data layer in a separate package in the monorepo, we achieve true framework independence.
</div>

</v-click>

---
layout: section
---

# Episode 8

## "Advanced Patterns - Warp 9.8"

<div class="text-6xl mb-8">🚀</div>

_8 minutes_

---

# Real-time with Surgical Updates

WebSocket message updates:

```typescript {1-10} {lines:true}
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

---

# Custom Request Handlers

Sometimes your API doesn't follow standards. Handlers let you adapt without changing your application code:

```typescript {2-12|14-15} {lines:true}
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

<v-click>

Now your entire app can use camelCase while your API uses snake_case!

</v-click>

---
layout: section
---

# Episode 9

## "Performance - Ludicrous Speed"

<div class="text-6xl mb-8">⚡</div>

<div class="text-sm text-gray-400">
(Spaceballs reference...we're mixing our metaphors here, but it's fine...)
</div>

_5 minutes_

---

# Built for Performance

WarpDrive optimizes automatically:

<v-clicks>

- **Request deduplication** - Same request? Use cached result
- **Fine-grained reactivity** - Only update what actually changed
- **Lazy evaluation** - Derived fields computed on demand
- **Memory efficient** - Immutable data with structural sharing

</v-clicks>

---

# Bundle Size Comparison

WarpDrive's modular architecture keeps bundles lean:

```
Traditional monolithic data layer: ~45kb+
WarpDrive approach:
  @warp-drive/core: ~12kb
  Framework adapter: ~3kb
  Your schemas & builders: ~2kb
  Total: ~17kb (significantly smaller!)
```

<v-click>

<div class="callout float-right text-green-400">
"She's giving us all she's got, Captain, and she's still got more in reserve!"
</div>

</v-click>

---
layout: section
---

# Episode 10

## "The Future - Final Frontier"

<div class="text-6xl mb-8">🔭</div>

_3 minutes_

---

# What's Next for WarpDrive

<v-clicks>

- **Edge computing** integration
- **Offline-first** capabilities
- **AI-powered** caching strategies
- **Multi-platform** expansion (React Native, Electron, etc.)

</v-clicks>

---

# Community & Ecosystem

<v-clicks>

- **Open source** and MIT licensed
- **Framework integrations** actively maintained
- **Growing community** of contributors
- **Comprehensive documentation** at docs.warp-drive.io

</v-clicks>

<v-click>

<div class="callout float-right text-green-400">
"Space: the final frontier. These are the voyages of the starship WarpDrive..."
</div>

</v-click>

---
layout: section
---

# Conclusion

## "Live Long and Prosper"

<div class="text-6xl mb-8">🖖</div>

_2 minutes_

---

# What We've Discovered

Today we've built a complete TodoMVC application and seen how WarpDrive delivers:

<v-clicks>

- ✅ **Universal compatibility** - One data layer, any framework
- ✅ **Type safety** - Schema-driven TypeScript integration
- ✅ **Performance** - Fine-grained reactivity and smart caching
- ✅ **Developer experience** - Declarative patterns that eliminate boilerplate
- ✅ **Reactive patterns** - Request component handles all loading states
- ✅ **JSON:API compliance** - Standards-based API communication
- ✅ **Advanced features** - Real-time updates, custom handlers, relationships

</v-clicks>

---

# Our Journey Recap

<div class="grid grid-cols-2 gap-4 text-sm">

<v-clicks>

<div>🚀 **Episode 1-2**: Introduced WarpDrive and set up our universal architecture</div>
<div>🌐 **Episode 3**: Built request patterns with RequestManager</div>
<div>📊 **Episode 4**: Defined schemas with TypeScript for resources</div>
<div>⚡ **Episode 5**: Created reactive UI with Ember integration</div>
<div>🔄 **Episode 6**: Handled mutations with the checkout system</div>
<div>🌌 **Episode 7**: Demonstrated universal deployment</div>
<div>🚀 **Episode 8**: Explored advanced patterns and real-time updates</div>
<div>⚡ **Episode 9**: Analyzed performance benefits</div>
<div>🔭 **Episode 10**: Looked toward the future</div>

</v-clicks>

</div>

---

# Your Mission, Should You Choose to Accept It

<v-clicks>

1. Try WarpDrive in your next project: `npx warp-drive`
2. Explore the guides at **docs.warp-drive.io**
3. Join the community discussions
4. Build something ambitious!

</v-clicks>

---
layout: center
---

# Final Thought

<div class="text-2xl mb-8 italic text-green-400">
"The human adventure is just beginning..."
</div>

<v-click>

And so is your journey with WarpDrive. The data is out there - go boldly and fetch it efficiently.

</v-click>

<v-click>

## Questions? Let's explore the unknown together!

</v-click>

---
layout: center
---

# Additional Resources

<div class="grid grid-cols-2 gap-8">

<v-clicks>

<div>
  <h3>📚 Documentation</h3>
  <p>docs.warp-drive.io</p>
</div>

<div>
  <h3>💬 Community</h3>
  <p>discord.gg/emberjs</p>
</div>

<div>
  <h3>📝 Blog Posts</h3>
  <p>runspired.com for deep dives</p>
</div>

<div>
  <h3>🧪 Live Demo</h3>
  <p>TodoMVC repository on GitHub</p>
</div>

</v-clicks>

</div>

<style>
h1, h2, h3 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>
