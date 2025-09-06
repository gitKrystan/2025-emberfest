import type { TOC } from '@ember/component/template-only';

export const Error = <template>
  <div class="error">
    {{#if @display}}
      <h2>Something went wrong</h2>
    {{/if}}
    {{throwError @error}}
  </div>
</template> satisfies TOC<{
  Element: HTMLDivElement;
  Args: { error: unknown; display?: boolean };
}>;

function throwError(error: unknown): never {
  // @ts-expect-error FIXME later
  throw new Error(error);
}
