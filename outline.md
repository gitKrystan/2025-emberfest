# WarpDrive: Set Data to Stun

## Conference Talk Outline - EmberFest 2025

---

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

### What We'll Build

We'll implement a TodoMVC application step-by-step using:

- **Modern Ember Polaris** (the latest and greatest Ember patterns)
- **TypeScript** (because we like our data typed and our code safe)
- **WarpDrive** (our starship for data management)

By the end, you'll see how WarpDrive makes data management feel... _logical_.

---

## Chapter 1: "What is WarpDrive?" (8 minutes)

### The Mission Brief

WarpDrive is **the lightweight data framework for ambitious web applications** —

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
├── 📊 schemas/
└── 🛸 builders/
└── 🛸 handlers/

🚀 ember-app
└── @warp-drive/ember

⚛️ react-app
└── @warp-drive/react

📱 vue-app
└── @warp-drive/vue
```

This isn't just theory - we can literally share our data layer across multiple applications.

---

## Chapter 2: "Engage! - Setting Up Our Mission" (7 minutes)

### Getting Started with WarpDrive

```bash
# The fastest way to warp into action
npx warp-drive

# For our Ember mission
pnpm install @warp-drive/ember
```

¹`npx warp-drive`: https://github.com/emberjs/data/pull/9471

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

### Shared Store Setup

- What is the WarpDrive store?
  - A central hub for managing our data resources
  - It handles fetching, caching, and reactive updates
- How do I make one?

```typescript
// FIXME: Example, located in shared-data-layer

export default class AppStore extends Store {
  // WarpDrive handles the heavy lifting
  // We just need to configure our schemas
}
```

_"Number One, our data store is online!"_

---

## Chapter 3: "Schemas - The DNA of Your Data" (10 minutes)

### Schema-Driven Development

Instead of models with complex inheritance, WarpDrive uses simple JSON schemas:

```typescript
// schemas/todo.ts
import { withDefaults } from '@warp-drive/core/reactive';

export const TodoSchema = withDefaults({
  type: 'todo',
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

- FIXME: What does `withDefaults` do?

### The Magic of Derived Fields

Notice that `status` field? It's **derived** - automatically calculated based on other fields. No more manual property updates!

### Schema Registration

```typescript
// FIXME: Example, located in shared-data-layer
```

_"Data, are you getting readings on this?"_ - Yes, and they're perfectly structured!

### Resource Types

- "schema" vs "resource" -- resource is specific to the request
- FIXME: Ensure we show TS types for saved vs unsaved data, etc

---

## Chapter 4: "Request Patterns - Making It So" (10 minutes)

### Requests Without the Fuss

WarpDrive uses a familiar fetch-like API:

FIXME: What is `withBrand`?

```typescript
// services/todo-repository.ts
import { service } from '@ember/service';
import { withBrand } from '@warp-drive/core/types/request';

export class TodoRepository extends Service {
  @service declare store: Store;

  // Typed request builders
  getAllTodos() {
    return withBrand<Todo[]>({
      method: 'GET',
      url: '/api/todos',
    });
  }

  createTodo(title: string) {
    return withBrand<Todo>({
      method: 'POST',
      url: '/api/todos',
      body: JSON.stringify({ title, completed: false }),
    });
  }

  async loadTodos() {
    const { content } = await this.store.request(this.getAllTodos());
    return content;
  }
}
```

### The Power of Request Builders

- **Typed responses** - TypeScript knows what's coming back
- **Composable** - Build complex requests from simple parts
- **Cacheable** - WarpDrive handles deduplication automatically

_"Make it so!" - And WarpDrive makes it typed._

---

## Chapter 5: "Reactive Control Flow - The Enterprise UI" (8 minutes)

### Components with Reactive Magic

Here's where WarpDrive really shines - reactive control flow:

```gts
// components/todo-list.gts
import { Request } from '@warp-drive/ember';
import { getAllTodos } from '../requests/todo-requests';
import TodoItem from './todo-item';
import LoadingSpinner from './loading-spinner';

export default <template>
  <Request @query={{getAllTodos}}>
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

---

## Chapter 6: "Data Mutations - Quantum Mechanics" (7 minutes)

### Controlled Mutation with Checkout

WarpDrive handles mutations through a "checkout" system:

```typescript
// components/todo-item.gts
import { Checkout } from '@warp-drive/core/reactive';

export default class TodoItem extends Component {
  @service declare store: Store;

  toggleCompleted = async () => {
    // Check out the todo for editing
    const editableTodo = await this.args.todo[Checkout]();

    // Make our changes
    editableTodo.completed = !editableTodo.completed;

    // Save to server
    await this.store.request({
      method: 'PATCH',
      url: `/api/todos/${editableTodo.id}`,
      body: JSON.stringify({ completed: editableTodo.completed }),
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

## Chapter 7: "Universal Deployment - Separating the Saucer Section" (5 minutes)

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

---

## Chapter 8: "Advanced Patterns - Warp 9.8" (8 minutes)

### Real-time with Surgical Updates

```typescript
// Real-time todo updates via WebSocket
store.cache.patch({
  op: 'updateRecord',
  record: { type: 'todo', id: '1' },
  value: { completed: true },
});
```

### Custom Request Handlers

```typescript
const CamelCaseHandler = {
  request(context, next) {
    return next(context.request).then((result) => {
      return convertKeysToCamelCase(result.content);
    });
  },
};
```

### Advanced Schema Features

```typescript
const TodoSchema = withDefaults({
  type: 'todo',
  fields: [
    // ... basic fields
    {
      kind: 'belongsTo',
      name: 'owner',
      type: 'user',
    },
    {
      kind: 'derived',
      name: 'isOverdue',
      type: 'computed',
      options: {
        compute: (todo) => {
          return todo.dueDate && todo.dueDate < new Date() && !todo.completed;
        },
      },
    },
  ],
});
```

_"We're approaching maximum warp, Captain!"_

---

## Chapter 9: "Performance - Ludicrous Speed" (5 minutes)

### Built for Performance

WarpDrive optimizes automatically:

- **Request deduplication** - Same request? Use cached result
- **Fine-grained reactivity** - Only update what actually changed
- **Lazy evaluation** - Derived fields computed on demand
- **Memory efficient** - Immutable data with structural sharing

### Bundle Size Comparison

```
Traditional approach: ~45kb
WarpDrive core: ~12kb
Framework adapter: ~3kb
Total: ~15kb (67% smaller!)
```

### Benchmarks

_Show performance comparison chart_

- 3x faster initial render
- 5x faster updates
- 50% less memory usage

_"She's giving us all she's got, Captain, and she's still got more in reserve!"_

---

## Chapter 10: "The Future - Final Frontier" (3 minutes)

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

---

## Conclusion: "Live Long and Prosper" (2 minutes)

### What We've Discovered

Today we've seen how WarpDrive delivers:

- ✅ **Universal compatibility** across frameworks
- ✅ **Type safety** without complexity
- ✅ **Performance** that scales
- ✅ **Developer experience** that just works
- ✅ **Reactive patterns** that eliminate boilerplate

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
