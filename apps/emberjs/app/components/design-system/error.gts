import type { TOC } from '@ember/component/template-only';

export const HandleError = <template>
  <div class="error">
    {{#if @display}}
      <p>Something went wrong</p>
    {{/if}}
    {{logError @error}}
  </div>
</template> satisfies TOC<{
  Element: HTMLDivElement;
  Args: { error: unknown; display?: boolean };
}>;

function logError(error: unknown) {
  if (error instanceof Error) {
    // eslint-disable-next-line no-console
    console.error(error);
  } else {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
