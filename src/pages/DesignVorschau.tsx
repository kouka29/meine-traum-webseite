const PAIN_POINTS = [
  { icon: "⛈️", title: "Sturmschäden gehen an die Konkurrenz", description: "Nach jedem Sturm suchen hunderte Kunden 'Dachdecker [Stadt]'. Wer nicht erscheint verliert diese Aufträge jedes Mal." },
  { icon: "📅", title: "Saisonalität überbrücken", description: "Winter = weniger Aufträge? Eine starke Online-Präsenz bringt Anfragen das ganze Jahr — nicht nur im Sommer." },
  { icon: "💰", title: "Große Aufträge brauchen Vertrauen", description: "Eine Dachsanierung kostet 20.000€+. Kunden kaufen nur beim Betrieb dem sie vertrauen — und Vertrauen beginnt online." },
  { icon: "☀️", title: "Photovoltaik-Nachfrage nutzen", description: "PV-Anlagen auf Dächern — riesige Nachfrage. Wer online sichtbar ist gewinnt diese lukrativen Aufträge." },
];

const SectionHeader = ({ option, label }: { option: string; label: string }) => (
  <div className="mb-6">
    <div className="flex items-baseline gap-3">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">{option}</span>
      <span className="text-sm font-medium text-white/70">{label}</span>
    </div>
    <div className="h-px w-full bg-white/10 mt-3" />
  </div>
);

const SectionTitle = () => (
  <div className="text-center mb-10">
    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Kommt Dir das bekannt vor?</h2>
  </div>
);

// ---- OPTION 1: Dark Card on Dark ----
const Option1 = () => (
  <div className="rounded-3xl p-8 md:p-12" style={{ background: "var(--dark-bg)" }}>
    <SectionTitle />
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {PAIN_POINTS.map((p) => (
        <div
          key={p.title}
          className="rounded-2xl bg-white/[0.04] border p-6 flex flex-col gap-3 transition duration-300 hover:-translate-y-0.5"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(91,95,239,0.3)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
        >
          <div className="text-3xl opacity-90">{p.icon}</div>
          <h3 className="text-base font-semibold" style={{ color: "#FFFFFF" }}>{p.title}</h3>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{p.description}</p>
        </div>
      ))}
    </div>
  </div>
);

// ---- OPTION 2: White Card with Dark Text ----
const Option2 = () => (
  <div className="rounded-3xl p-8 md:p-12" style={{ background: "var(--dark-bg)" }}>
    <SectionTitle />
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {PAIN_POINTS.map((p) => (
        <div
          key={p.title}
          className="rounded-2xl p-6 flex flex-col gap-3 shadow-lg transition duration-300 hover:-translate-y-0.5"
          style={{ background: "#FFFFFF", boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}
        >
          <div className="text-3xl">{p.icon}</div>
          <h3 className="text-base font-semibold" style={{ color: "#0A0A1F" }}>{p.title}</h3>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(10,10,31,0.65)" }}>{p.description}</p>
        </div>
      ))}
    </div>
  </div>
);

// ---- OPTION 3: Outlined Card with top accent ----
const Option3 = () => (
  <div className="rounded-3xl p-8 md:p-12" style={{ background: "var(--dark-bg)" }}>
    <SectionTitle />
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {PAIN_POINTS.map((p) => (
        <div
          key={p.title}
          className="relative rounded-2xl border p-6 flex flex-col gap-3 bg-transparent transition duration-300 hover:-translate-y-0.5"
          style={{ borderColor: "rgba(255,255,255,0.12)" }}
        >
          <span className="absolute top-0 left-6 right-6 h-[3px] rounded-b-sm" style={{ background: "var(--brand-purple)" }} />
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl"
            style={{ background: "rgba(91,95,239,0.1)" }}
          >
            {p.icon}
          </div>
          <h3 className="text-base font-semibold" style={{ color: "#FFFFFF" }}>{p.title}</h3>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.60)" }}>{p.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default function DesignVorschau() {
  return (
    <main className="min-h-screen px-4 py-16 md:py-20" style={{ background: "var(--dark-bg)" }}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-14 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--brand-purple)" }}>
            Internal Preview
          </span>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">Design-Vorschau: Card-Varianten</h1>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto">
            Drei Stiloptionen für die „Kommt Dir das bekannt vor?"-Karten. Wähle eine Variante — diese Seite ist temporär und nicht in der Navigation verlinkt.
          </p>
        </header>

        <div className="space-y-16">
          <section>
            <SectionHeader option="Option 1" label="Dark on Dark · subtile Glas-Karten auf dunklem Hintergrund" />
            <Option1 />
          </section>

          <section>
            <SectionHeader option="Option 2" label="White on Dark · hoher Kontrast mit weißen Karten" />
            <Option2 />
          </section>

          <section>
            <SectionHeader option="Option 3" label="Outlined · transparent mit lila Top-Akzent" />
            <Option3 />
          </section>
        </div>
      </div>
    </main>
  );
}