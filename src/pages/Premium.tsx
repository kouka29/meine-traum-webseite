import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Check, X, ChevronDown, Phone, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-6 text-[10px] uppercase tracking-[0.25em] text-[#6B6B6B]">
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
    className="absolute bottom-6 right-6 h-16 w-16 text-[#C9A96E]/20"
    viewBox="0 0 60 60"
    aria-hidden={true}
    focusable={false}
  >
    {[...Array(6)].map((_, r) =>
      [...Array(6)].map((_, c) => (
        <circle key={`${r}-${c}`} cx={4 + c * 10} cy={4 + r * 10} r="1.2" fill="currentColor" />
      ))
    )}
  </svg>
);

const Premium = () => {
  useEffect(() => {
    const id = "premium-playfair-font";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <main
      id="main-content"
      className="premium-page min-h-screen bg-[#0A0A0A] text-[#F5F0E8]"
    >
      <style>{`
        .premium-page h1, .premium-page h2, .premium-page h3 {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 400;
        }
        .premium-page .serif-num {
          font-family: 'Playfair Display', Georgia, serif;
        }
      `}</style>

      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden bg-[#0A0A0A] px-6 md:px-12">
        <ChessKing className="pointer-events-none absolute right-4 top-1/2 hidden h-[400px] w-[300px] -translate-y-1/2 text-[#C9A96E] opacity-[0.06] md:block" />

        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center">
          <motion.div {...fadeUp} className="max-w-3xl">
            <Eyebrow>Limitiert auf 5 Projekte pro Monat</Eyebrow>

            <h1 className="text-[56px] leading-[1.05] tracking-tight text-[#F5F0E8] md:text-[88px] lg:text-[100px]">
              Webseiten, die Ihr Unternehmen auf ein neues{" "}
              <em className="italic text-[#C9A96E]">Level</em> bringen.
            </h1>

            <p className="mt-10 max-w-[500px] text-base leading-[1.8] text-[#F5F0E8]/60">
              Wir entwickeln digitale Präsenzen für Unternehmen, die nicht nach
              Kompromissen suchen — sondern nach Ergebnissen.
            </p>

            <div className="mt-12">
              <a
                href="#bewerbung"
                className="group inline-flex items-center gap-3 rounded-none border border-[#C9A96E]/40 px-8 py-3 text-sm uppercase tracking-[0.2em] text-[#C9A96E] transition-all duration-300 hover:bg-[#C9A96E] hover:text-black"
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

        <div className="absolute bottom-0 left-0 right-0 border-t border-[#C9A96E]/20" />
        <ChevronDown
          className="absolute bottom-8 left-1/2 h-5 w-5 -translate-x-1/2 animate-bounce text-[#C9A96E]/40"
          aria-hidden={true}
          focusable={false}
        />
      </section>

      {/* FÜR WEN — CREAM */}
      <section className="bg-[#F5F0E8] px-6 py-24 text-[#0A0A0A] md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="grid gap-16 md:grid-cols-2 md:gap-20">
            <div>
              <div className="mb-6 text-[10px] uppercase tracking-[0.25em] text-[#6B6B6B]">
                Wir arbeiten selektiv
              </div>
              <h2 className="text-4xl leading-[1.1] tracking-tight text-[#0A0A0A] md:text-[56px]">
                Für wen wir{" "}
                <em className="italic text-[#C9A96E]">arbeiten</em>
              </h2>
              <p className="mt-8 max-w-md text-base leading-[1.8] text-[#0A0A0A]/70">
                Wir arbeiten nicht mit jedem. Unsere Kapazität ist bewusst
                begrenzt — damit jedes Projekt die Aufmerksamkeit bekommt, die
                es verdient.
              </p>
            </div>
            <div className="space-y-12">
              <div>
                <div className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#6B6B6B]">
                  Das sind unsere Kunden
                </div>
                <ul className="space-y-4">
                  {[
                    "Unternehmen mit klaren Wachstumszielen",
                    "Marken, die online als Marktführer wahrgenommen werden wollen",
                    "Gründer und Geschäftsführer, die Qualität über Preis stellen",
                    "Betriebe, die eine langfristige digitale Partnerschaft suchen",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[#0A0A0A]">
                      <Check
                        className="mt-1 h-4 w-4 flex-shrink-0 text-[#C9A96E]"
                        aria-hidden={true}
                        focusable={false}
                      />
                      <span className="text-base leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#6B6B6B]">
                  Das sind nicht unsere Kunden
                </div>
                <ul className="space-y-4">
                  {[
                    "Wer hauptsächlich nach dem günstigsten Anbieter sucht",
                    "Wer eine Webseite in 3 Tagen braucht",
                    "Wer keine klare Vision für sein Unternehmen hat",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[#0A0A0A]/50"
                    >
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
      <section className="bg-[#0A0A0A] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="max-w-2xl">
            <Eyebrow>Was wir liefern</Eyebrow>
            <h2 className="text-4xl leading-[1.1] tracking-tight text-[#F5F0E8] md:text-[56px]">
              Was wirklich{" "}
              <em className="italic text-[#C9A96E]">entsteht</em>
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Mehr qualifizierte Anfragen",
                body:
                  "Keine Website die nur gut aussieht. Jede Seite ist strategisch aufgebaut, um genau die Kunden anzuziehen, die zu Ihnen passen.",
              },
              {
                n: "02",
                title: "Positionierung als Marktführer",
                body:
                  "Ihr digitaler Auftritt signalisiert vom ersten Moment: Hier arbeiten Profis. Das schafft Vertrauen — bevor das erste Gespräch stattfindet.",
              },
              {
                n: "03",
                title: "Messbare Geschäftsergebnisse",
                body:
                  "Wir bauen nicht für Ästhetik. Wir bauen für Conversions, Sichtbarkeit und Wachstum — mit klaren KPIs von Anfang an.",
              },
            ].map((c, i) => (
              <motion.div
                key={c.n}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="group relative overflow-hidden border border-white/[0.06] bg-[#111111] p-10 transition-colors duration-500 hover:border-[#C9A96E]/30"
              >
                <div className="serif-num absolute left-8 top-6 text-6xl text-white/[0.06]">
                  {c.n}
                </div>
                <div className="relative pt-16">
                  <h3 className="text-xl tracking-tight text-[#F5F0E8]">
                    {c.title}
                  </h3>
                  <p className="mt-4 text-sm leading-[1.8] text-[#F5F0E8]/60">
                    {c.body}
                  </p>
                </div>
                <DotPattern />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROZESS */}
      <section className="bg-[#0A0A0A] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="max-w-2xl">
            <Eyebrow>Unser Prozess</Eyebrow>
            <h2 className="text-4xl leading-[1.1] tracking-tight text-[#F5F0E8] md:text-[56px]">
              Wie wir{" "}
              <em className="italic text-[#C9A96E]">arbeiten</em>
            </h2>
            <p className="mt-6 text-base leading-[1.8] text-[#F5F0E8]/60">
              Kein Template. Kein Copy-Paste. Jedes Projekt beginnt mit
              Verstehen.
            </p>
          </motion.div>

          <div className="mt-16 space-y-0">
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
            ].map((s, i) => (
              <motion.div
                key={s.n}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                className="grid grid-cols-12 gap-6 border-t border-[#C9A96E]/20 py-10"
              >
                <div className="serif-num col-span-12 text-5xl italic text-[#C9A96E] md:col-span-2 md:text-6xl">
                  {s.n}
                </div>
                <div className="col-span-12 md:col-span-4">
                  <h3 className="text-2xl tracking-tight text-[#F5F0E8]">
                    {s.t}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <p className="text-base leading-[1.8] text-[#F5F0E8]/60">
                    {s.d}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#0A0A0A] px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl border-t border-b border-white/[0.06]">
          <div className="grid grid-cols-1 divide-y divide-white/[0.06] md:grid-cols-3 md:divide-x md:divide-y-0">
            {[
              { n: "5", l: "Projekte pro Monat (max.)" },
              { n: "48h", l: "Bis zur ersten Vorschau" },
              { n: "100%", l: "Individuelle Umsetzung" },
            ].map((s) => (
              <div key={s.n} className="px-6 py-12 text-center">
                <div className="serif-num text-7xl text-[#C9A96E]">{s.n}</div>
                <div className="mt-4 text-xs uppercase tracking-[0.25em] text-[#6B6B6B]">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="bg-[#0A0A0A] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="max-w-2xl">
            <Eyebrow>Ausgewählte Projekte</Eyebrow>
            <h2 className="text-4xl leading-[1.1] tracking-tight text-[#F5F0E8] md:text-[56px]">
              Ausgewählte{" "}
              <em className="italic text-[#C9A96E]">Projekte</em>
            </h2>
            <p className="mt-6 text-base leading-[1.8] text-[#F5F0E8]/60">
              Jedes Projekt ist einzigartig. Hier ein Einblick in unsere Arbeit.
            </p>
          </motion.div>

          <div className="mt-16 space-y-6">
            {[
              {
                n: "01",
                gradient:
                  "linear-gradient(135deg, #C9A96E 0%, #8a7142 60%, #2a2014 100%)",
                label: "Handwerksbetrieb · Mainz",
                title: "Kompletter Neuauftritt mit 3× mehr Anfragen",
              },
              {
                n: "02",
                gradient:
                  "linear-gradient(135deg, #2a2014 0%, #8a7142 50%, #C9A96E 100%)",
                label: "Beratung · Frankfurt",
                title: "Premium-Positionierung im B2B-Markt",
              },
            ].map((p, i) => (
              <motion.article
                key={p.n}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                className="grid grid-cols-1 border border-white/[0.06] bg-[#111111] transition-colors duration-500 hover:border-[#C9A96E]/30 md:grid-cols-2"
              >
                <div className="p-10">
                  <div className="serif-num text-6xl text-white/[0.08]">
                    {p.n}
                  </div>
                  <div className="mt-6 text-[10px] uppercase tracking-[0.25em] text-[#6B6B6B]">
                    {p.label}
                  </div>
                  <h3 className="mt-4 text-2xl leading-tight tracking-tight text-[#F5F0E8] md:text-3xl">
                    {p.title}
                  </h3>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {["Custom Design", "SEO", "DSGVO-konform"].map((t) => (
                      <span
                        key={t}
                        className="border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  className="relative min-h-[280px] md:min-h-full"
                  style={{ background: p.gradient }}
                  aria-hidden={true}
                />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ÜBER UNS */}
      <section className="bg-[#0A0A0A] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <motion.div {...fadeUp}>
              <Eyebrow>Über uns</Eyebrow>
              <h2 className="text-4xl leading-[1.1] tracking-tight text-[#F5F0E8] md:text-[56px]">
                Warum Meine{" "}
                <em className="italic text-[#C9A96E]">Traum Webseite</em>
              </h2>
              <div className="mt-8 space-y-5 text-base leading-[1.8] text-[#F5F0E8]/60">
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
              className="relative flex aspect-square w-full max-w-md items-center justify-center justify-self-center border border-[#C9A96E]/20 bg-[#111111] md:justify-self-end"
            >
              <ChessKing className="h-2/3 w-2/3 text-[#C9A96E] opacity-80" />
              <div className="absolute inset-4 border border-[#C9A96E]/10" aria-hidden={true} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* BEWERBUNGS-CTA — CREAM */}
      <section
        id="bewerbung"
        className="bg-[#F5F0E8] px-6 py-32 text-[#0A0A0A] md:px-12 md:py-40"
      >
        <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
          <div className="mb-6 text-[10px] uppercase tracking-[0.25em] text-[#6B6B6B]">
            Jetzt bewerben
          </div>
          <h2 className="text-4xl leading-[1.1] tracking-tight text-[#0A0A0A] md:text-[64px]">
            Bereit für eine Webseite, die wirklich{" "}
            <em className="italic text-[#C9A96E]">arbeitet?</em>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-base leading-[1.8] text-[#0A0A0A]/70">
            Wir nehmen uns Zeit für jedes Projekt — deshalb limitieren wir uns
            auf 5 neue Kunden pro Monat. Wenn Sie ernsthaft über einen neuen
            Webauftritt nachdenken, sprechen Sie jetzt mit uns.
          </p>

          <div className="mt-10 text-sm text-[#C9A96E]">
            ● 3 von 5 Plätzen für Juli noch verfügbar
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-3 rounded-none bg-[#0A0A0A] px-10 py-4 text-sm uppercase tracking-[0.2em] text-[#F5F0E8] transition-all hover:bg-[#C9A96E] hover:text-black"
            >
              Projekt jetzt anfragen
              <ArrowRight className="h-4 w-4" aria-hidden={true} focusable={false} />
            </Link>
            <a
              href="tel:+4961313076498"
              className="inline-flex items-center gap-3 rounded-none border border-[#0A0A0A]/20 px-8 py-4 text-sm uppercase tracking-[0.2em] text-[#0A0A0A] transition-all hover:border-[#0A0A0A]"
            >
              <Phone className="h-4 w-4" aria-hidden={true} focusable={false} />
              06131 30 764 98
            </a>
          </div>

          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-[#6B6B6B]">
            Kein Verkaufsgespräch · Kein Druck
          </p>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="bg-[#0A0A0A] px-6 py-24 md:px-12 md:py-32">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl">
          <div className="mb-6 text-center text-[10px] uppercase tracking-[0.25em] text-[#6B6B6B]">
            Häufige Fragen
          </div>
          <h2 className="text-center text-4xl leading-[1.1] tracking-tight text-[#F5F0E8] md:text-[56px]">
            Häufige{" "}
            <em className="italic text-[#C9A96E]">Fragen</em>
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
                className="border-white/[0.08]"
              >
                <AccordionTrigger className="text-left text-lg text-[#F5F0E8] [&>svg]:text-[#C9A96E]">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-[1.8] text-[#F5F0E8]/60">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] bg-[#0A0A0A] px-6 py-10 text-xs uppercase tracking-[0.2em] text-[#6B6B6B] md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div>© 2026 Meine Traum Webseite – QK Marketing</div>
          <div className="flex items-center gap-8">
            <Link to="/impressum" className="transition-colors hover:text-[#C9A96E]">
              Impressum
            </Link>
            <Link to="/datenschutz" className="transition-colors hover:text-[#C9A96E]">
              Datenschutz
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Premium;