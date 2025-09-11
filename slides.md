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
favicon: ./favicon.png
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
I was going to call this talk "WarpDrive for Dummies"...

...but we're not dummies.

Some of us know quite a lot about data libraries.
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

<div class="callout float-right max-w-xl mt-8">
<p>
Today we're going on a mission to <strong>explore strange new patterns</strong>, seek out new architectures, and <strong>boldly go where our data has never gone before</strong>.
</p>
</div class="callout">

</v-click>

<!--
You might know quite a bit about **one data library** in particular...

(clickl) And you might even be expecting me to talk about that library.

(click) **But I'm not.**
Instead, I want you to pretend you've never seen that library before.

(click) We're going to explore a new library, with new patterns. We're going to "boldly go where our data has never gone before."
-->

---

<div class="logo-slide">

<div class="warp-drive-showcase">
  <div class="lcars-frame">
    <div class="corner-indicator top-left"></div>
    <div class="corner-indicator top-right"></div>
    <div class="corner-indicator bottom-left"></div>
    <div class="corner-indicator bottom-right"></div>
    <div class="logo-container">
      <img src="/warp-drive-logo-white.svg" alt="WarpDrive logo" class="warp-logo" />
      <div class="energy-field"></div>
      <div class="scan-line"></div>
    </div>
    <div class="status-indicators">
      <div class="status-bar">
        <span class="status-text">SYSTEM STATUS:</span>
        <span class="status-ready">READY</span>
      </div>
      <div class="status-bar">
        <span class="status-text">WARP CORE:</span>
        <span class="status-online">ONLINE</span>
      </div>
      <div class="status-bar">
        <span class="status-text">DATA LAYER:</span>
        <span class="status-active">STUN</span>
      </div>
    </div>
  </div>
</div>

</div>

<!--
Today we're talking about WarpDrive.

Set your data layer to stun.
-->

---
layout: two-cols
---

# Your Captain for This Mission

<div class="callout-solid mr-4 bg-lcars-magenta">

After Party talking points:

<v-clicks>

Portland, Oregon

Answers to “mom”

Staff Engineer @ AuditBoard

EmberData/WarpDrive & Tooling Teams

Ember veteran since v2

</v-clicks>

</div>

::right::

<div class="callout">
<img src="/captain-profile.jpg" alt="Krystan and her family backpacking at Mt. Rainier, Washington" class="h-100 w-auto" />
</div>

<!--
Before we embark, let me introduce myself - I'm your guide through the WarpDrive universe...

