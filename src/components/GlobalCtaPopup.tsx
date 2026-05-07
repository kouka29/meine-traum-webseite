import { useEffect, useState } from "react";
import PricingLeadPopup from "@/components/PricingLeadPopup";

/**
 * Global CTA popup: any <a href="#termin-buchen"> anywhere in the app
 * opens the PricingLeadPopup (the "Fast geschafft" / Demo-Anfrage popup).
 * Existing funnels (/kontakt, /kostenlose-vorschau, tel:, internal Router links)
 * remain untouched.
 */
const GlobalCtaPopup = () => {
  const [open, setOpen] = useState(false);
  const [badge, setBadge] = useState("Kostenlose Demo");

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (href === "#termin-buchen") {
        e.preventDefault();
        const customBadge = anchor.getAttribute("data-popup-badge");
        setBadge(customBadge || "Kostenlose Demo");
        setOpen(true);
      }
    };
    document.addEventListener("click", onClick);

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { badge?: string } | undefined;
      setBadge(detail?.badge || "Kostenlose Demo");
      setOpen(true);
    };
    window.addEventListener("open-lead-modal", handler as EventListener);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("open-lead-modal", handler as EventListener);
    };
  }, []);

  return <PricingLeadPopup open={open} badge={badge} onClose={() => setOpen(false)} />;
};

export default GlobalCtaPopup;