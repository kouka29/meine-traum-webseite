import { loadStripe, Stripe } from "@stripe/stripe-js";

type StripeEnv = "sandbox" | "live";

const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;
const environment: StripeEnv = clientToken?.startsWith("pk_test_") ? "sandbox" : "live";

let stripePromise: Promise<Stripe | null> | null = null;

/** Inject a preconnect/dns-prefetch for js.stripe.com on demand. */
function ensureStripePreconnect() {
  if (typeof document === "undefined") return;
  if (document.querySelector('link[data-stripe-preconnect="1"]')) return;
  const pre = document.createElement("link");
  pre.rel = "preconnect";
  pre.href = "https://js.stripe.com";
  pre.crossOrigin = "anonymous";
  pre.dataset.stripePreconnect = "1";
  document.head.appendChild(pre);
  const dns = document.createElement("link");
  dns.rel = "dns-prefetch";
  dns.href = "https://js.stripe.com";
  dns.dataset.stripePreconnect = "1";
  document.head.appendChild(dns);
}

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    if (!clientToken) {
      throw new Error("VITE_PAYMENTS_CLIENT_TOKEN is not set");
    }
    ensureStripePreconnect();
    stripePromise = loadStripe(clientToken);
  }
  return stripePromise;
}

export function getStripeEnvironment(): StripeEnv {
  return environment;
}

export function isStripeConfigured(): boolean {
  return Boolean(clientToken);
}
