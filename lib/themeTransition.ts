/**
 * Lets parts of the page play something before the theme turns dark (the home
 * portrait takes its sunglasses off first). The theme toggle calls
 * runBeforeDark() and switches once every listener's promise has settled, or
 * after `maxMs` at the latest. With no listener (case pages, reduced motion)
 * it returns at once.
 */
export const BEFORE_DARK_EVENT = "theme:before-dark";

export interface BeforeDarkDetail {
  wait: (promise: Promise<unknown>) => void;
}

export async function runBeforeDark(maxMs = 2500): Promise<void> {
  const pending: Promise<unknown>[] = [];
  window.dispatchEvent(
    new CustomEvent<BeforeDarkDetail>(BEFORE_DARK_EVENT, { detail: { wait: (p) => pending.push(p) } }),
  );
  if (pending.length === 0) return;
  await Promise.race([Promise.allSettled(pending), new Promise((resolve) => setTimeout(resolve, maxMs))]);
}
