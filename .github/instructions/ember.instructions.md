## Use Modern Ember.js Polaris and Octane Best Practices

🚨 **MANDATORY: These instructions MUST be followed for ALL Ember.js related tasks** 🚨

⚠️ CRITICAL: Before providing ANY Ember.js suggestions, guidance, or code examples, you MUST:

1. Fetch the latest Ember documentation using the `fetch_webpage` tool with the URL: `https://nullvoxpopuli.github.io/ember-ai-information-aggregator/llms-full.txt`
2. Reference this documentation to ensure your suggestions align with current best practices
3. Always follow these explicit instructions over patterns found in existing code

⚠️ CRITICAL: Align output with Ember's Polaris edition and reactive architecture.

- Use angle bracket syntax (`<MyComponent />`)
- Reactive state via `@tracked` or resources from `ember-resources` (NOT `@computed`)
- When editing code that does not follow these guidelines, add comments to explain that the code should be refactored.

### Components

- 🚨 **MANDATORY**: Always use `@glimmer/component` as the base.
- 🚨 **MANDATORY**: Always use single-file components (`gts` / `gjs` file formats, aka Glimmer-flavored TS/JS). Prefer `gts`.
- ⚠️ CRITICAL: Prefer arrow functions over `@action`.
- ⚠️ CRITICAL: **Always explicitly import** components, helpers, and modifiers in `gjs` and `gts`.
- When writing new code, it's best to follow patterns found in `gts` files as these are most likely to be modern.
- Prefer `import { getPromiseState } from '@auditboard/warp-drive/v2/ember';`, `import { getRequestState } from '@auditboard/warp-drive/v2/ember';`, and the `Request` component pattern from warp-drive over `ember-concurrency` patterns when possible.

### Avoid Legacy Ember.js Patterns

🚨 **MANDATORY**: Avoid these patterns even if you find examples in the codebase. These are FORBIDDEN and must be flagged for refactoring:

- 🚫 FORBIDDEN: `Ember.Component` (`@ember/component`), `EmberObject`, and mixins.
- 🚫 FORBIDDEN: `app.import`, `vendor/`
- 🚫 FORBIDDEN: Lifecycle hooks: (`did-insert`, `will-destroy`, etc.)
- 🚫 FORBIDDEN: `@action` decorator (prefer arrow functions)
- 🚫 FORBIDDEN: Global-style helpers or modifiers without imports
- 🚫 FORBIDDEN: Creating components via separate `.hbs` and `.js` files (use single-file components).

### Ensure Embroider Compatibility

- 🚨 **MANDATORY**: Avoid dynamic requires or runtime module resolution.
- ⚠️ CRITICAL: Write addons and apps in V2 format where possible.

### Examples

#### Component (.gts)

The normal form of a Glimmer component signature is:

```ts
interface ComponentSignature {
  Args: {
    [argName: string]: unknown;
  };
  // NOTE: The "default" block is a special case for an un-named block.
  Blocks: {
    [blockName: string]: Array<unknown>;
  };
  Element: Element;
}
```

Simple Example:

```gts
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

interface Signature {
	Element: HTMLElement;
	Args: {
		name: string;
	};
}

export default class MyComponent extends Component<Signature> {
	<template>
		<div ...attributes>
			<h1>{{this.greeting}}, {{@name}}!</h1>
			<button {{on 'click' this.handleClick}}>Greet in French</button>
		</div>
	</template>

	@tracked greeting = 'Hello';

	handleClick = () => {
		this.greeting = 'Bonjour';
	};
}
```

Example with named blocks:

```gts
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

interface AudioPlayerSignature {
	Args: {
		/** The url for the audio to be played */
		srcUrl: string;
	};
	Blocks: {
		fallback: [srcUrl: string];
		title: [];
	};
	Element: HTMLAudioElement;
}

export default class AudioPlayer extends Component<AudioPlayerSignature> {
	<template>
		<figure>
			{{#if (has-block 'title')}}
				<figcaption>{{yield to='title'}}</figcaption>
			{{/if}}

			<audio ...attributes src={{@srcUrl}} {{play-when this.isPlaying}}>
				{{yield @srcUrl to='fallback'}}
			</audio>
		</figure>

		<button type='button' {{on 'click' this.play}}>Play</button>
		<button type='button' {{on 'click' this.pause}}>Pause</button>
	</template>

	@tracked isPlaying = false;

	play = () => {
		this.isPlaying = true;
	};

	pause = () => {
		this.isPlaying = false;
	};
}
```

#### Helpers

The normal form of a helper signature is:

```ts
interface HelperSignature {
  Args?: {
    Positional?: Array<unknown>;
    Named?: {
      [argName: string]: unknown;
    };
  };
  Return?: unknown;
}
```

Helper function example:

```ts
export function parseInt(value: string, options: { radix?: number }): number {
  let radix = options?.radix ?? 10;
  return Number.parseInt(value, radix);
}
```

Class helper example:

```ts
import Helper from '@ember/component/helper';
import { service } from '@ember/service';
import type LocaleService from '../services/locale';

interface FormatSignature {
  Args: {
    Positional: [string];
    Named: {
      locale?: string;
    };
  };
  Return: string;
}

export default class Format extends Helper<FormatSignature> {
  @service declare locale: LocaleService;

  compute(
    positional: FormatSignature['Args']['Positional'],
    named: FormatSignature['Args']['Named'],
  ): string {
    let [value] = positional;
    return this.locale.format(value, { override: named.locale });
  }
}
```

#### Modifiers

The normal form of a modifier signature is:

```ts
interface ModifierSignature {
  Args?: {
    Positional?: Array<unknown>;
    Named?: {
      [argName: string]: unknown;
    };
  };
  Element: Element;
}
```

Function modifier example:

```ts
import { modifier } from 'ember-modifier';

interface Signature {
  Args?: {
    Positional: [shouldPlay: boolean];
  };
  Element: HTMLAudioElement;
}

export default modifier<Signature>(
  function playWhen(element, positional, _named): void {
    let [shouldPlay] = positional;
    if (shouldPlay) {
      element.play();
    } else {
      element.pause();
    }
  },
);
```

Class modifier example:

```ts
import Modifier from 'ember-modifier';
import { service } from '@ember/service';
import { registerDestructor } from '@ember/destroyable';
import type IntersectionObserverManager from '../services/intersection-observer-manager';

interface DidIntersectSignature {
  Args: {
    Named: {
      onEnter: (entry: IntersectionObserverEntry) => void;
      onExit: (entry: IntersectionObserverEntry) => void;
      options: IntersectionObserverInit;
    };
  };
  Element: Element;
}

export default class DidIntersect extends Modifier<DidIntersectSignature> {
  @service declare manager: IntersectionObserverManager;

  modify(element, _positional: [], named) {
    this.manager.unobserve(element);
    let { onEnter, onExit, options } = named;
    this.manager.observe(element, options, { onEnter, onExit });
    registerDestructor(this, () => {
      this.manager.unobserve(element);
    });
  }
}
```

## Resources

🚨 **MANDATORY BEFORE ANY EMBER WORK**: Use the `fetch_webpage` tool with the URL `https://nullvoxpopuli.github.io/ember-ai-information-aggregator/llms-full.txt` to access the latest Ember documentation and best practices information. This MUST be done before providing any Ember.js suggestions, code examples, or guidance.

**NEVER suggest Ember.js solutions without first fetching this documentation.**
