import { Phone, MessageCircle, Mail } from "lucide-react";
import TradeBreadcrumbs from "@/components/TradeBreadcrumbs";
import HandwerkerLeadForm from "@/components/trade/HandwerkerLeadForm";

const steps = [
  { title: "Du meldest Dich", text: "Formular, Anruf oder WhatsApp" },
  { title: "Ich melde mich in 2 Stunden", text: "Mo–Fr 9–18 Uhr" },
  { title: "Deine Vorschau in 48 Stunden", text: "Kostenlos, individuell" },
];

const HandwerkerKontakt = () => (
  <main id="main-content" className="pt-[110px]">
    <section className="py-16 md:py-20" style={{ background: "var(--dark-bg)" }}>
      <div className="container-narrow px-4 max-w-6xl mx-auto">
        <TradeBreadcrumbs />
        <div className="text-center mt-8 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Ruf an oder schreib uns — wir melden uns heute noch</h1>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>
            Kein Verkaufsgespräch. Kein Druck. Nur eine kurze Unterhaltung über Deine Website.
          </p>
        </div>
      </div>
    </section>

    <section className="py-20" style={{ background: "var(--dark-bg)" }}>
      <div className="container-narrow px-4 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* LEFT */}
          <div className="rounded-2xl p-8 flex flex-col gap-6" style={{ background: "var(--dark-card)" }}>
            <h2 className="text-xl font-bold text-white">Lieber direkt?</h2>

            <div>
              <a href="tel:+4961313076498" className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-white hover:underline">
                <Phone size={28} aria-hidden={true} focusable={false} /> 06131 30 764 98
              </a>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Mo–Fr 9–18 Uhr — ich gehe ran</p>
            </div>

            <a href="https://wa.me/+4961313076498" className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110" style={{ background: "#25D366" }}>
              <MessageCircle size={18} aria-hidden={true} focusable={false} /> WhatsApp schreiben →
            </a>

            <a href="mailto:info@meine-traum-webseite.de" className="inline-flex items-center gap-2 text-sm text-white hover:underline">
              <Mail size={16} aria-hidden={true} focusable={false} /> info@meine-traum-webseite.de
            </a>

            <div className="border-t border-white/10 pt-6">
              <p className="text-sm font-semibold text-white mb-4">So geht's weiter:</p>
              <ol className="space-y-3">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex items-start gap-3">
                    <span className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "var(--brand-purple)" }}>{i + 1}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{s.title}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <p className="text-sm" style={{ color: "var(--text-muted)" }}>⭐⭐⭐⭐⭐ 12 Handwerksbetriebe vertrauen uns bereits</p>
          </div>

          {/* RIGHT */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Kostenlose Vorschau anfordern</h2>
            <HandwerkerLeadForm withMessage />
          </div>
        </div>
      </div>
    </section>
  </main>
);

export default HandwerkerKontakt;
