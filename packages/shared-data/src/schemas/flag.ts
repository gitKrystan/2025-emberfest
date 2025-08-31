import { withDefaults } from '@warp-drive/core/reactive';

export const FlagSchema = withDefaults({
  type: 'flag',
  fields: [
    {
      name: 'value',
      kind: 'field',
    },
  ],
});
