import { withDefaults } from '@warp-drive/core/reactive';

export const TodoSchema = withDefaults({
  type: 'todo',
  fields: [
    {
      name: 'title',
      kind: 'field',
    },
    {
      name: 'completed',
      kind: 'field',
    },
  ],
});
