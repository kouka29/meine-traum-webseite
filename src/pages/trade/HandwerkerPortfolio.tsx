import { useState } from "react";
import { Link } from "react-router-dom";
import TradeBreadcrumbs from "@/components/TradeBreadcrumbs";

const projects = [
  { trade: "Elektriker", emoji: "⚡", name: "Elektro Schmidt", city: "Mainz", result: "+4x Anfragen in 3 Monaten" },
  { trade: "Maler", emoji: "🎨", name: "Malerbetrieb Kraft", city: "Wiesbaden", result: "+180% mehr Anfragen" },
  { trade: "Sanitär", emoji: "🔧", name: "Sanitär Müller", city: "Frankfurt", result: "Top 3 bei Google" },
  { trade: "Dachdecker", emoji: "🏠", name: "Dach & Trauf GmbH", city: "Darmstadt", result: "15 Anfragen nach Sturm" },
  { trade: "Elektriker", emoji: "⚡", name: "Blitz Elektro", city: "Mannheim", result: "In 8 Tagen live" },
  { trade: "Sonstige", emoji: "🪵", name: "Schreinerei Weber", city: "Heidelberg", result: "+6 Aufträge/Monat" },
];

const tabs = ["Alle", "Elektriker", "Maler", "Sanitär", "Dachdecker", "Sonstige"];

const HandwerkerPortfolio = () => {
  const [active, setActive] = useState("Alle");
  const filtered = active === "Alle" ? projects : projects.filter((p) => p.trade === active);

  return (
    <main className="pt-[110px] pb-20" style={{ background: "var(--light-bg)" }}>
      <div className="container-narrow px-4 max-w-6xl mx-auto">
        <TradeBreadcrumbs />
        <div className="text-center mt-8 mb-10 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Websites die wir für Handwerksbetriebe gebaut haben</h1>
          <p className="text-muted-foreground text-lg">Echte Projekte. Echte Ergebnisse.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10 border-b border-border">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className="px-4 py-3 text-sm font-semibold border-b-2 transition"
              style={active === t ? { color: "var(--brand-purple)", borderColor: "var(--brand-purple)" } : { color: "#6b7280", borderColor: "transparent" }}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filtered.map((p) => (
            <div key={p.name} className="rounded-2xl bg-white p-5 shadow-card flex flex-col gap-3">
              <div className="aspect-[16/10] rounded-xl flex items-center justify-center text-6xl" style={{ background: "linear-gradient(135deg, var(--brand-purple), #3B5BDB)" }}>
                <span className="opacity-90">{p.emoji}</span>
              </div>
              <span className="inline-block self-start text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full text-white" style={{ background: "var(--brand-purple)" }}>
                {p.emoji} {p.trade}
              </span>
              <div>
                <h3 className="text-base font-bold text-foreground">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.city}</p>
              </div>
              <span className="inline-block self-start text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(16,185,129,0.15)", color: "var(--success)" }}>
                {p.result}
              </span>
              <a href="#" className="mt-2 text-center rounded-xl py-2.5 text-sm font-semibold border transition hover:bg-muted" style={{ borderColor: "var(--brand-purple)", color: "var(--brand-purple)" }}>
                Projekt ansehen
              </a>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-5">Du willst auch so eine Website?</h3>
          <Link to="/handwerker/kontakt" className="inline-block rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110" style={{ background: "var(--brand-purple)" }}>
            Kostenlose Vorschau anfordern →
          </Link>
        </div>
      </div>
    </main>
  );
};

export default HandwerkerPortfolio;
