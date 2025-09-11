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
selectable: true
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

In fact, some of us know **a lot** about data libraries.
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

* And you might even be expecting me to talk about *that* library.

* **But I'm not.**
Instead, I want you to pretend you've never seen that library before.

* We're going to explore a new library, with new patterns. We're going to "boldly go where our data has never gone before."
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
Before we embark, let me introduce myself - I'll be your guide through the WarpDrive universe...

* I live in Portland, Oregon. It rains a lot there.
-  I have two kids, so I understand the importance of reliable, predictable systems that just work
- I'm a staff-engineer at AuditBoard - building enterprise software for Audit, Risk, and Compliance
- I'm a member of the WarpDrive and Ember Tooling Teams. I'm passionate about making data management both powerful and type-safe
- And I've been writing Ember apps for nearly a decade.
-->

---
layout: center
---

# The Evolution Continues

Where are we **boldly going next**?

<!--
I've seen the evolution of data patterns in Ember from the early days,

and I'm excited to show you where we're **boldly going next**.
-->

---
layout: section
title: 'Episode 1: "What is WarpDrive?"'
---

# Episode 1

## "Computer, define 'WarpDrive'"

<!--
--drink water--
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
  <h3>Typed</h3>
  <p>Fully typed, ready to rock</p>
</div>

<div class="callout-solid">
  <h3>Performant</h3>
  <p>Committed to best-in-class performance</p>
</div>

<div class="callout-solid">
  <h3>Scalable</h3>
  <p>From weekend hobby to enterprise</p>
</div>

</v-clicks>

</div>

<!--
WarpDrive is the lightweight data framework for ambitious web applications.

* It's Universal and works with any framework
* It's TypeScript-first
* It's performant, with built-in caching and fine-grained reactivity
* And It's scalable, no matter how ambitious your project.
-->

---

# "Boldly Go Where No Data Has Gone Before"

Unlike other data libraries, _Warp_**Drive** is built around:

<v-clicks>

- **Resource-first architecture** <span class="text-lcars-blue">instead of heavy model inheritance patterns</span>
- **Schema-driven development** <span class="text-lcars-blue">for consistent, sharable data shapes</span>
- **Universal compatibility** <span class="text-lcars-blue">vs. framework-specific implementations</span>
- **Fine-grained reactivity** <span class="text-lcars-blue">that JustWorks™</span>

</v-clicks>

<!--
Unlike _other_ data libraries, WarpDrive is built around:

* Resource-first architecture instead of heavy model inheritance patterns
* Schemas for consistent, sharable data shapes
* Universal compatibility vs. framework-specific implementations
* And Fine-grained reactivity that just works
-->

---

# The Universal Promise

"Separate the saucer section!"

<div class="grid grid-cols-2 gap-4">

<div class="callout ml-auto">

<div class="code font-size-3">

<div><carbon-folder /> packages/</div>
<div>└── <span class="text-lcars-amber"><carbon-layers /> shared-data</span></div>
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
Let's talk about "universal".

By "universal", we mean you can build your data layer in a separate package and share it across multiple frontends, regardless of framework.

This isn't just theory...

This is the actual structure of the monorepo I am presenting today:

We have a `shared-data` package that contains all of our WarpDrive configuration, logic, and utilities.

Today I will be presenting the emberjs app, but you could just as easily build a React or Vue app that shares this same data layer.

Even our `api` implementation, written in node, uses types imported from the shared data layer.
-->

---
layout: section
title: 'Episode 2: "Engage! - Setting Up Our Mission"'
---

# Episode 2

## "Engage! - Setting Up Our Mission"

<!--
Let's talk about what we're going to build today.

I promise, it's something ambitious.
-->

---

# Our Mission Brief

We'll implement a TodoMVC application using:

<v-clicks>

- ***Warp*Drive** <span class="text-lcars-blue">(our starship for data management)</span>
- **\{JSON:API\}** <span class="text-lcars-blue">(the gold standard for API communication)</span>
- **TypeScript** <span class="text-lcars-blue">(because we like our data typed and our code safe)</span>
- **Modern Ember Polaris** <span class="text-lcars-blue">(the latest and greatest Ember patterns)</span>

</v-clicks>

<v-click>

