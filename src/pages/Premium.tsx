import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Check,
  X,
  TrendingUp,
  ShieldCheck,
  Zap,
  ChevronDown,
  Phone,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const BRAND = "hsl(250 56% 58%)"; // brand purple, slightly brighter on dark

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const Eyebrow = ({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) => (
  <div
    className={`mb-4 text-[10px] font-sans uppercase tracking-[0.3em] ${
      light ? "text-[color:var(--mtw-brand)]/70" : "text-white/65"
    }`}
  >
    {children}
  </div>
);

const ChessKing = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 140"
    fill="currentColor"
    className={className}
    aria-hidden={true}
    focusable={false}
  >
    <rect x="42" y="0" width="16" height="16" />
    <rect x="35" y="8" width="30" height="8" />
    <rect x="38" y="20" width="24" height="12" />
    <ellipse cx="50" cy="48" rx="18" ry="16" />
    <path d="M32 64 Q30 100 20 120 L80 120 Q70 100 68 64 Z" />
    <rect x="15" y="120" width="70" height="12" rx="6" />
  </svg>
);

const DotPattern = () => (
  <svg
    className="absolute bottom-6 right-6 h-12 w-12 text-[color:var(--mtw-brand)]/15"
    viewBox="0 0 40 40"
    aria-hidden={true}
    focusable={false}
  >
    {[0, 1, 2].map((r) =>
      [0, 1, 2].map((c) => (
        <circle key={`${r}-${c}`} cx={5 + c * 14} cy={5 + r * 14} r="1.6" fill="currentColor" />
      ))
    )}
  </svg>
);

