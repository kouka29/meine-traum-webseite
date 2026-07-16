// Zentrale Registry für persönliche Demo-Angebote.
// Ein Eintrag pro Kunde/Slug. Wird von /preise?demo=<slug> gelesen.

export type DemoMode = "kauf" | "miete";

export interface DemoOfferOption {
  coupon: string;           // Stripe-Coupon-Code (case-insensitiv)
  offerCode: string;        // Whitelist-Key in create-checkout (lowercase)
  price: string;            // hübsche Anzeige
  regular: string;          // durchgestrichener Regulärpreis
  discountedNumber: number; // numerisch (EUR)
  regularNumber: number;    // numerisch (EUR)
  note: string;
  priceId: string;
}

export interface DemoOffer {
  slug: string;
  firstName: string;
  plan: "pro";
  headline: string;
  sub: string;
  features: string[];
  miete: DemoOfferOption;
  kauf: DemoOfferOption;
}

export const DEMO_OFFERS: Record<string, DemoOffer> = {
  CBI: {
    slug: "CBI",
    firstName: "Christopher",
    plan: "pro",
    headline: "Pro-Website zum Preis von Starter",
    sub: "Volle Pro-Leistung — Sonderkondition nur für dich.",
    features: [
      "Bis zu 5 Seiten – Leistungen, Referenzen, Über uns, Kontakt",
      "Google Maps & Google Business vollständig eingerichtet",
      "Bei Google gefunden werden – wenn Kunden in Deiner Stadt suchen",
      "Fertig in ca. 2 Wochen – sorgfältig umgesetzt",
      "Hosting, Domain & SSL inklusive",
    ],
    miete: {
      coupon: "CBI-Y1",
      offerCode: "cbi-y1",
      price: "59 €/Monat",
      regular: "99 €/Monat",
      discountedNumber: 59,
      regularNumber: 99,
      note: "1. Jahr Starter-Preis · danach 99 €/Monat · monatlich kündbar",
      priceId: "pro_rent_monthly",
    },
    kauf: {
      coupon: "CBI-KAUF25",
      offerCode: "cbi-kauf25",
      price: "1.492,50 €",
      regular: "1.990 €",
      discountedNumber: 1492.5,
      regularNumber: 1990,
      note: "25 % Rabatt · einmalig · netto",
      priceId: "pro_purchase_deposit",
    },
  },
  ZAK: {
    slug: "ZAK",
    firstName: "Ahmed",
    plan: "pro",
    headline: "Pro-Website zum Preis von Starter",
    sub: "Volle Pro-Leistung — Sonderkondition nur für dich.",
    features: [
      "Bis zu 5 Seiten – Leistungen, Referenzen, Über uns, Kontakt",
      "Google Maps & Google Business vollständig eingerichtet",
      "Bei Google gefunden werden – wenn Kunden in Deiner Stadt suchen",
      "Fertig in ca. 2 Wochen – sorgfältig umgesetzt",
      "Hosting, Domain & SSL inklusive",
    ],
    miete: {
      coupon: "MTW-Y1",
      offerCode: "mtw-y1",
      price: "59 €/Monat",
      regular: "99 €/Monat",
      discountedNumber: 59,
      regularNumber: 99,
      note: "1. Jahr Starter-Preis · danach 99 €/Monat · monatlich kündbar",
      priceId: "pro_rent_monthly",
    },
    kauf: {
      coupon: "MTW-KAUF25",
      offerCode: "mtw-kauf25",
      price: "1.492,50 €",
      regular: "1.990 €",
      discountedNumber: 1492.5,
      regularNumber: 1990,
      note: "25 % Rabatt · einmalig · netto",
      priceId: "pro_purchase_deposit",
    },
  },
};

export function getDemoOffer(slug?: string | null): DemoOffer | null {
  if (!slug) return null;
  const key = slug.trim().toUpperCase();
  return DEMO_OFFERS[key] ?? null;
}

/**
 * Legacy: alte Links mit ?offer=cbi-y1 / cbi-kauf25 werden auf CBI + Mode
 * gemappt, damit das neue Popup auch dafür erscheint.
 */
export function resolveLegacyOffer(
  offer?: string | null,
): { demoSlug: string; mode: DemoMode } | null {
  if (!offer) return null;
  const key = offer.trim().toLowerCase();
  if (key === "cbi-y1") return { demoSlug: "CBI", mode: "miete" };
  if (key === "cbi-kauf25") return { demoSlug: "CBI", mode: "kauf" };
  return null;
}

/**
 * Baut aus einem DemoOffer die pro-Modus Anzeigewerte, die der
 * CheckoutFunnel via `activeOfferOverride` konsumiert.
 */
export function buildFunnelOfferOverride(offer: DemoOffer) {
  return {
    plan: offer.plan,
    miete: {
      regular: offer.miete.regularNumber,
      discounted: offer.miete.discountedNumber,
      note: offer.miete.note,
      label: "1. Jahr, danach regulärer Preis",
    },
    kauf: {
      regular: offer.kauf.regularNumber,
      discounted: offer.kauf.discountedNumber,
      note: offer.kauf.note,
      label: "−25 % Angebotspreis",
    },
  };
}
