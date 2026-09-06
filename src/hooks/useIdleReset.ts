import { useCallback, useEffect, useRef, useState } from 'react';
export const IDLE_WARNING_MS = 90_000;
export const IDLE_RESET_MS = 120_000;
export function idleRemaining(elapsed: number): number | null {
  return elapsed < IDLE_WARNING_MS ? null : Math.max(0, Math.ceil((IDLE_RESET_MS - elapsed) / 1000));
}
export function useIdleReset(reset: () => void) {
  const lastActivity = useRef(0);
  const warning = useRef(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const keepGoing = useCallback(() => {
    lastActivity.current = Date.now(); warning.current = false; setRemaining(null);
  }, []);
  useEffect(() => {
    lastActivity.current = Date.now();
    warning.current = false;
    function activity() { if (!warning.current) lastActivity.current = Date.now(); }
    function tick() {
      const next = idleRemaining(Date.now() - lastActivity.current);
      warning.current = next !== null;
      setRemaining(next);
      if (next === 0) { keepGoing(); reset(); }
    }
    const events = ['pointerdown', 'keydown', 'scroll', 'wheel', 'touchmove'] as const;
    events.forEach((name) => window.addEventListener(name, activity, { passive: true, capture: true }));
    document.addEventListener('visibilitychange', tick);
    const interval = window.setInterval(tick, 1000);
    return () => {
      clearInterval(interval);
      events.forEach((name) => window.removeEventListener(name, activity, true));
      document.removeEventListener('visibilitychange', tick);
    };
  }, [reset, keepGoing]);
  return { remaining, keepGoing };
}