(These really just talking points to make me more approachable at tonight's AfterParty.)

* I live in Portland, Oregon. It rains a lot there.
-  I have two kids, so I understand the importance of reliable, predictable systems that just work
- I'm a staff-engineer at AuditBoard - building enterprise Audit, Risk, and Compliance software
- I'm a member of the WarpDrive and Ember Tooling Teams. I'm passionate about making data management both powerful and type-safe
- I've been writing Ember apps for nearly a decade.
-->

---
layout: center
---

# The Evolution Continues

I've seen the evolution of data patterns in Ember from the early days,<br />and I'm excited to show you where we're **boldly going next**.

<!--
I've seen the evolution of data patterns in Ember from the early days,

and I'm excited to show you where we're **boldly going next**.
-->

---
layout: section
title: 'Episode 1: "What is WarpDrive?"'
---

# Episode 1

## "What is WarpDrive?"

<!--
So...What even is WarpDrive?
-->

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
<div>└── <span class="text-lcars-amber"><carbon-layers /> shared-data-layer</span></div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;├── <span class="text-lcars-magenta"><carbon-rocket /> @warp-drive/core</span></div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;├── <carbon-build-tool /> builders/</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;├── <carbon-api /> handlers/</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;├── <carbon-data-structured /> schemas/</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;├── <carbon-database-messaging /> store/</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;└── <carbon-types /> types/</div>
<div class="h-2"></div>
<div><carbon-folder /> apps/</div>
<div>├── <span class="text-lcars-red-orange"><logos-ember-tomster /> emberjs</span></div>
<div>│&nbsp;&nbsp;&nbsp;└── <span class="text-lcars-magenta"><carbon-rocket /> @warp-drive/ember</span></div>
<div>├── <span class="text-lcars-cyan"><logos-react /> react</span></div>
<div>│&nbsp;&nbsp;&nbsp;└── <span class="text-lcars-magenta"><carbon-rocket /> @warp-drive/react</span></div>
<div>├── <span class="text-lcars-green"><logos-vue /> vue</span></div>
<div>│&nbsp;&nbsp;&nbsp;└── <span class="text-lcars-magenta"><carbon-rocket /> @warp-drive/vue</span></div>
<div>└── <span class="text-lcars-orange"><carbon-db2-database /> api</span></div>

</div>

</div>

<div class="callout-solid bg-lcars-magenta text-2xl">
<strong>This isn't just theory</strong> - we can literally share our data layer across multiple applications.
</div>

</div>

<!--
By "universal", we mean you can build your data layer in a separate package and share it across multiple frontends, regardless of framework.

This is the actual structure of the monorepo I am presenting today.

In this monorepo, we have a `shared-data-layer` package that contains all of our WarpDrive configuration, logic, and utilities.

Under the apps folder, today I will be presenting the emberjs app, but you could just as easily build a React or Vue app that shares this same data layer.

Even our `api` implementation, written in node, uses types imported from the shared data layer.
-->

---
layout: section
title: 'Episode 2: "Engage! - Setting Up Our Mission"'
---

# Episode 2

## "Engage! - Setting Up Our Mission"

<!--
And now, let's build something ambitious.
-->

---

# Our Mission Brief

We'll implement a TodoMVC application step-by-step using:

<v-clicks>

- ***Warp*Drive** <span class="text-lcars-blue">(our starship for data management)</span>
- **\(JSON:API\}** <span class="text-lcars-blue">(the gold standard for API communication)</span>
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

<!--
And thanks to Miguel, Addy, and Preston for creating the Ember TodoMVC implementation that I forked for today's presentation.
-->

---
layout: section
title: 'Episode 3: "Request Patterns - Making It So"'
---

# Episode 3

## "Request Patterns - Making It So"

---

# The WarpDrive Store - "The Bridge"

Everything flows through here:

<MacWindow title="packages/shared-data/src/stores/index.ts" class="max-w-2xl mb-6">
<<< @/packages/shared-data/src/stores/index.ts ts {20|21|28-37|39-44|46-52}{maxHeight: '200px'}
</MacWindow>

<v-clicks at=1>

- **Request Management** - How we handle requests for data
- **Cache Management** - How to cache that data
- **Schema Management** - Schemas for what our data looks like
- **Reactive State Management** - What sort of reactive objects to create for that data

</v-clicks>

---

# The RequestManager - "The Communications Officer"

It manages all external contact:

<MacWindow title="packages/shared-data/src/stores/index.ts" class="max-w-2xl mb-6">
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

# \{JSON:API\} - "The Communicator"

By default, WarpDrive `Fetch` speaks \{JSON:API\} fluently, giving you:

<div class="grid grid-flow-col gap-4">

<div class="callout">

```json
{
  "data": [
    {
      "type": "todo",
      "id": "1",
      "attributes": {
        "title": "Learn WarpDrive",
        "completed": false
      }
    }
    // ...
  ]
}
```

</div>

<div>

<v-clicks>

- **Standardized format** for resources, relationships, and errors
- **Consistent patterns** across all your APIs
- **Built-in pagination, filtering, sorting, and sparse fields** conventions

</v-clicks>

<v-click>

<div class="mt-4 text-sm text-lcars-blue">
(But, you can configure WarpDrive to use other formats if you prefer!)
</div>

</v-click>

</div>

</div>

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

<MacWindow title="warp-drive/warp-drive-packages/core/src/types/request.ts" class="max-w-2xl">

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

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-center">

<MacWindow title="packages/shared-data/src/builders/todo/query.ts" class="w-140">
<<< @/packages/shared-data/src/builders/todo/simple-query.ts ts {8-9|11|12|14-15}{maxHeight: '300px'}
</MacWindow>

<div>

- Our `getAllTodos` builder

<v-clicks at=1>

- Specifies the request method
- Generates the URL
- Sets cache options

</v-clicks>

</div>

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

# Request Builders - Query Params

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-center">

<MacWindow title="packages/shared-data/src/builders/todo/query.ts" class="w-140">
<<< @/packages/shared-data/src/builders/todo/simple-query.ts ts {19-20|21-24,28}{maxHeight: '300px'}
</MacWindow>

<div>

- Our `getCompletedTodos` builder

<v-clicks at=1>

- `buildQueryParams` util

</v-clicks>

</div>

</div>

<!--
WarpDrive also provides utilities to help with common request patterns.

For example, here is the builder for the request made by our "Completed" filter.

It looks the same as our `getAllTodos` builder, except it adds a `filter[completed]=true` query parameter to the URL.
-->

---
layout: section
title: 'Episode 4: "Schemas - The DNA of Your Data"'
---

# Episode 4

## "Schemas - The Universal Translator"

---

# Schema-Driven Development

Instead of models with complex inheritance, WarpDrive uses simple, declarative schemas:

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-center">

<MacWindow title="packages/shared-data/src/schemas/todo.ts" class="w-120">
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

Types for various states:

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-center">

<MacWindow title="packages/shared-data/src/types/todo.ts" class="max-w-2xl">
<<< @/packages/shared-data/src/types/todo.ts ts {11-27|11-15|17-21|23-27}{maxHeight: '350px'}
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

<!--
Because resources are just thin wrappers over POJOs, you can define types for their various states...
-->

---
layout: section
title: 'Episode 5: "Reactive UI - Ember Integration"'
---

# Episode 5

## "Reactive UI - The Viewscreen"

<h3 class="mt-2">(Ember Integration)</h3>

<!--
Note that so far I haven't shown you any Ember code.
Everything up until now has been framework-agnostic.
Truly universal.
-->

---

# <logos-ember /> + `@warp-drive/ember`

- **A Thin Wrapper** - Built on top of `@warp-drive/core` reactive utilities.
- **Provides Ember components** - For request UX with elegant control flow.
- **Reactive** - Leverages Ember's reactivity system for fine-grained updates that JustWork™.

<!--
This @warp-drive/ember package provides components built over the core WarpDrive reactive utilities for working with promises and requests.

These components enable you to build robust performant apps with elegant control flow.
-->

---

# Components with Reactive Magic

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-center">

<MacWindow title="apps/emberjs/app/components/todo-app/todo-provider.gts" class="max-w-2xl">
<<< @/apps/emberjs/app/components/todo-app/todo-provider-request-version.gts ts {14|15-17|23-24|29-36|26-27|18-20}{maxHeight: '360px'}
</MacWindow>

<div class="max-w-sm">

- Our `TodoProvider` component

<v-clicks at=0>

- `<Request />` component
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
layout: center
---

# Live Demo: Basic Request Loading States

<!--
- Initial Todo Count: A Few
- API Reliability: Good
- API Latency: Slow
- Mode: Hobbyist

1. Demo loading state with network throttling
2. Demo caching on the queries
3. Demo toggle all
4. Demo "clear completed"
5. Demo adding a todo
-->

---
layout: center
---

# Live Demo: Basic Request Error States

<!--
- Initial Todo Count: A Few
- (UPDATE) API Reliability: Terrible
- API Latency: Slow
- Mode: Hobbyist

1. Demo error state (trying to visit "active")

- (UPDATE) API Reliability: Good
-->

---

# Universal Framework Support

The core logic stays the same - only the framework integration changes!

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-center">

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

---

# Pessimistic vs. Optimistic

When changing data, you have two choices:

<div class="grid grid-cols-2 gap-4 grid-items-center">
<v-clicks>
  <div class="callout-solid">
    <h3>Pessimistic</h3>
    <p>Wait for server confirmation before updating UI</p>
  </div>
  <div class="callout-solid">
    <h3>Optimistic</h3>
    <p>Update UI immediately, then confirm with server</p>
  </div>
  <div class="callout-solid">
    <h3>Both have trade-offs</h3>
    <p>UX vs. consistency</p>
  </div>
  <div class="callout-solid">
    <h3>WarpDrive supports both</h3>
    <p>You choose per request</p>
  </div>
</v-clicks>
</div>

<!--
And our todo app uses both
-->

---

# Pessimistic Mutation

<MacWindow title="apps/emberjs/app/components/todo-app/todo-item.gts" class="mb-4" >
<<< @/apps/emberjs/app/components/todo-app/todo-item.gts gts {308-314|308-314|310}{maxHeight: '200px'}
</MacWindow>

<v-clicks at=1>

- Our `patchTodoTitle` action
- Uses our `patchTodo` builder
- Pass the `Todo` and `attributes` to update
- When the request resolves, that `Todo` updates all over your app
- This seems too easy...

</v-clicks>

---

# Pessimistic Mutation

<div class="grid grid-flow-col gap-4 grid-items-center">

<MacWindow title="packages/shared-data/src/builders/todo/update.ts" >
<<< @/packages/shared-data/src/builders/todo/update.ts gts {11-20|11-20|30|31|32-38|40-41}{maxHeight: '300px'}
</MacWindow>

<v-clicks at=1>

- Our `patchTodo` builder
- Specifies the request method
- Generates the URL
- Serializes the request body
- Sets cache options

</v-clicks>

</div>

<!--
The real magic is in our `patchTodo` builder:
* Just like our `getAllTodos` builder, it specifies the request method
* it generates the URL -- now using a resource key to determine the ID to add to the URL
* It serializes the request body in JSON:API format
* And it sets cache options
Adding the 'updateRecord' OpCode and specifying the `ResourceKey` for
 this todo in the `records` array tells the `DefaultCachePolicy` in our
 store that when this request succeeds it should automatically patch
 the returned attributes into any matching resources in any cached
 documents for requests with the 'query' OpCode that include this
 record in their results when this request succeeds.
-->

---
layout: center
---

# Live Demo: Pessimistic Mutation

<!--
- Initial Todo Count: A Few
- API Reliability: Good
- API Latency: Slow
- Mode: Hobbyist

1. Demo title update
2. Demo switching tabs to ensure it updated
-->

---

# Controlled Optimistic Mutation with Checkout

<MacWindow title="apps/emberjs/app/components/todo-app/todo-item.gts" class="mb-4 max-w-2xl">
<<< @/apps/emberjs/app/components/todo-app/todo-item.gts gts {186-192|186-192,199-203}{maxHeight: '350px'}
</MacWindow>

<v-clicks at=2>

- Uses the same `patchTodo` builder
- This time, we pass an `EditableTodo` plus the `attributes` to update

</v-clicks>

<!--
CompletedForm uses optimistic mutation to ensure that the completion state is shown consistently throughout the entire TodoItem component.
-->

---

# Controlled Optimistic Mutation with Checkout

<MacWindow title="apps/emberjs/app/components/todo-app/todo-list.gts" class="mb-4 max-w-2xl">
<<< @/apps/emberjs/app/components/todo-app/todo-list.gts gts {21|21|22|21-37}{maxHeight: '350px'}
</MacWindow>

<v-clicks at=1>

- By default, resources are immutable
- To get a mutable version, we use `await checkout(todo)`

</v-clicks>

<!--
WarpDrive handles mutations through a "checkout" system:
- Be default, resources are immutable
- To get a mutable version, we use `await checkout(todo)`
- This returns an `EditableTodo` that we can modify freely
- When we're ready, we pass that `EditableTodo` to our `patchTodo` builder
- Note that we're using the `@warp-drive/ember` `Await` component here. Similar to the `Request` component, it handles promise states declaratively.
-->

---

# Patching State

<MacWindow title="apps/emberjs/app/components/todo-app/todo-item.gts" class="mb-4 max-w-2xl">
<<< @/apps/emberjs/app/components/todo-app/todo-item.gts gts {186-192|186-192,199-203|194-198}{maxHeight: '300px'}
</MacWindow>

<v-clicks at=1>

- Our `patchTodoToggle` method
- Patch the cached filter query documents manually

</v-clicks>

<!--
There's one other interesting bit to our CompletedForm component.

Because we've already made requests for completed and active todos, our store has cached documents for both.

But WarpDrive can't predict that just because a Todo's `completed` attribute changed, it should move between those two lists.

So, we have to patch the cached documents manually. (click)
-->

---

# Patching State

<MacWindow title="packages/shared-data/src/builders/todo/update.ts" class="mb-4 max-w-2xl">
<<< @/packages/shared-data/src/builders/todo/update.ts gts {64-68|75-81|85-90|94}{maxHeight: '300px'}
</MacWindow>

<v-clicks at=1>

- `cache.patch()` surgically updates cached documents
- Add to completed list; remove from active list
- Invalidate all queries with the `'todo-count'` tag -- forces refetch

</v-clicks>

<!--
I put this logic in utility functions because I use it in multiple places.

(click) It uses the store's `cache.patch()` method to surgically update the cached documents.
In the case of `patchCacheTodoCompleted` we add the todo to the completed list
(click) and remove it from the active list.
(click) and we invalidate all queries with the 'todo-count' tag to force a refetch as these requests are inexpensive.

NOTE: We don't need to patch the caches because we're using optimistic updates. This is because we're updating the `completed` attribute used in the filter, which WarpDrive can't predict.
-->

---
layout: center
---

# Live Demo: Optimistic Mutation and Cache Patching

<!--
- Initial Todo Count: A Few
- API Reliability: Good
- API Latency: Slow
- Mode: Hobbyist

1. Demo completed toggle
2. Demo switching tabs to ensure it updated
-->

---

# Immutability Without the Hassle

Whether you choose pessimistic or optimistic updates:

<v-clicks>

- Original data stays immutable
- Changes are isolated until saved

</v-clicks>

<v-click>

<div class="callout float-right">
"Captain, the data has been successfully modified...<br />...without temporal paradoxes!"
</div>

</v-click>

---
layout: section
title: 'Episode 7: "Performance - Warp 9.8"'
---

# Episode 7

## "Performance - Warp 9.8"

---

# Built for Performance

WarpDrive optimizes automatically:

<v-clicks>

- **Request deduplication** - Same request? Use cached result
- **Fine-grained reactivity** - Only update what actually changed

</v-clicks>

<!--
WarpDrive provides built-in performance optimizations, like caching and request deduplication.

But our TodoMVC MVP has gotten so popular that we're starting to hit performance limits.

We've even seen some "scale pioneer" users with hundreds of thousands of todos in their list.
-->

---
layout: center
---

# Live Demo: Scale Pioneers

<!--
- (UPDATE) Initial Todo Count: A Lot
- API Reliability: Good
- API Latency: Slow
- Mode: Hobbyist

1. Demo 100k todos without pagination

- (UPDATE) Mode: Enterprise
-->

---

# <span class="text-lcars-blue">Coming Soon:</span> Paginate

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-center">

<MacWindow title=".../app/components/todo-app/todo-provider.gts" class="w-130">
<<< @/apps/emberjs/app/components/todo-app/todo-provider.gts ts {28|28|30-35|40-43|55-58|45-53|60-63}{maxHeight: '360px'}
</MacWindow>

<div>

<v-clicks at=1>

- Our `TodoProvider` component
- `<Paginate />` component
- Loading states - for initial, previous, and next
- Error state
- Success state - display all the data, or just one page
- And pagination controls
- ...and more!

</v-clicks>

</div>

</div>

<!--
Here' we're looking at the real TodoProvider component used by our Enterprise Edition Todo App.

(click) It uses WarpDrive's Paginate component to declaratively handle request state.
(click) On load, it displays a loading spinner.
(click) On error, it displays an error message with a retry button.
(click) And on success, it passes the data to the Todos component.
(click) And! When cached responses for this request are invalidated, the component automatically re-renders with fresh data.

(click) There's even more, and I encourage you to check out the `@warp-drive/ember` readme to learn about it.
-->

---

# <span class="text-lcars-blue">Any Day Now:</span> EachLink

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-center">

<MacWindow title=".../app/components/todo-app/pagination-controls.gts" class="max-w-2xl">
<<< @/apps/emberjs/app/components/todo-app/pagination-controls.gts ts {114-124|114-124|116-118|120-122}{maxHeight: '360px'}
</MacWindow>

<div class="max-w-sm">

<v-clicks at=0>

- `<EachLink />` component
- Yields a `<:link>` block for each known page link
- Yields a `<:placeholder>` block for unknown links

</v-clicks>

</div>

</div>

---

# Paginated Query Builder

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-center">

<MacWindow title="packages/shared-data/src/builders/todo/query.ts" class="max-w-2xl">
<<< @/packages/shared-data/src/builders/todo/query.ts ts {9-24|9-24|11-15,19}{maxHeight: '380px'}
</MacWindow>

<v-clicks at=1>

- Our `getAllTodos` builder
- Pagination query params

</v-clicks>

</div>

<!--
Our actual query builder configures a request for the *initial* page of todos via query params
-->

---

# Paginate Powered by \{JSON:API\}

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-center">

<div class="callout">

```json {all|all|5-10|11-14}
{
  "data": [
    /* the first page of Todos */
  ],
  "links": {
    "self": "/api/todo?page[limit]=5&page[offset]=0",
    "first": "/api/todo?page[limit]=5&page[offset]=0",
    "next": "/api/todo?page[limit]=5&page[offset]=5",
    "last": "/api/todo?page[limit]=5&page[offset]=99995"
  },
  "meta": {
    "currentPage": 1,
    "totalPages": 20000
  }
}
```

</div>

<v-clicks at=1>

- Our paginated `/api/todo` response
- Spec-compliant `links` object
- Non-spec `meta` required only for `EachLink` support

</v-clicks>

</div>

---

# Paginate + EachLink + Page Hints

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-center">

<MacWindow title=".../app/components/todo-app/todo-provider.gts" class="max-w-2xl">
<<< @/apps/emberjs/app/components/todo-app/todo-provider.gts ts {30-35|30-35|36-37|109-121}{maxHeight: '360px'}
</MacWindow>

<div class="max-w-sm">

<v-clicks at=0>

- `<Paginate />` component
- `@pageHints` argument
- Extracts non-spec pagination meta for use in `EachLink`

</v-clicks>

</div>

</div>

<!--
In our case, the API returns meta that is the exact shape we need, but you can extract page-hints however you want.
-->

---

# Houston, we have a problem

<div class="grid grid-cols-2 gap-4 grid-items-center grid-items-center">

<v-click>
<div class="callout-solid h-100 bg-lcars-magenta">
<div class="callout-solid mt-8 bg-lcars-purple">
Load only part of the Todo list...
</div>
</div>
</v-click>

<v-click>
<div class="callout-solid h-100 bg-lcars-magenta">
<div class="callout-solid mt-8 bg-lcars-purple">

<carbon-arrow-right /> Risk updating only part of the list

</div>
</div>
</v-click>

</div>

<!--
Now that we're paginating our data, we have a problem. (click)

The TodoMVC spec requires a Toggle button that toggles completion of the full list
and a  "Clear Completed" button that deletes all completed todos.

If we naively implemented these actions by iterating over the full list of
todos and sending individual requests, we'd have to load the entire list into
the client, (click) or risk updating only part of our full Todo list.
-->

---

# Bulk Actions - Bulk Op Builders

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-center">

<MacWindow title="packages/shared-data/src/builders/todo/bulk.ts" class="w-150">
<<< @/packages/shared-data/src/builders/todo/bulk.ts ts {154-167|154-167|164|158-161,165|163-166|163}{maxHeight: '360px'}
</MacWindow>

<div class="max-w-sm">

<v-clicks at=0>

- Our `bulkDeleteCompletedTodos` builder
- Specifies the request method
- Generates the URL
- No body, no cache options
- Expects empty response

</v-clicks>

</div>

</div>

<!--
First, let's look at our `bulkDeleteCompletedTodos` builder.
This builder implementation should look familiar by now.

(click) It specifies the request method
(click) It generates the URL - this time using a custom bulk "ops.bulk.deleteAll" endpoint
(click) It has no body, and no cache options. Instead, it passes a filter via the query params to tell the server to delete all completed todos.
(click) It expects an empty response.
If the API were to try to serialize all the deleted todos, it could result in a massive payload.
-->

---

# Bulk Actions - State Invalidation

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-center">

<MacWindow title="packages/shared-data/src/builders/todo/query.ts" class="w-130">
<<< @/packages/shared-data/src/builders/todo/query.ts ts {71-74|71-74}{maxHeight: '200px'}
</MacWindow>

<div class="max-w-sm">

<v-clicks>

- Our `invalidateAllTodoQueries` util
- `invalidateRequestsForType` method

</v-clicks>

</div>

</div>

<!--
Since our bulk delete endpoint returns an empty response, there is no way for
WarpDrive to know which queries to invalidate. And as we saw earlier, we'd
need to manually handle updating the cached filter queries anyway.

Since the bulk endpoint results in so much change and predicting how that
would affect cached pages would be very difficult, we simply invalidate all
queries for the `todo` type so that they will refetch the next time they are
rendered.
-->

---

# Bulk Actions - Putting It All Together

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-center">

<MacWindow title=".../app/components/todo-app/clear-completed-todos.gts" class="w-150">
<<< @/apps/emberjs/app/components/todo-app/clear-completed-todos.gts ts {48,51-56,59|48,51-56,59|52|53}{maxHeight: '360px'}
</MacWindow>

<div class="max-w-sm">

<v-clicks at=1>

- Our `clearCompleted` action
- Our `bulkDeleteCompletedTodos` builder
- Our `invalidateAllTodoQueries` utility

</v-clicks>

</div>

</div>

---
layout: section
title: 'Episode 8: "The Future - Final Frontier?"'
---

# Episode 8

## "The Future - Final Frontier?"

<!--
Have we reached the Final Frontier?
Probably not.
-->

---

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-center">

<div class="callout-solid bg-lcars-purple h-84 fit-content">

<h3><a href="https://canary.warp-drive.io/" class="text-lcars-black">canary.warp-drive.io</a></h3>

</div>

<div class="callout">
<img src="/the-manual.png" alt="Canary Docs QR Code" class="h-70 w-auto" />
</div>

</div>

<!--
WarpDrive is under active development, with new features and improvements coming regularly.
Check on the latest at the Canary docs site.
-->

---
layout: section
---

# Conclusion

## "Live Long and Prosper"

<div class="text-6xl mt-8">🖖</div>

---

# What We've Discovered

WarpDrive is the lightweight data framework for ambitious web applications.

<div class="grid grid-cols-2 gap-4">

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

</div>

---

# Your Mission, Should You Choose to Accept It

1. Try WarpDrive in your next project.
2. Explore the guides at [docs.warp-drive.io](https://docs.warp-drive.io) and [canary.warp-drive.io](https://canary.warp-drive.io).
3. Explore this WarpDrive TodoMVC monorepo at [github.com/gitKrystan/2025-emberfest](https://github.com/gitKrystan/2025-emberfest).
4. Join the community discussions on Discord ([https://discord.gg/eUPwQzRJ](https://discord.gg/eUPwQzRJ)).
5. Build something ambitious!

<h2 class="text-lcars-purple">Questions? Let's explore the unknown together!</h2>

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-end mt-8">

<div class="text-lcars-blue font-size-xs mt-30 max-w-md">
Special Thanks:<br />
AuditBoard, Chris Thoburn, Julia Donaldson, Natasha Wolfe<br />
(and my husband for watching the kids)

</div>

<div class="callout max-w-md">

The <strong>human adventure</strong> is just beginning...

And so is <strong>your journey with WarpDrive</strong>

The data is out there - <strong>go boldly and fetch it efficiently</strong>

</div>

</div>
