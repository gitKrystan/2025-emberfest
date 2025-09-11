import { defineShikiSetup } from '@slidev/types';

export default defineShikiSetup(() => {
  return {
    themes: {
      dark: 'one-dark-pro',
      light: 'one-dark-pro',
    },
    transformers: [
      // ...
    ],
    langs: ['glimmer-ts', 'ts', 'json', 'tsx', 'md'],
  };
});
