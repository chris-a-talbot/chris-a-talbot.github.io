import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'ct:background';
/** Typed anywhere on the site. Deliberately not documented in the UI. */
const SEQUENCE = 'slfv';

/**
 * Which background the site draws. False is the contour survey; true is the
 * spatial Lambda-Fleming-Viot process. There is no visible control for this on
 * purpose — see initBackgroundToggle.
 */
export const slfvMode = writable(false);

/**
 * Typing the sequence switches the background and typing it again switches back.
 * The choice is remembered across pages and reloads.
 *
 * Returns a teardown function, so it can be handed straight to onMount.
 */
export function initBackgroundToggle(): () => void {
  if (!browser) return () => {};

  slfvMode.set(localStorage.getItem(STORAGE_KEY) === SEQUENCE);

  let typed = '';

  const onKeydown = (event: KeyboardEvent) => {
    // Never swallow real typing, and leave shortcuts alone.
    const target = event.target as HTMLElement | null;
    if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) {
      return;
    }
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key.length !== 1) return;

    typed = (typed + event.key.toLowerCase()).slice(-SEQUENCE.length);
    if (typed !== SEQUENCE) return;

    typed = '';
    slfvMode.update((on) => {
      const next = !on;
      localStorage.setItem(STORAGE_KEY, next ? SEQUENCE : 'contour');
      return next;
    });
  };

  window.addEventListener('keydown', onKeydown);
  return () => window.removeEventListener('keydown', onKeydown);
}
