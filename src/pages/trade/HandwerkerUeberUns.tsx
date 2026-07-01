import { Link } from "react-router-dom";
import TradeBreadcrumbs from "@/components/TradeBreadcrumbs";
import TestimonialCard from "@/components/trade/TestimonialCard";
import EmojiIcon from "@/lib/emojiToIcon";

const values = [
  { emoji: "🔨", title: "Ehrlich wie Handwerk", text: "Kein Bullshit. Kein Fachchinesisch. Klare Ansagen was geht und was nicht." },
  { emoji: "⚡", title: "Schnell wie auf der Baustelle", text: "Vorschau in 48 Stunden. Live in 7–14 Tagen. Kein monatelanges Projekt." },
  { emoji: "🎯", title: "Ergebnis zählt", text: "Uns interessiert nicht ob die Website schön ist. Uns interessiert ob sie Aufträge bringt." },
];

const stats = [
  { value: "+150", label: "Betriebe betreut" },
  { value: "48h", label: "Erste Vorschau fertig" },
  { value: "98%", label: "Weiterempfehlungsrate" },
  { value: "7 Tage", label: "Schnellste Live-Schaltung" },
];

const testimonials = [
  { stars: 5, badge: "4X MEHR ANFRAGEN", badgeColor: "#10B981", quote: "Vorher hatte ich kaum Anfragen über die Website. Seit dem Relaunch melde ich mich bei Kunden — nicht umgekehrt.", name: "Michael S.", business: "Elektrobetrieb, Mainz" },
  { stars: 5, badge: "IN 10 TAGEN LIVE", badgeColor: "#3B82F6", quote: "Die haben alles übernommen. Ich musste nur kurz Infos geben — eine Woche später war meine neue Seite online.", name: "Klaus B.", business: "Malerbetrieb, Wiesbaden" },
  { stars: 5, badge: "TOP 3 BEI GOOGLE", badgeColor: "#5B5FEF", quote: "Endlich findet man mich bei Google. Letzte Woche 3 neue Aufträge über die Website — das gab es vorher nie.", name: "Andrea T.", business: "Sanitärbetrieb, Frankfurt" },
];

const HandwerkerUeberUns = () => (
  <main id="main-content" className="pt-[110px]">
    <section className="py-16 md:py-20" style={{ background: "var(--dark-bg)" }}>
      <div className="container-narrow px-4 max-w-6xl mx-auto">
        <TradeBreadcrumbs />
        <div className="text-center mt-8 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">Wir bauen Websites für Menschen die anpacken</h1>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>
            Kein großes Agenturbüro. Kein Fachchinesisch. Nur ehrliche Arbeit — wie bei Euch.
          </p>
        </div>
      </div>
    </section>

    <section className="py-20" style={{ background: "var(--light-bg)" }}>
      <div className="container-narrow px-4 max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl text-3xl font-bold text-foreground mb-5">Warum wir uns auf Handwerksbetriebe spezialisiert haben</h2>
          <p className="text-muted-foreground leading-relaxed">
            Wir haben festgestellt: Die meisten Web-Agenturen reden viel und liefern wenig. Handwerker brauchen keine 50-seitigen Konzepte — sie brauchen eine Website die funktioniert. Die das Telefon klingeln lässt. Die Google-Rankings bringt. Genau das machen wir.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl bg-white p-7 shadow-card">
              <div className="text-3xl mb-3">{v.emoji}</div>
              <h3 className="text-base font-bold text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: "var(--brand-purple)" }}>{s.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => <TestimonialCard key={t.name} {...t} />)}
        </div>
      </div>
    </section>

    <section className="py-16" style={{ background: "var(--dark-bg)" }}>
      <div className="container-narrow px-4 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl text-3xl font-bold text-white mb-6">Überzeug Dich selbst — kostenlos und unverbindlich</h2>
        <Link to="/handwerker/kontakt" className="inline-block rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110" style={{ background: "var(--brand-purple)" }}>
          Kostenlose Vorschau anfordern →
        </Link>
      </div>
    </section>
  </main>
);

export default HandwerkerUeberUns;
