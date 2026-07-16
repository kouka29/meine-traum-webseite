import { useEffect } from "react";
import { X, Check, ArrowRight, Star } from "lucide-react";
import type { DemoOffer, DemoMode } from "@/config/demoOffers";

interface Props {
  open: boolean;
  offer: DemoOffer | null;
  onClose: () => void;
  onSelect: (mode: DemoMode) => void;
}

/**
 * Zentrales Angebots-Popup für /preise?demo=<slug>.
 * Zeigt beide Optionen (Miete/Kauf) bereits rabattiert.
 */
export default function DemoOfferPopup({ open, offer, onClose, onSelect }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !offer) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-offer-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 bg-[rgba(15,12,41,0.6)] backdrop-blur-md overflow-y-auto"
    >
      <div
        className="relative w-full max-w-3xl bg-background rounded-2xl shadow-[0_30px_80px_rgba(15,12,41,0.35)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto"
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-background/80 hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div
          className="px-6 sm:px-10 pt-8 pb-6 text-center"
          style={{ background: "linear-gradient(135deg, #F5F4FF 0%, #FFFFFF 100%)" }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo.png" alt="Meine Traum-Website" className="h-8 w-auto" />
          </div>
          <p className="text-xs font-bold tracking-[0.18em] text-primary uppercase mb-2">
            Dein persönliches Angebot, {offer.firstName}
          </p>
          <h2
            id="demo-offer-title"
            className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground leading-tight tracking-tight mb-2"
          >
            {offer.headline}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            {offer.sub}
          </p>
        </div>

        {/* Features */}
        <div className="px-6 sm:px-10 pt-5 pb-4 border-b border-border/60">
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
            {offer.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-foreground/85">
                <Check size={16} className="text-primary shrink-0 mt-0.5" aria-hidden />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Options */}
        <div className="px-6 sm:px-10 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* MIETE */}
          <div className="relative rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/5 to-background p-5 flex flex-col">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-label bg-primary text-primary-foreground flex items-center gap-1 whitespace-nowrap">
              <Star size={14} aria-hidden /> Empfohlen
            </span>
            <p className="text-xs font-bold tracking-widest text-primary uppercase mb-2 mt-1">
              Monatliche Miete
            </p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-sm text-muted-foreground line-through">
                {offer.miete.regular}
              </span>
            </div>
            <p className="font-heading text-3xl font-extrabold text-primary leading-none mb-2">
              {offer.miete.price}
            </p>
            <p className="text-xs text-muted-foreground mb-5 leading-snug">
              {offer.miete.note}
            </p>
            <button
              type="button"
              onClick={() => onSelect("miete")}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm px-4 py-3 transition-colors"
            >
              Miete sichern – {offer.miete.price}
              <ArrowRight size={16} aria-hidden />
            </button>
          </div>

          {/* KAUF */}
          <div className="relative rounded-2xl border border-border bg-background p-5 flex flex-col">
            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-2 mt-1">
              Einmalkauf
            </p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-sm text-muted-foreground line-through">
                {offer.kauf.regular}
              </span>
            </div>
            <p className="font-heading text-3xl font-extrabold text-foreground leading-none mb-2">
              {offer.kauf.price}
            </p>
            <p className="text-xs text-muted-foreground mb-5 leading-snug">
              {offer.kauf.note}
            </p>
            <button
              type="button"
              onClick={() => onSelect("kauf")}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary text-primary hover:bg-primary/10 font-semibold text-sm px-4 py-3 transition-colors"
            >
              Kaufen – {offer.kauf.price}
              <ArrowRight size={16} aria-hidden />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-10 py-4 border-t border-border/60 bg-muted/30 text-center">
          <p className="text-xs text-muted-foreground">
            Alle Preise netto zzgl. 19 % MwSt. · 🛡️ Website in 7 Tagen live
          </p>
        </div>
      </div>
    </div>
  );
}
