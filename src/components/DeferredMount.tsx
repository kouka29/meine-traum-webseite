import { useEffect, useState, type ReactNode } from "react";

/**
 * Renders `children` only after the browser is idle (or after `delayMs` on
 * browsers without requestIdleCallback). Used to keep non-critical chrome
 * (cookie banner, chat FAB, marketing popups) off the initial paint / LCP
 * critical path.
 */
interface Props {
  children: ReactNode;
  /** Fallback delay for browsers without requestIdleCallback. Default 1500 ms. */
  delayMs?: number;
  /** requestIdleCallback timeout. Default 3000 ms. */
  timeoutMs?: number;
}

const DeferredMount = ({ children, delayMs = 1500, timeoutMs = 3000 }: Props) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    let handle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (typeof w.requestIdleCallback === "function") {
      handle = w.requestIdleCallback(() => setReady(true), { timeout: timeoutMs });
    } else {
      timer = setTimeout(() => setReady(true), delayMs);
    }
    return () => {
      if (handle !== undefined && typeof w.cancelIdleCallback === "function") {
        w.cancelIdleCallback(handle);
      }
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [delayMs, timeoutMs]);

  return ready ? <>{children}</> : null;
};

export default DeferredMount;