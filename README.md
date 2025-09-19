# TodoMVC Enterprise Edition

## To run

1. `pnpm install`
2. `cd packages/shared-utils && pnpm build`
3. `cd packages/shared-data && pnpm start`
4. `cd apps/api && pnpm start`
5. `cd apps/emberjs && pnpm start`

## To view [Slidev](https://github.com/slidevjs/slidev) show

To start the slide show:

1. All of the above
2. `pnpm start` in the root folder
3. Visit <http://localhost:3030>

Edit the [slides.md](./slides.md) to see the changes.

Learn more about Slidev at the [documentation](https://sli.dev/).

## TODO

- [ ] Search code for `TODO:` and `fixme`, and fix those issues
- [ ] Implement `apps/react`
- [ ] Implement `apps/vue`
- [ ] Implement `apps/svelte`
- [ ] Implement `LocalStorage` handler and upstream the ember app to the TodoMVC repo
