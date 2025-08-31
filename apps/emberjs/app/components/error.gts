import type { TOC } from '@ember/component/template-only';

export const HandleError = <template>
  <div class="error">
    <h2>Something went wrong</h2>
    {{throwError @error}}
  </div>
</template> satisfies TOC<{
  Element: HTMLDivElement;
  Args: { error: unknown };
}>;

function throwError(error: unknown): never {
  // @ts-expect-error FIXME later
  throw new Error(error);
}
