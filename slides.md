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

You might know quite a bit about **one data library** in particular...

<v-click>

And you might even be expecting me to talk about that library.

</v-click>

<v-click>

**But I'm not.**

</v-click>

<v-click>

<div class="callout float-right max-w-2xl">
<p>
Today we're going on a mission to <strong>explore strange new patterns</strong>, seek out new architectures, and <strong>boldly go where our data has never gone before</strong>.
</p>
</div class="callout">

</v-click>

<!--
# A Fresh Perspective

You might know quite a bit about **one data library** in particular...

And you might even be expecting me to talk about that library.

**But I'm not.**

Instead, I want you to pretend you've never seen that library before.

Today we're going on a mission to **explore strange new patterns**, seek out new architectures, and **boldly go where our data has never gone before**.
-->

---
layout: two-cols
---

# Your Captain for This Mission

<div class="callout-solid mr-4 bg-lcars-magenta">

<p>Portland, Oregon</p>
<p>Answers to “mom”</p>
<p>Staff Engineer @ AuditBoard</p>
<p>EmberData/WarpDrive & Tooling Teams</p>
<p>Ember veteran since v2</p>

</div>

::right::

<div class="callout">
<img src="/captain-profile.jpg" alt="Krystan and her family backpacking at Mt. Rainier, Washington" class="h-100 w-auto" />
</div>

<!--
Before we embark, let me introduce myself - I'm your guide through the WarpDrive universe...

 🌧️ **Portland, Oregon** - Where I live among the coffee shops and rain
- 👩‍👧‍👦 **Mother of two** - I understand the importance of reliable, predictable systems that just work
- 🛡️ **Staff Engineer at AuditBoard** - Building enterprise Audit, Risk, and Compliance software
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
title: 'Episode 1: "What is WarpDrive?"'
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

- **Resource-first architecture** <span class="text-lcars-blue">instead of heavy model inheritance patterns</span>
- **Schema-driven development** <span class="text-lcars-blue">for consistent, sharable data shapes</span>
- **Universal compatibility** <span class="text-lcars-blue">vs. framework-specific implementations</span>
- **Fine-grained reactivity** <span class="text-lcars-blue">that just works</span>

</v-clicks>

---

# The Universal Promise

"Separate the saucer section!"

<div class="grid grid-cols-2 gap-4">

<div class="callout ml-auto">

<div class="code font-size-3">

<div><carbon-folder /> packages/</div>
<div>└── <span class="text-lcars-orange"><carbon-layers /> shared-data-layer</span></div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;├── <span class="text-lcars-magenta"><carbon-rocket /> @warp-drive/core</span></div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;├── <carbon-build-tool /> builders/</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;├── <carbon-api /> handlers/</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;├── <carbon-data-structured /> schemas/</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;├── <carbon-database-messaging /> store/</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;└── <carbon-types /> types/</div>
<div class="h-2"></div>
<div><carbon-folder /> apps/</div>
<div>├── <span class="text-lcars-orange"><logos-ember-tomster /> emberjs</span></div>
<div>│&nbsp;&nbsp;&nbsp;└── <span class="text-lcars-magenta"><carbon-rocket /> @warp-drive/ember</span></div>
<div>├── <span class="text-lcars-cyan"><logos-react /> react</span></div>
<div>│&nbsp;&nbsp;&nbsp;└── <span class="text-lcars-magenta"><carbon-rocket /> @warp-drive/react</span></div>
<div>├── <span class="text-lcars-green"><logos-vue /> vue</span></div>
<div>│&nbsp;&nbsp;&nbsp;└── <span class="text-lcars-magenta"><carbon-rocket /> @warp-drive/vue</span></div>
<div>└── <carbon-data-base /> api</div>

</div>

</div>

<v-click>

<div class="callout-solid bg-lcars-magenta text-2xl">
<strong>This isn't just theory</strong> - we can literally share our data layer across multiple applications.
</div>

</v-click>

</div>

---
layout: section
title: 'Episode 2: "Engage! - Setting Up Our Mission"'
---

# Episode 2

## "Engage! - Setting Up Our Mission"

---

