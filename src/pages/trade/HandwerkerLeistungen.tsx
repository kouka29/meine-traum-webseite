import { useState, FormEvent } from "react";
import { Check, Phone } from "lucide-react";
import { z } from "zod";
import TradeBreadcrumbs from "@/components/TradeBreadcrumbs";

const services = [
  { emoji: "🔍", title: "Google-Optimierung (SEO)", desc: "Damit Kunden Dich finden wenn sie '[Beruf] [Stadt]' googeln — nicht Deinen Konkurrenten.", items: ["Keyword-Analyse", "Google Business Einrichtung", "Lokale SEO-Optimierung"] },
  { emoji: "🎨", title: "Professionelles Webdesign", desc: "Eine Website die Vertrauen aufbaut — schon bevor der erste Anruf kommt.", items: ["Individuelles Design", "Mobil-optimiert", "Schnelle Ladezeit"] },
  { emoji: "✍️", title: "Texte die verkaufen", desc: "Wir schreiben alle Texte für Dich — in der Sprache Deiner Kunden.", items: ["Alle Seiten-Texte", "SEO-optimiert", "Auf Dein Gewerk angepasst"] },
  { emoji: "🔧", title: "Hosting & Technik", desc: "Du kümmerst Dich um nichts. Wir übernehmen alles im Hintergrund.", items: ["Hosting", "Domain", "SSL-Zertifikat", "Regelmäßige Updates"] },
  { emoji: "📩", title: "Anfragen-System", desc: "Damit Kunden Dich jederzeit erreichen können — auch um 22 Uhr.", items: ["Kontaktformular", "WhatsApp-Button", "Click-to-Call", "Google Maps"] },
  { emoji: "📊", title: "Monatliche Betreuung", desc: "Deine Website bleibt aktuell. Wir passen an wenn sich was ändert.", items: ["Änderungen", "Updates", "Support per WhatsApp"] },
];

const miniSchema = z.object({
  vorname: z.string().trim().min(1, "Bitte Vornamen angeben").max(80),
  telefon: z.string().trim().min(5, "Bitte Telefonnummer angeben").max(30),
});

const MiniForm = () => {
  const [form, setForm] = useState({ vorname: "", telefon: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const r = miniSchema.safeParse(form);
    if (!r.success) {
      const fe: Record<string, string> = {};
      r.error.issues.forEach((i) => (fe[i.path[0] as string] = i.message));
      setErrors(fe);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 400);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center flex flex-col items-center gap-4 shadow-card">
        <Check size={24} style={{ color: "var(--success)" }} aria-hidden={true} focusable={false} />
        <p className="font-semibold text-foreground">✅ Super! Ich melde mich innerhalb von 2 Stunden bei Dir.</p>
        <a href="tel:+4961313076498" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline" style={{ color: "var(--brand-purple)" }}>
          <Phone size={16} aria-hidden={true} focusable={false} /> 06131 3076498
        </a>
      </div>
    );
  }

  const ic = (f: string) => `w-full rounded-xl border px-4 py-3 text-sm bg-background outline-none focus:ring-2 focus:ring-[#5B5FEF]/30 ${errors[f] ? "border-red-500" : "border-border"}`;

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 sm:p-8 flex flex-col gap-4 shadow-card max-w-md mx-auto">
      <h3 className="text-lg font-bold text-foreground">Interesse? Kostenlose Vorschau anfordern</h3>
      <div>
        <input type="text" placeholder="Dein Vorname" value={form.vorname} onChange={(e) => setForm({ ...form, vorname: e.target.value })} className={ic("vorname")} />
        {errors.vorname && <p className="text-xs text-red-500 mt-1">{errors.vorname}</p>}
      </div>
      <div>
        <input type="tel" placeholder="0151 234 56789" value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })} className={ic("telefon")} />
        {errors.telefon && <p className="text-xs text-red-500 mt-1">{errors.telefon}</p>}
      </div>
      <button type="submit" disabled={loading} className="rounded-xl py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60" style={{ background: "var(--brand-purple)" }}>
        {loading ? "Wird gesendet…" : "Vorschau anfordern →"}
      </button>
    </form>
  );
};

const HandwerkerLeistungen = () => (
  <main id="main-content" className="pt-[110px]">
    <section className="py-16 md:py-20" style={{ background: "var(--dark-bg)" }}>
      <div className="container-narrow px-4 max-w-6xl mx-auto">
        <TradeBreadcrumbs />
        <div className="text-center mt-8 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Was wir für Deinen Betrieb tun</h1>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>Kein Technik-Kram. Klare Leistungen. Echte Ergebnisse.</p>
        </div>
      </div>
    </section>

    <section className="py-20" style={{ background: "var(--light-bg)" }}>
      <div className="container-narrow px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {services.map((s) => (
            <div key={s.title} className="rounded-2xl bg-white p-7 shadow-card flex flex-col gap-3">
              <div className="text-3xl">{s.emoji}</div>
              <h3 className="text-base font-bold text-foreground">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              <div className="pt-2 border-t border-border mt-2">
                <p className="text-xs font-semibold text-foreground mb-1">Enthalten:</p>
                <p className="text-xs text-muted-foreground">{s.items.join(" · ")}</p>
              </div>
            </div>
          ))}
        </div>
        <MiniForm />
      </div>
    </section>
  </main>
);

export default HandwerkerLeistungen;
