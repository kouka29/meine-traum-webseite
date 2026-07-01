import { useEffect, useRef } from "react";

type Options = {
  enabled: boolean;
  pathname: string;
  onTrigger: (opener?: string) => void;
};

const SESSION_FLAG = "mtw_chat_triggered_v1";

const isMobile = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

const PRICING_ROUTES = [/^\/preise$/, /^\/webdesign-preise$/, /\/preise$/];

/**
 * Öffnet das Chat-Widget automatisch bei Exit-Intent, Scroll-Depth, Idle
 * oder auf Preis-Seiten — einmal pro Session.
 */
export function useChatTriggers({ enabled, pathname, onTrigger }: Options) {
  const triggered = useRef<boolean>(
    typeof window !== "undefined" && sessionStorage.getItem(SESSION_FLAG) === "1",
  );
  const mountedAt = useRef<number>(Date.now());

  useEffect(() => {
    if (!enabled || triggered.current) return;

    const fire = (opener: string) => {
      if (triggered.current) return;
      triggered.current = true;
      try {
        sessionStorage.setItem(SESSION_FLAG, "1");
      } catch {
        /* ignore */
      }
      onTrigger(opener);
    };

    const mobile = isMobile();
    const cleanups: Array<() => void> = [];

    // Exit-Intent (Desktop only)
    if (!mobile) {
      const onMouseOut = (e: MouseEvent) => {
        if (e.clientY > 0) return;
        if (Date.now() - mountedAt.current < 15_000) return;
        fire("Warte kurz 👋 Hast du noch eine Frage bevor du gehst?");
      };
      document.addEventListener("mouseout", onMouseOut);
      cleanups.push(() => document.removeEventListener("mouseout", onMouseOut));
    }

    // Scroll-Depth 70%
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total <= 0) return;
      const pct = scrolled / total;
      if (pct >= 0.7 && Date.now() - mountedAt.current > 30_000) {
        fire("Sieht so aus als würde dich das Thema interessieren — soll ich dir zeigen wie wir starten würden?");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    // Idle-Trigger (45 s) auf Preis-/Portfolio-/Leistungs-Seiten
    const isKeyPage =
      PRICING_ROUTES.some((r) => r.test(pathname)) ||
      pathname.startsWith("/portfolio") ||
      pathname.startsWith("/leistungen") ||
      pathname.startsWith("/handwerker/leistungen");
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    const resetIdle = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        fire("Kann ich dir bei der Auswahl helfen?");
      }, 45_000);
    };
    if (isKeyPage) {
      const events = ["mousemove", "keydown", "scroll", "touchstart"];
      events.forEach((ev) => window.addEventListener(ev, resetIdle, { passive: true }));
      resetIdle();
      cleanups.push(() => {
        events.forEach((ev) => window.removeEventListener(ev, resetIdle));
        if (idleTimer) clearTimeout(idleTimer);
      });
    }

    // Preis-Seiten Timer (20 s)
    if (PRICING_ROUTES.some((r) => r.test(pathname))) {
      const t = setTimeout(() => {
        fire("Fragen zum Paket? Ich erklär's dir kurz.");
      }, 20_000);
      cleanups.push(() => clearTimeout(t));
    }

    return () => cleanups.forEach((fn) => fn());
  }, [enabled, pathname, onTrigger]);
}