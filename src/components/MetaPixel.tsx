import { useEffect } from "react";

const PIXEL_ID = "934396146253177";
const CONSENT_KEY = "mtw_cookie_consent";

const hasMarketingConsent = (): boolean => {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return false;
    return JSON.parse(stored)?.marketing === true;
  } catch {
    return false;
  }
};

const initializePixel = () => {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (w.fbq) return;
  if (document.querySelector('script[src*="fbevents.js"]')) return;

  // Standard Meta Pixel bootstrap (queues calls until script loads)
  /* eslint-disable */
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod
        ? n.callMethod.apply(n, arguments as any)
        : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode?.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  w.fbq("init", PIXEL_ID);
  w.fbq("track", "PageView");
};

const MetaPixel = () => {
  useEffect(() => {
    if (hasMarketingConsent()) initializePixel();

    const handleConsentUpdate = () => {
      if (hasMarketingConsent()) initializePixel();
    };

    window.addEventListener("cookieConsentUpdated", handleConsentUpdate);
    return () =>
      window.removeEventListener("cookieConsentUpdated", handleConsentUpdate);
  }, []);

  return null;
};

export default MetaPixel;