<div class="mt-4 text-sm text-lcars-blue">
(Yes, we're using Vite)
</div>

</v-click>

<div class="callout mt-8 float-right">
By the end, you'll see how WarpDrive makes data management feel... <em>logical</em>.
</div>

<!--
Today, we’ll implement a TodoMVC application step-by-step using:

* WarpDrive
* JSON:API
* TypeScript
* Modern Ember Polaris
* (Yes, we're using Vite)
-->

---

# TodoMVC: Our Prime Directive

A spec for a simple Todo app

Implemented in multiple frameworks to compare approaches.

<v-click>

Todo resource:

<div class="callout max-w-xs mt-8">
```ts
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

It’s built around a simple Todo resource:

a string id

a string title attribute

and a boolean completed attribute
-->

---

# TodoMVC: Our Prime Directive

Every TodoMVC implementation shares the same [core features](https://github.com/tastejs/todomvc/blob/master/app-spec.md):

<div class="grid grid-flow-col gap-4">

<div class="callout">
<img src="./picard-todos.png" alt="TodoMVC UI with Captain Picard's Todo List" class="h-80 w-auto" />
</div>

<div>

<v-clicks >

You can create a Todo

You can read lists of:<br />All Todos, Active Todos, and Completed Todos

You can update each Todo

You can delete a Todo

You can perform bulk actions:<br />toggle and delete

</v-clicks>

</div>

</div>

<!--
Every TodoMVC implementation shares the same core features:

* You can create a Todo

* You can read lists of All Todos, Active Todos, and Completed Todos

* You can update each Todo

* You can delete a Todo

* And you can bulk toggle and delete todos.

The Ember TodoMVC I forked for today's presentation was created by Miguel, Addy, and Preston, for which I am grateful.
-->

---
layout: center
---

# Live Demo: [TodoMVC Feature Set](http://localhost:4200/?initialTodoCount=featureSet&shouldError=false&shouldPaginate=false&latency=0)

<!--
Here's a sneak preview of what we're building today.
-->

---
layout: section
title: 'Episode 3: "Request Patterns - Making It So"'
---

# Episode 3

## "Request Patterns - Making It So"

<!--
We've forked our TodoMVC app.

Now it's time to "set its data layer to stun" by updating it to use WarpDrive.
-->

---

# The WarpDrive Store - "The Bridge"

<v-click at=1>
<p>It's in command.</p>
</v-click>

<MacWindow title="packages/shared-data/src/stores/index.ts" class="max-w-2xl mb-6">
<<< @/packages/shared-data/src/stores/index.ts ts {20|20|21|30-37|39-44|46-52}{maxHeight: '200px'}
</MacWindow>

<v-clicks at=2>

- **Manages Requests** - How we handle requests for data
- **Manages the Cache** - How to cache that data
- **Manages Schemas** - Schemas for what our data looks like
- **Manages Reactive State** - What sort of reactive objects to create for that data

</v-clicks>

<!--
First, in our shared-data package, we are adding a shared WarpDrive "store" implementation.

* You can think of the "store" as the "bridge" of our WarpDrive Starship. Like the bridge, it's in command of everything.

The store is fully customizable and configurable. Our store, however, is basically identical to the one recommended in the WarpDrive guides.

* It handles request management via its RequestManager
* It handles cache management via a CachePolicy that manages our JSONAPICache
* It manages our schemas via a schema service
* And it manages our reactive state by determining what reactive objects to create for our data.
-->

---

# The RequestManager - "The Communications Officer"

<v-click at=1>
<p>It manages all external contact.</p>
</v-click>

<MacWindow title="packages/shared-data/src/stores/index.ts" class="max-w-2xl mb-6">
<<< @/packages/shared-data/src/stores/index.ts ts {21|21|26|22-27|28|21-28}{maxHeight: '200px'}
</MacWindow>

<v-clicks at=2>

- **Fetch Handler** - Makes actual network requests (Fetch API + error handling)
- **Request Pipeline** - Allows custom handlers for data transformation
- **Cache Integration** - Automatically caches responses
- **Does What It Says** - On the tin

</v-clicks>

<v-click>

</v-click>

<!--
One of the most important parts of the store is the "Request Manager"

* Think of RequestManager as your ship's communications officer - it manages all external contact!

RequestManager is also fully customize-able.

* You don't even need to use Fetch, though we will. Our RequestManager is basically identical to the one recommended in the WarpDrive guides.

* You can customize it with handlers to transform requests and responses as needed. These handlers can choose to call `next()`, similar to middleware patterns in API frameworks.
* You can also register a special "CacheHandler" to integrate with WarpDrive's caching system.
In our case, we're using the default CacheHandler.

So the Request Manager does exactly what it says on the tin.

* It manages your requests.
-->

---

# \{JSON:API\} - "The Communicator"

By default, _Warp_**Drive** speaks \{JSON:API\} fluently, giving you:

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
- **Built-in conventions** for pagination, filtering, sorting, and sparse fields

</v-clicks>

<v-click>

<div class="mt-4 text-sm text-lcars-blue">
(But, you can configure <i>Warp</i><strong>Drive</strong> to use other formats if you prefer!)
</div>

</v-click>

</div>

</div>

<!--
If the RequestManager is the "communication officer," think of JSON:API as the communicator.

It's a language that WarpDrive speaks fluently, giving you:
* A Standardized format for resources, relationships, and errors
* And Built-in conventions for pagination, filtering, sorting, and sparse fields
* But, you don't have to use JSON:API if you don't want to. You can configure your WarpDrive store to use another format instead.
-->

---

# Making a Request

<MacWindow title="apps/my-app/routes/index.js" class="max-w-2xl">

```js {all}
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
The simplest way to make a request is to pass a request info object to the store's request method.

This method delegates the request to the store's RequestManager.

For example, this request will get all todos from our API.
-->

---

# Request Info

<MacWindow title="warp-drive/warp-drive-packages/core/src/types/request.ts" class="max-w-2xl">

```ts {1-4|all}{maxHeight: '380px'}
interface RequestInfo extends RequestInit {
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
Requests can take any of the standard Fetch API `RequestInit` options...

* plus some extras to configure caching and handler behavior.

As you can imagine, these options can get quite complex, which is why WarpDrive supports request builders...
-->

---

# Request Builders

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-center">

<MacWindow title="packages/shared-data/src/builders/todo/query.ts">
<<< @/packages/shared-data/src/builders/todo/simple-query.ts ts {8-9|8-9|11|12|14-15}{maxHeight: '300px'}
</MacWindow>

<div>

<v-clicks at=1>

Our `getAllTodos` builder

Specifies the request method

Generates the URL

Sets cache options:<br />`'query'` op, `'todo'` type

</v-clicks>

</div>

</div>

<!--
A request builder is just a simple function that returns a RequestInfo object.

* Here's a reusable builder for our 'getAllTodos' request, using WarpDrive
request utilities to ensure consistency across our app.
* It sets the request method to 'GET'.
* It generates the URL, using the resource path plus a configurable namespace
* And it sets cache options.

In this case, Adding the 'query' OpCode and specifying the 'todo' type in
`cacheOptions` tells the `DefaultCachePolicy` in our store to
automatically invalidate this request when any request with the
'createRecord' OpCode + 'todo' as one of it's `cacheOptions` types succeeds.

Say *that* five times fast.
-->

---

# Query Builders - Automatic Cache Invalidation

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-center">

<MacWindow title="packages/shared-data/src/builders/todo/create.ts">
<<< @/packages/shared-data/src/builders/todo/create.ts ts {8-25|8-25|22-23}{maxHeight: '350px'}
</MacWindow>

<div>

<v-clicks at=1>

Our `createTodo` builder

Sets cache options:<br />`'createRecord'` op, `'todo'` type

</v-clicks>

</div>

</div>

<!--
So what that means is,

* when we use this `createTodo` builder to create a new todo...
* Because it sets the 'createRecord' OpCode and specifies 'todo' in its `cacheOptions` types...

Our query from the previous builder will automatically be invalidated and re-fetched the next time its results are rendered.
-->

---

# Request Builders - Query Params

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-center">

<MacWindow title="packages/shared-data/src/builders/todo/query.ts" class="w-140">
<<< @/packages/shared-data/src/builders/todo/simple-query.ts ts {19-33|19-33|21-24,28}{maxHeight: '300px'}
</MacWindow>

<div>

<v-clicks at=1>

- Our `getCompletedTodos` builder
- `buildQueryParams` util

</v-clicks>

</div>

</div>

<!--
One last thing about request builders:

WarpDrive also provides utilities to help with common request patterns.

* For example, here is the builder for the request made by our "Completed" filter.

It looks the same as our `getAllTodos` builder...

* except it adds a query parameter to the URL to filter.

This allows us to fetch only the completed todos.
-->

---
layout: section
title: 'Episode 4: "Schemas - The Universal Translator"'
---

# Episode 4

## "Schemas - The Universal Translator"

<!--
Now that we can make a request, let's talk about how WarpDrive translates the returned JSON:API into reactive records that we can use in our UI.

For that, we need schemas.
-->

---

# Schema-Driven Development

Instead of models with complex inheritance, _Warp_**Drive** uses simple, declarative schemas:

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
Instead of models with complex inheritance, WarpDrive uses simple, declarative schemas.

Our Todo Schema is very simple:

* `withDefaults` sets up defaults, like the `id` field
* `type` defines the resource type
* and `fields` defines the shape of the resource. In this case, a simple object with title and completed fields.

WarpDrive actually provides lots of powerful schema features that we're not using here.

More on that this afternoon in Mehul's talk about "ReactiveResources & Schema‑Driven Data Handling"
-->

---

# TypeScript Integration

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-end">

<MacWindow title="packages/shared-data/src/types/todo.ts" class="max-w-2xl">
<<< @/packages/shared-data/src/types/todo.ts ts {11-27|11-27|11-15|17-21|23-27}{maxHeight: '380px'}
</MacWindow>

<div class="max-w-sm">

<v-clicks at=0>

- Types for various states:
- `TodoAttributes` type
- Readonly `Todo` type
- `EditableTodo` type

</v-clicks>

<div class="callout">
  "Data, are you getting readings on this?"<br />Yes, and they're <strong>perfectly structured!</strong>
</div>

</div>

</div>

<!--
Because resources are just thin wrappers over POJOs,

* you can define types for their various states...
* An attribute type for creation
* A readonly Todo type
* An editable Todo type

The only limit is your imagination!
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
To integrate WarpDrive with Ember, you need to use the @warp-drive/ember package.

This package provides components built over the core WarpDrive reactive utilities for working with promises and requests.

These components enable you to build robust and performant apps with elegant control flow.
-->

---

# Components with Reactive Magic

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-center">

<MacWindow title="apps/emberjs/app/components/todo-app/todo-provider.gts" class="max-w-2xl">
<<< @/apps/emberjs/app/components/todo-app/todo-provider-request-version.gts ts {14|14|15-17|23-24|29-36|26-27|18-20}{maxHeight: '360px'}
</MacWindow>

<div class="max-w-sm">

<v-clicks at=0>

- Our `<TodoProvider />` component
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
* Here, we are looking at a simple TodoProvider component that fetches all todos.
* It uses WarpDrive's Request component to declaratively handle request state.
* On load, it displays a loading spinner.
* On error, it displays an error message with a retry button.
* And on success, it passes the data to the Todos component.
* And! When cached responses for this request are invalidated, the component automatically re-renders with fresh data.

* There's even more, and I encourage you to check out the `@warp-drive/ember` readme to learn about it.
-->

---
layout: center
---

# Live Demo: [Basic Request Loading States](http://localhost:4200/?initialTodoCount=basicLoadingStates&shouldError=false&shouldPaginate=false&latency=1000)

<!--
So, let's take a look this in our Todo app.

First, I need to check the configuration.
Then, we'll demo our requests, showing loading state, caching behavior, and a few other TodoMVC features implemented with WarpDrive and Ember.

- Initial Todo Count: A Few
- API Reliability: Good
- API Latency: Slow
- Mode: Hobbyist

1. Demo loading state with network throttling
2. Demo caching on the queries
3. Demo adding a todo
-->

---
layout: center
---

# Live Demo: [Basic Error States](http://localhost:4200/?initialTodoCount=basicErrorStates&shouldError=true&shouldPaginate=false&latency=1000)

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

<!--
We've been working in our Ember app, but I just want to remind you that WarpDrive is a "universal" data framework.

For example, here is the same TodoProvider implemented in React.

Our React library shipped a few weeks ago and we have Vue and Svelte libraries in the works.
-->

---
layout: section
title: 'Episode 6: "Data Mutations - Quantum Mechanics"'
---

# Episode 6

## "Data Mutations - Quantum Mechanics"

<!--
We can now create and read Todos. But what about mutations?

Our spec requires being able to update and delete Todos.
-->

---

# Pessimistic vs. Optimistic

When changing data, you have two choices:

<div class="grid grid-cols-2 gap-4 grid-items-center">
<v-clicks>
  <div class="callout-solid">
    <h3>Pessimistic Mutation</h3>
    <p>Wait for server confirmation before updating UI</p>
  </div>
  <div class="callout-solid">
    <h3>Optimistic Mutation</h3>
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
When changing data, you have two choices:

* Pessimistic Updates - Wait for server success confirmation before updating UI
* Optimistic Updates - Update UI immediately, then confirm with server. Rollback if the request fails.
* Both have trade-offs.
* WarpDrive supports both. The choice is yours.

Our Todo app uses a combination of pessimistic and optimistic mutations.
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

<!--
* When updating a Todo's title, we follow a "pessimistic mutation" pattern.
* We make a patch request with our `patchTodo` builder
* We pass it the todo item to update and the attributes we want to change
* When this request finishes, the todo item updates everywhere in our app.
* This seems almost too easy.
-->

---

# Pessimistic Mutation

<div class="grid grid-flow-col gap-4 grid-items-center">

<MacWindow title="packages/shared-data/src/builders/todo/update.ts" >
<<< @/packages/shared-data/src/builders/todo/update.ts gts {11-20|11-20|30|21-27,31|32-38|40-41}{maxHeight: '300px'}
</MacWindow>

<v-clicks at=1>

- Our `patchTodo` builder
- Specifies the request method
- Generates the URL
- Serializes the request body
- Sets cache options
- tl;dr: It will update our Todo queries

</v-clicks>

</div>

<!--
* The real magic is in our `patchTodo` builder:
* Just like our `getAllTodos` builder, it specifies the request method
* it generates the URL -- now using a resource key to determine the ID to include
* It serializes the request body in JSON:API format
* And it sets cache options

Adding the 'updateRecord' OpCode and specifying the `ResourceKey` for
 this todo in the `records` array tells the `DefaultCachePolicy` in our
 store that when this request succeeds it should automatically patch
 the returned attributes into any matching resources in any cached
 documents for requests with the 'query' OpCode that include this
 record in their results when this request succeeds.

 * In this case, it will update our queries automatically when this request succeeds.
-->

---
layout: center
---

# Live Demo: [Pessimistic Mutation](http://localhost:4200/?initialTodoCount=pessimisticMutation&shouldError=false&shouldPaginate=false&latency=1000)

<!--
Back to our live demo. Let's update a todo title and see what happens.

REFRESH PAGE BEFORE DEMO

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
<<< @/apps/emberjs/app/components/todo-app/todo-item.gts gts {45-47|45-47|155-162|186-192,199-203|191-192}{maxHeight: '350px'}
</MacWindow>

<v-clicks at=4>

- Uses the same `patchTodo` builder, but this time with a mutated `EditableTodo`

</v-clicks>

<!--
* In addition to being able to update a todo's title, we need a way to mark it as completed.

In this case, we render the completed state in multiple places in the TodoItem component. When a todo is completed, we need to simultaneously display a strikethrough in the title...

* And a check in the checkbox.

Even though these are in completely different components.

* To do this, our `patchTodoToggle` action uses *optimistic* mutation to ensure that the completion state is shown consistently throughout the entire `TodoItem` parent component.

* In this case, we use the same `patchTodo` builder, but we mutate the state of an _editable_ copy of the todo first.

When the patch request succeeds, WarpDrive will "commit" the local changes from the editable todo back to the upstream, immutable todo.
-->

---

# Controlled Optimistic Mutation with Checkout

<div class="grid grid-flow-col gap-4 grid-items-center">

<MacWindow title="apps/emberjs/app/components/todo-app/todo-list.gts" class="w-150">
<<< @/apps/emberjs/app/components/todo-app/todo-list.gts gts {21|21|22|25-31|22-36}{maxHeight: '380px'}
</MacWindow>

<div>
<v-clicks at=1>

- By default, resources are immutable
- To get a mutable version, we use `await checkout(todo)`
- Pass the mutable `EditableTodo` to our `<TodoItem />` component
- `<Await />` component handles promise states declaratively

</v-clicks>
</div>
</div>

<!--
- That's right, by default, all resources are immutable
- To get a mutable version, we use `await checkout(todo)`
- This returns an `EditableTodo` that we can modify freely
- When we're ready, we pass that `EditableTodo` to our `TodoItem` component, where it eventually makes its way to our `patchTodo` builder
- Note that we're using the `@warp-drive/ember` `Await` component here. Similar to the `Request` component, it handles promise states declaratively.
-->

---

# Patching State

<MacWindow title="apps/emberjs/app/components/todo-app/todo-item.gts" class="mb-4 max-w-2xl">
<<< @/apps/emberjs/app/components/todo-app/todo-item.gts gts {186-192,199-203|186-192,199-203|194-198}{maxHeight: '300px'}
</MacWindow>

<v-clicks at=1>

- Our `patchTodoToggle` action
- Patch the cached filter query documents manually

</v-clicks>

<!--
* There's one other interesting bit to our `patchTodoToggle` action.

Because we've already made requests for completed and active todos, our store has cached documents for both.

But WarpDrive can't predict that just because a Todo's `completed` attribute changed, it should move between those two lists.

* So, we have to patch the cached documents manually.

NOTE that Cache patching is _not a requirement_ of optimistic updates. It's required because we're updating the `completed` attribute used in the query filter.
-->

---

# Patching State

<MacWindow title="packages/shared-data/src/builders/todo/update.ts" class="mb-4 max-w-2xl">
<<< @/packages/shared-data/src/builders/todo/update.ts gts {64-68|64-68|75-81|85-90|94}{maxHeight: '300px'}
</MacWindow>

<v-clicks at=2>

- `cache.patch()` surgically updates cached documents
- Add to completed list; remove from active list
- Invalidate all queries with the `'todo-count'` tag -- forces refetch

</v-clicks>

<!--
* I put this logic in utility functions because I use it in multiple places.
* It uses the store's `cache.patch()` method to surgically update the cached documents.
In the case of `patchCacheTodoCompleted` we add the todo to the completed list
* and remove it from the active list.
* We also invalidate all queries with the 'todo-count' tag to force a refetch as these requests are inexpensive.
-->

---
layout: center
---

# Live Demo: [Optimistic Mutation and Cache Patching](http://localhost:4200/?initialTodoCount=optimisticMutation&shouldError=false&shouldPaginate=false&latency=1000)

<!--
Let's take a look at this toggle button in action.

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

<v-click at=2>

<div class="callout float-right">
"Captain, the data has been successfully modified...<br />...without temporal paradoxes!"
</div>

</v-click>

<!--
To recap:

Whether you choose pessimistic or optimistic updates:

* Your Original data stays immutable
* Your Changes are isolated until saved
-->

---
layout: section
title: 'Episode 7: "Performance - Warp 9.8"'
---

# Episode 7

## "Performance - Warp 9.8"

<!--
Now it's time to get really ambitious.

It turns out that our Todo MVC MVP has gotten quite popular and we're really raking in the dough.

We've got some big customers. Over 50% of Starfleet command.
-->

---

# Built for Performance

_Warp_**Drive** optimizes automatically:

<v-clicks>

- **Request deduplication** - Same request? Use cached result
- **Fine-grained reactivity** - Only update what actually changed

</v-clicks>

<!--
Fortunately,
WarpDrive provides built-in performance optimizations,
* like caching and request deduplication.
* and fine-grained reactivity.

But our TodoMVC MVP has gotten so popular that we're still starting to hit performance limits.

We've even seen some "scale pioneer" users with hundreds of thousands of todos in their list.
-->

---
layout: center
---

# Live Demo: [Scale Pioneers](http://localhost:4200/?initialTodoCount=100000&shouldError=false&shouldPaginate=false&latency=50)

<!--
Our support team sent us this customer app that really exemplifies some performance issues we are seeing.

It turns out this customer has 100k todos, and they're really having issues.

Let me just switch back to our demo app and load the customer's data to test.

- (UPDATE) Initial Todo Count: A Lot
- API Reliability: Good
- API Latency: Slow
- Mode: Hobbyist

1. Demo 100k todos without pagination

Fortunately, WarpDrive has another trick up it's sleeve:
Built in pagination utilities. It's time to activate the "ENTERPRISE EDITION."

- (UPDATE) Mode: Enterprise
-->

---
layout: center
---

# Live Demo: [Enterprise Edition](http://localhost:4200/?initialTodoCount=100000&shouldError=false&shouldPaginate=true&latency=50)

<!--
Fortunately, WarpDrive has another trick up it's sleeve:
Built in pagination utilities. It's time to activate the "ENTERPRISE EDITION."

- (UPDATE) Mode: Enterprise
-->

---

# <span class="text-lcars-blue">Coming Soon For Real:</span> Paginate

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-center">

<MacWindow title=".../app/components/todo-app/todo-provider.gts" class="w-130">
<<< @/apps/emberjs/app/components/todo-app/todo-provider.gts ts {28|28|30-35|40-43|55-58|60-63|45-53|33-35}{maxHeight: '360px'}
</MacWindow>

<div>

<v-clicks at=1>

- Our `<TodoProvider />` component
- `<Paginate />` component
- Loading states - for initial, previous, and next
- Error state
- Pagination controls
- Success state - display all the data, or just one page
- Autorefresh

</v-clicks>

</div>

</div>

<!--
* Here' we're looking at the real TodoProvider component used by our Enterprise Edition Todo App.
* It uses WarpDrive's Paginate component to declaratively handle request state.
* On load, it displays a loading spinner.
* On error, it displays an error message with a retry button.
* It displays the pagination state via the always block.
* And on success, it passes the current page of data to the Todos component.
* And! When cached responses for this request are invalidated, the component automatically re-renders with fresh data.
-->

---

# <span class="text-lcars-blue">Any Day Now I Swear:</span> EachLink

<div class="grid grid-flow-col gap-4 grid-items-center grid-items-center">

<MacWindow title=".../app/components/todo-app/pagination-controls.gts" class="max-w-2xl">
<<< @/apps/emberjs/app/components/todo-app/pagination-controls.gts ts {29|29|33-37,41-45|39|122-132|124-126|128-130}{maxHeight: '380px'}
</MacWindow>

<div class="max-w-sm">

<v-clicks at=1>

- Our `<PaginationControls />` component
- Previous and next page buttons
- Render page links
- `<EachLink />` component
- Yields a `<:link>` block for each known page link
- Yields a `<:placeholder>` block for unknown links

</v-clicks>

</div>

</div>

<!--
* Let's talk more about these PaginationControls
* It displays the previous and next page buttons
* It displays page links
* Under the hood, the page links component uses the `<EachLink />` component provided by @warp-drive/ember
* It yields a `<:link>` block for each known page link
* And it yields a `<:placeholder>` block for unknown links
-->

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
Paginate is at it's root a wrapper around the request state for a paginated query builder.

* This is our actual query builder.
* It looks just like the simple `getAllTodos` builder we showed before, but it configures a request for the *initial* page of todos via query params
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

<!--
* And this is an example of the paginated response from our API.
* It provides a spec-compliant `links` object with URLs for the first, next, and last pages. This is how Paginate knows what links to it can load.
* It also provides a non-spec `meta` object with the current and total page counts. This is only required if you are planning on using the EachLink component.
-->

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
* Back to our TodoProvider's invocation of the Paginate component.
* It passes the `@pageHints` argument to extract non-spec pagination meta from the response
* In our case, the API returns meta that is the exact shape we need, but you can extract page-hints however you want.
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
Now that we're paginating our data, we have a problem. *

The TodoMVC spec requires a Toggle button that toggles completion of the full list
and a  "Clear Completed" button that deletes all completed todos.

If we naively implemented these actions by iterating over the full list of
todos and sending individual requests, we'd have to load the entire list into
the client, * or risk updating only part of our full Todo list.
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

* It specifies the request method
* It generates the URL - this time using a custom bulk "ops.bulk.deleteAll" endpoint
* It has no body, and no cache options. Instead, it passes a filter via the query params to tell the server to delete all completed todos.
* It expects an empty response.
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

_Warp_**Drive** is the lightweight data framework for ambitious web applications.

<div class="grid grid-cols-2 gap-4">

<div class="callout-solid">
  <h3>Universal</h3>
  <p>Works with any framework (Ember, React, Vue, Svelte)</p>
</div>

<div class="callout-solid">
  <h3>Typed</h3>
  <p>Fully typed, ready to rock</p>
</div>

<div class="callout-solid">
  <h3>Performant</h3>
  <p>Committed to best-in-class performance</p>
</div>

<div class="callout-solid">
  <h3>Scalable</h3>
  <p>From weekend hobby to enterprise</p>
</div>

</div>

---

# Your Mission, Should You Choose to Accept It

1. Try _Warp_**Drive** in your next project.
2. Explore the guides at [docs.warp-drive.io](https://docs.warp-drive.io) and [canary.warp-drive.io](https://canary.warp-drive.io).
3. Explore this _Warp_**Drive** TodoMVC monorepo at [github.com/gitKrystan/2025-emberfest](https://github.com/gitKrystan/2025-emberfest).
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
