/**
 * Schedule third-party analytics after first paint / interaction.
 * Never injects during hydration or critical rendering.
 */

const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;

/** Buffer after `load` before idle inject. */
export const POST_LOAD_DELAY_MS = 3000;
/** requestIdleCallback timeout budget. */
export const IDLE_TIMEOUT_MS = 8000;
/** Absolute fallback for quiet sessions (no interaction). */
export const HARD_FALLBACK_MS = 15000;

export type DeferredLoadOptions = {
  postLoadDelayMs?: number;
  idleTimeoutMs?: number;
  hardFallbackMs?: number;
};

/**
 * Runs `load` once on first interaction, or after window load + idle, or hard fallback.
 * Returns a cleanup function.
 */
export function scheduleDeferredThirdParty(
  load: () => void,
  options: DeferredLoadOptions = {}
): () => void {
  if (typeof window === 'undefined') return () => undefined;

  const postLoadDelayMs = options.postLoadDelayMs ?? POST_LOAD_DELAY_MS;
  const idleTimeoutMs = options.idleTimeoutMs ?? IDLE_TIMEOUT_MS;
  const hardFallbackMs = options.hardFallbackMs ?? HARD_FALLBACK_MS;

  let cancelled = false;
  let done = false;
  let idleHandle: number | undefined;
  let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
  let postLoadTimer: ReturnType<typeof setTimeout> | undefined;

  const run = () => {
    if (cancelled || done) return;
    done = true;
    teardown();
    load();
  };

  const onInteraction = () => run();

  const teardown = () => {
    for (const event of INTERACTION_EVENTS) {
      window.removeEventListener(event, onInteraction);
    }
    if (fallbackTimer) clearTimeout(fallbackTimer);
    if (postLoadTimer) clearTimeout(postLoadTimer);
    if (idleHandle != null && typeof window.cancelIdleCallback === 'function') {
      window.cancelIdleCallback(idleHandle);
    }
  };

  for (const event of INTERACTION_EVENTS) {
    window.addEventListener(event, onInteraction, { once: true, passive: true });
  }

  const scheduleIdleLoad = () => {
    postLoadTimer = setTimeout(() => {
      if (typeof window.requestIdleCallback === 'function') {
        idleHandle = window.requestIdleCallback(() => run(), { timeout: idleTimeoutMs });
      } else {
        run();
      }
    }, postLoadDelayMs);
  };

  if (document.readyState === 'complete') {
    scheduleIdleLoad();
  } else {
    window.addEventListener('load', scheduleIdleLoad, { once: true });
  }

  fallbackTimer = setTimeout(run, hardFallbackMs);

  return () => {
    cancelled = true;
    teardown();
    window.removeEventListener('load', scheduleIdleLoad);
  };
}