const Premium = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    website: "",
    email: "",
    phone: "",
    message: "",
    source: "",
  });
  const [errors, setErrors] = useState<{ name?: boolean; email?: boolean; message?: boolean }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.email.trim()) newErrors.email = true;
    if (!formData.message.trim()) newErrors.message = true;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    console.log("Premium application:", formData);
    setSubmitted(true);
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <main
      id="main-content"
      className="premium-page min-h-screen text-white"
      style={
        {
          backgroundColor: "#08081A",
          ["--mtw-brand" as string]: BRAND,
        } as React.CSSProperties
      }
    >
      <style>{`
        .premium-page h1, .premium-page h2, .premium-page h3 {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 400;
          letter-spacing: -0.01em;
        }
        .premium-page .serif-num {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 400;
        }
        .premium-page .card-noise::before {
          content: "";
          position: absolute; inset: 0;
          pointer-events: none;
          opacity: 0.03;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>");
        }
      `}</style>

      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden border-b border-[color:var(--mtw-brand)]/15 px-6 md:px-12">
        <ChessKing className="pointer-events-none absolute right-6 top-1/2 hidden h-[460px] w-[350px] -translate-y-1/2 text-[color:var(--mtw-brand)] opacity-[0.04] md:block" />

        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center">
          <motion.div {...fadeUp} className="max-w-3xl">
            <Eyebrow>Limitiert auf 5 Projekte</Eyebrow>

            <h1
              className="text-white leading-[1.05]"
              style={{ fontSize: "clamp(56px, 7vw, 96px)" }}
            >
              Webseiten, die Ihr Unternehmen auf ein neues{" "}
              <em className="italic text-[color:var(--mtw-brand)]">Level</em>{" "}
              bringen.
            </h1>

            <p className="mt-10 max-w-[480px] text-base leading-[1.9] text-white/75">
              Wir entwickeln digitale Präsenzen für Unternehmen, die nicht nach
              Kompromissen suchen — sondern nach Ergebnissen.
            </p>

            <div className="mt-12">
              <a
                href="#bewerbung"
                className="group inline-flex items-center gap-3 rounded-none border border-[color:var(--mtw-brand)]/50 px-8 py-3 text-sm uppercase tracking-[0.2em] text-[color:var(--mtw-brand)] transition-all duration-300 hover:bg-[color:var(--mtw-brand)] hover:text-white"
              >
                Projekt anfragen
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden={true}
                  focusable={false}
                />
              </a>
            </div>
          </motion.div>
        </div>

        <ChevronDown
          className="absolute bottom-8 left-1/2 h-5 w-5 -translate-x-1/2 animate-bounce text-[color:var(--mtw-brand)]/40"
          aria-hidden={true}
          focusable={false}
        />
      </section>

      {/* FÜR WEN — LIGHT */}
      <section className="bg-[#F0EFFF] px-6 py-24 text-[#0A0A1F] md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="grid gap-16 md:grid-cols-2 md:gap-20">
            <div>
              <Eyebrow light>Wir arbeiten selektiv</Eyebrow>
              <h2
                className="leading-[1.1] text-[#0A0A1F]"
                style={{ fontSize: "clamp(36px, 4.5vw, 56px)" }}
              >
                Für wen wir{" "}
                <em className="italic text-[color:var(--mtw-brand)]">arbeiten</em>
              </h2>
              <p className="mt-8 max-w-md text-base leading-[1.9] text-[#0A0A1F]">
                Wir arbeiten nicht mit jedem. Unsere Kapazität ist bewusst
                begrenzt — damit jedes Projekt die Aufmerksamkeit bekommt, die
                es verdient.
              </p>
            </div>
            <div className="space-y-12">
              <div>
                <div className="mb-5 text-[10px] uppercase tracking-[0.3em] text-[color:var(--mtw-brand)]/60">
                  Das sind unsere Kunden
                </div>
                <ul className="space-y-4">
                  {[
                    "Unternehmen mit klaren Wachstumszielen",
                    "Marken, die online als Marktführer wahrgenommen werden wollen",
                    "Gründer und Geschäftsführer, die Qualität über Preis stellen",
                    "Betriebe, die eine langfristige digitale Partnerschaft suchen",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[#0A0A1F]">
                      <Check
                        className="mt-1 h-4 w-4 flex-shrink-0 text-[color:var(--mtw-brand)]"
                        aria-hidden={true}
                        focusable={false}
                      />
                      <span className="text-base leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-5 text-[10px] uppercase tracking-[0.3em] text-[#0A0A1F]/45">
                  Das sind nicht unsere Kunden
                </div>
                <ul className="space-y-4">
                  {[
                    "Wer hauptsächlich nach dem günstigsten Anbieter sucht",
                    "Wer eine Webseite in 3 Tagen braucht",
                    "Wer keine klare Vision für sein Unternehmen hat",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[#0A0A1F]/45">
                      <X
                        className="mt-1 h-4 w-4 flex-shrink-0"
                        aria-hidden={true}
                        focusable={false}
                      />
                      <span className="text-base leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ERGEBNISSE */}
      <section className="bg-[#08081A] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="max-w-2xl">
            <Eyebrow>Ergebnisse statt Versprechen</Eyebrow>
            <h2
              className="leading-[1.1] text-white"
              style={{ fontSize: "clamp(36px, 4.5vw, 56px)" }}
            >
              Was wirklich{" "}
              <em className="italic text-[color:var(--mtw-brand)]">entsteht</em>
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              {
                n: "01",
                Icon: TrendingUp,
                title: "Mehr qualifizierte Anfragen",
                body:
                  "Keine Website die nur gut aussieht. Jede Seite ist strategisch aufgebaut, um genau die Kunden anzuziehen, die zu Ihnen passen.",
              },
              {
                n: "02",
                Icon: ShieldCheck,
                title: "Positionierung als Marktführer",
                body:
                  "Ihr digitaler Auftritt signalisiert vom ersten Moment: Hier arbeiten Profis. Das schafft Vertrauen — bevor das erste Gespräch stattfindet.",
              },
              {
                n: "03",
                Icon: Zap,
                title: "Messbare Geschäftsergebnisse",
                body:
                  "Wir bauen nicht für Ästhetik. Wir bauen für Conversions, Sichtbarkeit und Wachstum — mit klaren KPIs von Anfang an.",
              },
            ].map((c, i) => (
              <motion.div
                key={c.n}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="card-noise group relative overflow-hidden rounded-none border border-white/[0.12] bg-[#0F0F2A] p-10 transition-colors duration-300 hover:border-[color:var(--mtw-brand)]/25"
              >
                <div className="serif-num absolute left-8 top-4 text-7xl text-white/[0.08]">
                  {c.n}
                </div>
                <div className="relative pt-20">
                  <div className="inline-flex rounded-sm bg-[color:var(--mtw-brand)]/[0.08] p-3">
                    <c.Icon
                      className="h-5 w-5 text-[color:var(--mtw-brand)]"
                      aria-hidden={true}
                      focusable={false}
                    />
                  </div>
                  <h3 className="mt-6 text-xl text-white">{c.title}</h3>
                  <p className="mt-4 text-sm leading-[1.9] text-white/70">
                    {c.body}
                  </p>
                </div>
                <DotPattern />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROZESS — LINE STYLE */}
      <section className="bg-[#08081A] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="max-w-2xl">
            <Eyebrow>Unser Prozess</Eyebrow>
            <h2
              className="leading-[1.1] text-white"
              style={{ fontSize: "clamp(36px, 4.5vw, 56px)" }}
            >
              Wie wir{" "}
              <em className="italic text-[color:var(--mtw-brand)]">arbeiten</em>
            </h2>
            <p className="mt-6 text-base leading-[1.9] text-white/75">
              Kein Template. Kein Copy-Paste. Jedes Projekt beginnt mit
              Verstehen.
            </p>
          </motion.div>

          <div className="mt-16">
            {[
              {
                n: "01",
                t: "Strategiegespräch",
                d: "Wir lernen Ihr Unternehmen, Ihre Ziele und Ihre Zielgruppe kennen. Erst dann beginnt die Arbeit.",
              },
              {
                n: "02",
                t: "Konzept & Design",
                d: "Individuelles Design — kein Template. Wir entwickeln einen Auftritt, der Ihre Marke widerspiegelt und Besucher in Kunden verwandelt.",
              },
              {
                n: "03",
                t: "Entwicklung & Optimierung",
                d: "Technisch sauber, schnell, DSGVO-konform und barrierefrei. Mit SEO-Fundament von Anfang an.",
              },
              {
                n: "04",
                t: "Launch & Begleitung",
                d: "Nach dem Launch lassen wir Sie nicht allein. Wir begleiten, optimieren und wachsen mit Ihnen.",
              },
            ].map((s, i, arr) => (
              <motion.div
                key={s.n}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                className={`group grid grid-cols-12 items-start gap-6 border-t border-white/[0.12] pt-8 pb-8 ${
                  i === arr.length - 1 ? "border-b" : ""
                }`}
              >
                <div className="serif-num col-span-12 text-5xl italic text-[color:var(--mtw-brand)]/50 transition-colors duration-300 group-hover:text-[color:var(--mtw-brand)] md:col-span-2">
                  {s.n}
                </div>
                <div className="col-span-12 md:col-span-4">
                  <h3 className="text-2xl text-white">{s.t}</h3>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <p className="text-base leading-[1.9] text-white/70">{s.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#08081A] px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl border-y border-white/[0.12]">
          <div className="grid grid-cols-1 divide-y divide-white/[0.10] md:grid-cols-3 md:divide-x md:divide-y-0">
            {[
              { n: "5", l: "Projekte pro Monat (max.)" },
              { n: "48h", l: "Bis zur ersten Vorschau" },
              { n: "100%", l: "Individuelle Umsetzung" },
            ].map((s) => (
              <div key={s.n} className="px-6 py-14 text-center">
                <div
                  className="serif-num text-[color:var(--mtw-brand)]"
                  style={{ fontSize: "clamp(64px, 8vw, 112px)" }}
                >
                  {s.n}
                </div>
                <div className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/30">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="bg-[#08081A] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="max-w-2xl">
            <Eyebrow>Referenzen</Eyebrow>
            <h2
              className="leading-[1.1] text-white"
              style={{ fontSize: "clamp(36px, 4.5vw, 56px)" }}
            >
              Ausgewählte{" "}
              <em className="italic text-[color:var(--mtw-brand)]">Projekte</em>
            </h2>
            <p className="mt-6 text-base leading-[1.9] text-white/75">
              Jedes Projekt ist einzigartig. Hier ein Einblick in unsere Arbeit.
            </p>
          </motion.div>

          <div className="mt-16 space-y-6">
            {[
              {
                n: "01",
                gradient:
                  "linear-gradient(135deg, hsl(250 56% 58%) 0%, hsl(250 56% 38%) 50%, #0A0A1F 100%)",
                label: "Handwerksbetrieb · Mainz",
                title: "Kompletter Neuauftritt mit 3× mehr Anfragen",
              },
              {
                n: "02",
                gradient:
                  "linear-gradient(135deg, #0A0A1F 0%, hsl(230 60% 30%) 50%, hsl(250 56% 58%) 100%)",
                label: "Beratung · Frankfurt",
                title: "Premium-Positionierung im B2B-Markt",
              },
            ].map((p, i) => (
              <motion.article
                key={p.n}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                className="card-noise group relative grid grid-cols-1 overflow-hidden rounded-none border border-white/[0.12] bg-[#0F0F2A] transition-colors duration-300 hover:border-[color:var(--mtw-brand)]/25 md:grid-cols-2"
              >
                <div className="relative p-10">
                  <div className="serif-num text-6xl text-white/[0.10]">{p.n}</div>
                  <div className="mt-6 text-[10px] uppercase tracking-[0.3em] text-white/30">
                    {p.label}
                  </div>
                  <h3 className="mt-4 text-2xl leading-tight text-white md:text-3xl">
                    {p.title}
                  </h3>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {["Custom Design", "SEO", "DSGVO-konform"].map((t) => (
                      <span
                        key={t}
                        className="border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/55"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  className="relative min-h-[260px] md:min-h-full"
                  style={{ background: p.gradient }}
                  aria-hidden={true}
                />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ÜBER UNS */}
      <section className="bg-[#08081A] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <motion.div {...fadeUp}>
              <Eyebrow>Wer wir sind</Eyebrow>
              <h2
                className="leading-[1.1] text-white"
                style={{ fontSize: "clamp(36px, 4.5vw, 56px)" }}
              >
                Warum Meine{" "}
                <em className="italic text-[color:var(--mtw-brand)]">
                  Traum Webseite
                </em>
              </h2>
              <div className="mt-8 space-y-5 text-base leading-[1.9] text-white/75">
                <p>
                  Wir sind keine große Agentur mit 50 Mitarbeitern und
                  Standardprozessen. Wir sind ein spezialisiertes Team, das
                  bewusst klein bleibt — damit jedes Projekt persönliche
                  Aufmerksamkeit bekommt.
                </p>
                <p>
                  Unsere Kunden wählen uns nicht wegen des Preises. Sie wählen
                  uns wegen der Ergebnisse.
                </p>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.15 }}
              className="relative flex aspect-square w-full max-w-md items-center justify-center justify-self-center border border-[color:var(--mtw-brand)]/20 bg-[#0F0F2A] md:justify-self-end"
            >
              <ChessKing className="h-2/3 w-2/3 text-[color:var(--mtw-brand)] opacity-80" />
              <div
                className="absolute inset-4 border border-[color:var(--mtw-brand)]/10"
                aria-hidden={true}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section
        id="bewerbung"
        className="border-t border-white/[0.06] bg-[#0C0C1E] px-8 py-32"
      >
        <div className="mx-auto max-w-[680px]">
          {submitted ? (
            <motion.div {...fadeUp} className="flex flex-col items-center text-center">
              <CheckCircle2
                className="h-12 w-12 text-[color:var(--mtw-brand)]"
                aria-hidden={true}
                focusable={false}
              />
              <h2
                className="mt-6 text-3xl text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Vielen Dank.
              </h2>
              <p className="mt-4 text-base leading-[1.7] text-white/60">
                Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 24
                Stunden persönlich bei Ihnen.
              </p>
            </motion.div>
          ) : (
            <motion.div {...fadeUp}>
              <div className="mb-4 font-sans text-[10px] uppercase tracking-[0.3em] text-white/30">
                Projekt anfragen
              </div>
              <h2
                className="text-4xl font-normal leading-[1.15] text-white md:text-5xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Erzählen Sie uns von{" "}
                <em className="italic text-[color:var(--mtw-brand)]">Ihrem</em>{" "}
                Projekt.
              </h2>
              <p className="mb-12 mt-6 text-base text-white/55">
                Wir melden uns innerhalb von 24 Stunden — persönlich, nicht
                automatisiert.
              </p>

              <div className="flex flex-col gap-8">
                {[
                  { key: "name", label: "IHR NAME", type: "text", placeholder: "Max Mustermann" },
                  { key: "company", label: "UNTERNEHMEN", type: "text", placeholder: "Mustermann GmbH" },
                  { key: "website", label: "WEBSITE (FALLS VORHANDEN)", type: "url", placeholder: "https://ihre-webseite.de" },
                  { key: "email", label: "E-MAIL", type: "email", placeholder: "max@mustermann.de" },
                  { key: "phone", label: "TELEFON", type: "tel", placeholder: "+49 ..." },
                ].map((f) => {
                  const hasError = errors[f.key as keyof typeof errors];
                  return (
                    <div key={f.key}>
                      <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                        {f.label}
                      </label>
                      <input
                        type={f.type}
                        value={formData[f.key as keyof typeof formData]}
                        onChange={(e) =>
                          setFormData({ ...formData, [f.key]: e.target.value })
                        }
                        placeholder={f.placeholder}
                        className={`w-full border-0 border-b bg-transparent py-4 text-base text-white placeholder:text-white/25 outline-none transition-colors focus:border-[color:var(--mtw-brand)] ${
                          hasError ? "border-red-500/70" : "border-white/[0.12]"
                        }`}
                      />
                    </div>
                  );
                })}

                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                    WAS MÖCHTEN SIE ERREICHEN?
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Beschreiben Sie kurz Ihr Ziel — was soll Ihre neue Webseite bewirken?"
                    className={`w-full resize-none border-0 border-b bg-transparent py-4 text-base text-white placeholder:text-white/25 outline-none transition-colors focus:border-[color:var(--mtw-brand)] ${
                      errors.message ? "border-red-500/70" : "border-white/[0.12]"
                    }`}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                    WIE HABEN SIE UNS GEFUNDEN?
                  </label>
                  <div className="relative">
                    <select
                      value={formData.source}
                      onChange={(e) =>
                        setFormData({ ...formData, source: e.target.value })
                      }
                      className="w-full appearance-none border-0 border-b border-white/[0.12] bg-transparent py-4 pr-8 text-base text-white outline-none transition-colors focus:border-[color:var(--mtw-brand)] [&>option]:bg-[#0C0C1E] [&>option]:text-white"
                    >
                      <option value="" disabled>
                        Bitte wählen...
                      </option>
                      <option value="google">Google-Suche</option>
                      <option value="empfehlung">Empfehlung</option>
                      <option value="social">Social Media</option>
                      <option value="sonstiges">Sonstiges</option>
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
                      aria-hidden={true}
                      focusable={false}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="mt-12 w-full rounded-none bg-[color:var(--mtw-brand)] py-5 text-sm uppercase tracking-widest text-white transition-all duration-200 hover:opacity-90"
                >
                  Projekt einreichen →
                </button>
                <p className="mt-4 text-center text-xs text-white/25">
                  🔒 Ihre Daten werden vertraulich behandelt. Kein Spam, keine Weitergabe.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA — LIGHT BOOKEND */}
      <section
        className="bg-[#F0EFFF] px-6 py-32 text-[#0A0A1F] md:px-12 md:py-40"
      >
        <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
          <div className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[color:var(--mtw-brand)]/60">
            Nächster Schritt
          </div>
          <h2
            className="leading-[1.1] text-[#0A0A1F]"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            Bereit für eine Webseite, die wirklich{" "}
            <em className="italic text-[color:var(--mtw-brand)]">arbeitet?</em>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-base leading-[1.9] text-[#0A0A1F]/70">
            Wir nehmen uns Zeit für jedes Projekt — deshalb limitieren wir uns
            auf 5 neue Kunden pro Monat. Wenn Sie ernsthaft über einen neuen
            Webauftritt nachdenken, sprechen Sie jetzt mit uns.
          </p>

          <div className="mt-10 inline-flex items-center gap-2 rounded-none border border-[color:var(--mtw-brand)]/30 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[color:var(--mtw-brand)]">
            <span className="text-[color:var(--mtw-brand)]">●</span>
            3 von 5 Plätzen für Juli verfügbar
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#bewerbung"
              className="inline-flex items-center gap-3 rounded-none bg-[#08081A] px-10 py-4 text-sm uppercase tracking-[0.2em] text-white transition-all hover:bg-[color:var(--mtw-brand)]"
            >
              Projekt jetzt anfragen
              <ArrowRight className="h-4 w-4" aria-hidden={true} focusable={false} />
            </a>
            <a
              href="tel:+4961313076498"
              className="inline-flex items-center gap-3 rounded-none border border-[#0A0A1F]/30 px-8 py-4 text-sm uppercase tracking-[0.2em] text-[#0A0A1F]/70 transition-all hover:border-[#0A0A1F] hover:text-[#0A0A1F]"
            >
              <Phone className="h-4 w-4" aria-hidden={true} focusable={false} />
              06131 30 764 98
            </a>
          </div>

          <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-[#0A0A1F]/50">
            Kein Verkaufsgespräch · Kein Druck
          </p>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="bg-[#08081A] px-6 py-24 md:px-12 md:py-32">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl">
          <div className="mb-4 text-center text-[10px] uppercase tracking-[0.3em] text-white/30">
            Häufige Fragen
          </div>
          <h2
            className="text-center leading-[1.1] text-white"
            style={{ fontSize: "clamp(36px, 4.5vw, 56px)" }}
          >
            Häufige{" "}
            <em className="italic text-[color:var(--mtw-brand)]">Fragen</em>
          </h2>
          <Accordion type="single" collapsible className="mt-12">
            {[
              {
                q: "Was kostet eine Premium-Webseite bei euch?",
                a: "Unsere Projekte starten ab 5.000 € und reichen je nach Umfang bis 15.000 €. Der genaue Preis hängt von Ihren Zielen, dem Funktionsumfang und der Projektlaufzeit ab. Im ersten Gespräch können wir das gemeinsam einschätzen.",
              },
              {
                q: "Wie lange dauert ein Projekt?",
                a: "Typisch 4–8 Wochen vom Kick-off bis zum Launch. Wir arbeiten strukturiert und halten Sie in jedem Schritt auf dem Laufenden.",
              },
              {
                q: "Was wenn ich schon eine Webseite habe?",
                a: "Kein Problem. Viele unserer Kunden kommen mit bestehenden Seiten zu uns. Wir analysieren was da ist und entwickeln daraus — oder bauen komplett neu, wenn das sinnvoller ist.",
              },
            ].map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-white/[0.12]"
              >
                <AccordionTrigger className="text-left text-lg text-white [&>svg]:text-[color:var(--mtw-brand)]">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-[1.9] text-white/75">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.12] bg-[#08081A] px-6 py-10 text-xs uppercase tracking-[0.2em] text-white/55 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div>© 2026 Meine Traum Webseite – QK Marketing</div>
          <div className="flex items-center gap-8">
            <Link
              to="/impressum"
              className="transition-colors hover:text-[color:var(--mtw-brand)]"
            >
              Impressum
            </Link>
            <Link
              to="/datenschutz"
              className="transition-colors hover:text-[color:var(--mtw-brand)]"
            >
              Datenschutz
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Premium;