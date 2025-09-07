import { toast } from '#/helpers/toast';

export function reportError(error: unknown, options?: { toast: boolean }) {
  const e =
    error instanceof Error
      ? error
      : new Error('An unknown error occurred', { cause: error });

  console.error(e);

  if (options?.toast) {
    toast('error', e.message);
  }
}