# The Mission Brief

We'll implement a TodoMVC application step-by-step using:

<v-clicks>

- **WarpDrive** <span class="text-lcars-blue">(our starship for data management)</span>
- **JSON:API** <span class="text-lcars-blue">(the gold standard for API communication)</span>
- **TypeScript** <span class="text-lcars-blue">(because we like our data typed and our code safe)</span>
- **Modern Ember Polaris** <span class="text-lcars-blue">(the latest and greatest Ember patterns)</span>

</v-clicks>

<v-click>

<div class="callout mt-8 float-right">
By the end, you'll see how WarpDrive makes data management feel... <em>logical</em>.
</div>

</v-click>

---

# TodoMVC: Our Prime Directive

TodoMVC is a spec for a simple Todo app, implemented<br />in multiple frameworks to compare approaches.

<v-click>

It's built around a simple Todo resource:

<div class="callout max-w-xs mt-10">
```ts
interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```
</div>

</v-click>

---

# TodoMVC: Our Prime Directive

Every TodoMVC implementation shares the same [core features](https://github.com/tastejs/todomvc/blob/master/app-spec.md):

<div class="callout">
<img src="./picard-todos.png" alt="TodoMVC UI with Captain Picard's Todo List" class="h-80 w-auto" />
</div>

---
layout: section
title: 'Episode 3: "Request Patterns - Making It So"'
---

# Episode 3

## "Request Patterns - Making It So"

---

# The WarpDrive Store

**Like the bridge of our starship** - everything flows through here:

<MacWindow title="packages/shared-data/src/stores/index.ts" class="max-w-2xl">
<<< @/packages/shared-data/src/stores/index.ts ts {20|21|28-37|39-44|46-52}{maxHeight: '200px'}
</MacWindow>

<v-clicks at=1>

- **Request Management** - How we handle requests for data
- **Cache Management** - How to cache that data
- **Schema Management** - Schemas for what our data looks like
- **Reactive State Management** - What sort of reactive objects to create for that data

</v-clicks>

---

# The RequestManager

Think of it as your ship's communications officer - it manages all external contact!

<MacWindow title="packages/shared-data/src/stores/index.ts" class="max-w-2xl">
<<< @/packages/shared-data/src/stores/index.ts ts {21|26|22-27|28|21-28}{maxHeight: '200px'}
</MacWindow>

<v-clicks at=1>

- **Fetch Handler** - Makes actual network requests (Fetch API + error handling)
- **Request Pipeline** - Allows custom handlers for data transformation
- **Cache Integration** - Automatically caches responses
- **Does What It Says** - On the tin

</v-clicks>

<v-click>

</v-click>

<!--
One of the most important parts of the store is the "Request Manager"

Think of RequestManager as your ship's communications officer - it manages all external contact!

RequestManager is fully customize-able. You don't even need to use Fetch, though we will. (click)

You can customize it with handlers to transform requests and responses as needed. (click)
These handlers can choose to call `next()`, similar to middleware patterns in API frameworks.

You can also register a special "CacheHandler" to integrate with WarpDrive's caching system.
In our case, we're using the default CacheHandler.

So the Request Manager does exactly what it says on the tin. (click) It manages your requests.
-->

---

# \{JSON:API\}: The Universal Translator

By default, WarpDrive `Fetch` speaks \{JSON:API\} fluently, giving you:

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

<div class="mt-4 text-sm text-lcars-blue max-w-xs">
(But, you can configure WarpDrive to use other formats if you prefer!)
</div>

</v-click>

---

# Making a Request

<MacWindow title="apps/my-app/routes/index.js" class="max-w-2xl">

```js {10-14}{maxHeight: '200px'}
import Route from '@my-framework/routing/route';
import { service } from '@my-framework/service';

import type { Store } from '@workspace/shared-data';

export default class ActiveTodos extends Route {
  @service declare store: Store;

  model() {
    return this.store.request({
      method: 'GET',
      url: '/api/todo',
      // Additional options like headers, query params, etc.
    })
  }
}
```

</MacWindow>

<!--
The simplest way to make a request is to pass a request object to the store's request method.
This method delegates the request to the store's RequestManager.

For example, this request will get all todos from our API.
-->

---

# Request Options

<MacWindow title="apps/emberjs/routes/index.js" class="max-w-2xl">

```ts twoslash {2-3|all}{maxHeight: '380px'}
type Store = any;
// ---cut---
interface RequestInfo extends RequestInit {
  //                          ^^^^^^^^^^^
  // Standard Fetch API options
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT'; // etc
  url: string;

  // Caching options
  op?: string;
  cacheOptions?: {
    types?: string[];
    key?: string;
    reload?: boolean;
    backgroundReload?: boolean;
  };

  // Custom handler options
  options?: Record<string, unknown>;

  // ...
}
```

</MacWindow>

<!--
Requests can take any of the standard Fetch API RequestInit options, plus some extras
to configure caching and handler behavior.

As you can imagine, these options can get quite complex, which is why we support request builders...
-->

---

# Request Builders

<div class="grid grid-flow-col gap-4 grid-items-center">

<MacWindow title="packages/shared-data/src/builders/todo/query.ts" class="max-w-2xl">
<<< @/packages/shared-data/src/builders/todo/query.ts ts {9,10,12-13,18|13|15-16}{maxHeight: '300px'}
</MacWindow>

<v-clicks at=1>

- Generates the URL
- Sets cache options

</v-clicks>

</div>

<!--
A request builder is just a simple function that returns a RequestInfo object.

Here's a reusable builder for our 'getAllTodos' request, using warp drive
request utilities to ensure consistency across our app.

(click) It generates the URL, using the resource path plus a configurable namespace
(click) And it sets cache options
In this case, Adding the 'query' OpCode and specifying the 'todo' type in
`cacheOptions` tells the `DefaultCachePolicy` in our store to
automatically invalidate this request when any request with the
'createRecord' OpCode + 'todo' in `cacheOptions.type` succeeds.
-->

---
layout: section
title: 'Episode 4: "Schemas - The DNA of Your Data"'
---

# Episode 4

## "Schemas - The DNA of Your Data"

---

# Schema-Driven Development

Instead of models with complex inheritance, WarpDrive uses simple, declarative schemas:

<div class="grid grid-flow-col gap-4 grid-items-center">

<MacWindow title="packages/shared-data/src/schemas/todo.ts" class="max-w-2xl">
<<< @/packages/shared-data/src/schemas/todo.ts ts {all|3|4|5-13}{maxHeight: '300px'}
</MacWindow>

<v-clicks at=0>

- `withDefaults` sets up defaults, like the `id` field
- `type` defines the resource type
- `fields` defines the shape of the resource

</v-clicks>

</div>

<!--
Our Todo Schema is very simple, but WarpDrive provides lots of powerful schema features.

More on that this afternoon in Mehul's talk about "ReactiveResources & Schema‑Driven Data Handling"
-->

---

# TypeScript Integration

Because resources are just POJOs, you can define types for their various states:

<div class="grid grid-flow-col gap-4 grid-items-center">

<MacWindow title="packages/shared-data/src/types/todo.ts" class="max-w-2xl">
<<< @/packages/shared-data/src/types/todo.ts ts {11-27|11-15|17-21|23-26}{maxHeight: '350px'}
</MacWindow>

<div class="max-w-sm">

<v-clicks at=0>

- An attribute type for pessimistic creation
- A readonly Todo type
- An editable Todo type

</v-clicks>

<v-click>

<div class="callout mt-4">
  "Data, are you getting readings on this?"<br />Yes, and they're <strong>perfectly structured!</strong>
</div>

</v-click>

</div>

</div>

---
layout: section
title: 'Episode 5: "Reactive UI - Ember Integration"'
---

# Episode 5

## "Reactive UI - Ember Integration"

<!--
Note that so far I haven't shown you any Ember code.
Everything up until now has been framework-agnostic.
Truly universal.
-->

---

# <logos-ember /> + `@warp-drive/ember`

- **A Thin Wrapper** - Built on top of `@warp-drive/core` reactive utilities
- **Provides Ember components** - For request UX with elegant control flow.
- **Reactive** - Leverages Ember's reactivity system

<!--
This @warp-drive/ember package provides components built over the core WarpDrive reactive utilities for working with promises and requests.

These components enable you to build robust performant apps with elegant control flow.
-->

---

# Components with Reactive Magic

<div class="grid grid-flow-col gap-4 grid-items-center">

<MacWindow title="apps/emberjs/app/components/todo-app/todo-provider.gts" class="max-w-2xl">
<<< @/apps/emberjs/app/components/todo-app/todo-provider-request-version.gts ts {14|15-17|23-24|29-36|26-27|18-20}{maxHeight: '360px'}
</MacWindow>

<div class="max-w-sm">

<v-clicks at=0>

- `<Request>` component
- Loading state
- Error state
- Success state
- Autorefresh
- ...and more!

</v-clicks>

</div>

</div>

<!--
Here's where WarpDrive really shines: reactive control flow

Here' we're looking at a simple TodoProvider component that fetches all todos.

(click) It uses WarpDrive's Request component to declaratively handle request state.
(click) On load, it displays a loading spinner.
(click) On error, it displays an error message with a retry button.
(click) And on success, it passes the data to the Todos component.
(click) And! When cached responses for this request are invalidated, the component automatically re-renders with fresh data.

(click) There's even more, and I encourage you to check out the `@warp-drive/ember` readme to learn about it.
-->

---

# Universal Framework Support

The core logic stays the same - only the framework integration changes!

<div class="grid grid-flow-col gap-4 grid-items-center">

<MacWindow title="apps/react/app/components/todo-app/todo-provider.tsx" class="w-xl">

```tsx
import { Request } from '@warp-drive/react';

import { getAllTodos } from '@workspace/shared-data/builders';
import type { Todo } from '@workspace/shared-data/types';

export function TodoProvider() {
  return (
    <Request
      query={getAllTodos()}
      states={{
        loading: ({ state }) => <div>React Loading Spinner!</div>,
        error: ({ state }) => (
          <div>
            <h2 class="error-message">Something went wrong.</h2>
            <p class="error-cta">Please contact TodoMVC support.</p>
            <p>
              <button onClick={state.retry}>Or DDOS us!</button>
            </p>
          </div>
        ),
        content: ({ result }) => <div>React Todo List</div>,
      }}
    />
  );
}
```

</MacWindow>

<div class="max-w-sm text-xs">

- <logos-ember-tomster /> `@warp-drive/ember` <carbon-thumbs-up />
- <logos-react /> `@warp-drive/react` <carbon-thumbs-up />
- <carbon-connection-signal class="text-lcars-magenta" /> `@warp-drive/tc39-proposal-signals` <carbon-thumbs-up />
- <logos-vue /> `@warp-drive/vue` <span class="text-lcars-magenta">Soon!</span>
- <logos-svelte-icon /> `@warp-drive/svelte` <span class="text-lcars-magenta">Soon!</span>

</div>

</div>

---
layout: section
title: 'Episode 6: "Data Mutations - Quantum Mechanics"'
---

# Episode 6

## "Data Mutations - Quantum Mechanics"

<div class="text-6xl mb-8">🔄</div>

_7 minutes_

---

# Controlled Mutation with Checkout

WarpDrive handles mutations through a "checkout" system:

```ts {8-17} {lines:true}
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
title: 'Episode 7: "Universal Deployment"'
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

```ts {1-4|6-8|10-12} {lines:true}
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
title: 'Episode 8: "Advanced Patterns - Warp 9.8"'
---

# Episode 8

## "Advanced Patterns - Warp 9.8"

<div class="text-6xl mb-8">🚀</div>

_8 minutes_

---

# Real-time with Surgical Updates

WebSocket message updates:

```ts {1-10} {lines:true}
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

```ts {2-12|14-15} {lines:true}
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
title: 'Episode 9: "Performance - Ludicrous Speed"'
---

# Episode 9

## "Performance - Ludicrous Speed"

<div class="text-6xl mb-8">⚡</div>

<div class="text-sm text-lcars-blue">
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
title: 'Episode 10: "The Future - Final Frontier"'
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
