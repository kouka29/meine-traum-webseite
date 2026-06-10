import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Check,
  X,
  TrendingUp,
  ShieldCheck,
  Zap,
  ChevronDown,
  Phone,
  ArrowRight,
} from "lucide-react";
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

const Section = ({
  children,
  className = "",
  bg = "#050510",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  bg?: string;
  id?: string;
}) => (
  <section
    id={id}
    style={{ backgroundColor: bg }}
    className={`relative w-full px-6 py-24 md:py-32 text-white ${className}`}
  >
    <div className="mx-auto max-w-6xl">{children}</div>
  </section>
);

const Premium = () => {
  return (
    <main id="main-content" className="min-h-screen bg-[#050510]">
      {/* HERO */}
      <section
        className="relative bg-[#050510] text-white min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      >
        {/* radial purple glow behind hero */}
        <div
          aria-hidden={true}
          className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/20 blur-[120px]"
        />
        <div
          aria-hidden={true}
          className="pointer-events-none absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(270 70% 50% / 0.5), transparent 70%)",
          }}
        />
        <div
          aria-hidden={true}
          className="pointer-events-none absolute -bottom-32 -right-32 h-[480px] w-[480px] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(220 80% 50% / 0.5), transparent 70%)",
          }}
        />

        <motion.div
          {...fadeUp}
          className="relative z-10 mx-auto max-w-4xl text-center"
        >
          <span className="inline-block rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-purple-300">
            Limitiert auf 5 Projekte pro Monat
          </span>

          <h1 className="mt-8 bg-gradient-to-br from-white via-white to-purple-300 bg-clip-text text-7xl font-black leading-none tracking-tight text-transparent md:text-8xl">
            Webseiten, die Ihr Unternehmen
            <br />
            auf ein neues Level bringen.
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-zinc-400">
            Wir entwickeln digitale Präsenzen für Unternehmen, die nicht nach
            Kompromissen suchen — sondern nach Ergebnissen.
          </p>

          <div className="mt-12">
            <a
              href="#bewerbung"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/5 px-8 py-3 font-medium text-white backdrop-blur transition-all duration-300 hover:bg-white hover:text-black"
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ChevronDown
            className="h-6 w-6 animate-bounce text-white/40"
            aria-hidden={true}
            focusable={false}
          />
        </motion.div>
      </section>

      {/* SECTION 2 — FÜR WEN */}
      <Section bg="#0D0D1F">
        <motion.div {...fadeUp} className="grid gap-16 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
              Für wen wir arbeiten
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              Wir arbeiten nicht mit jedem. Unsere Kapazität ist bewusst
              begrenzt — damit jedes Projekt die Aufmerksamkeit bekommt, die es
              verdient.
            </p>
          </div>
          <div className="space-y-10">
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-purple-400">
                Das sind unsere Kunden:
              </h3>
              <ul className="space-y-3">
                {[
                  "Unternehmen mit klaren Wachstumszielen",
                  "Marken, die online als Marktführer wahrgenommen werden wollen",
                  "Gründer und Geschäftsführer, die Qualität über Preis stellen",
                  "Betriebe, die eine langfristige digitale Partnerschaft suchen",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-zinc-200">
                    <Check
                      className="mt-1 h-5 w-5 flex-shrink-0 text-purple-400"
                      aria-hidden={true}
                      focusable={false}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-red-400">
                Das sind nicht unsere Kunden:
              </h3>
              <ul className="space-y-3">
                {[
                  "Wer hauptsächlich nach dem günstigsten Anbieter sucht",
                  "Wer eine Webseite in 3 Tagen braucht",
                  "Wer keine klare Vision für sein Unternehmen hat",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-zinc-500">
                    <X
                      className="mt-1 h-5 w-5 flex-shrink-0 text-red-400/60"
                      aria-hidden={true}
                      focusable={false}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* SECTION 3 — ERGEBNISSE */}
      <Section bg="#050510">
        <motion.div {...fadeUp}>
          <h2 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
            Was wirklich entsteht
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              Icon: TrendingUp,
              title: "Mehr qualifizierte Anfragen",
              body:
                "Keine Website die nur gut aussieht. Jede Seite ist strategisch aufgebaut, um genau die Kunden anzuziehen, die zu Ihnen passen.",
            },
            {
              Icon: ShieldCheck,
              title: "Positionierung als Marktführer",
              body:
                "Ihr digitaler Auftritt signalisiert vom ersten Moment: Hier arbeiten Profis. Das schafft Vertrauen — bevor das erste Gespräch stattfindet.",
            },
            {
              Icon: Zap,
              title: "Messbare Geschäftsergebnisse",
              body:
                "Wir bauen nicht für Ästhetik. Wir bauen für Conversions, Sichtbarkeit und Wachstum — mit klaren KPIs von Anfang an.",
            },
          ].map(({ Icon, title, body }, i) => (
            <motion.div
              key={title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 transition-all duration-500 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(124,58,237,0.1)]"
            >
              <div className="inline-flex rounded-xl bg-purple-500/10 p-3">
                <Icon
                  className="h-6 w-6 text-purple-400"
                  aria-hidden={true}
                  focusable={false}
                />
              </div>
              <h3 className="mt-6 text-xl font-bold tracking-tight text-white">
                {title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">{body}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* SECTION 4 — PROZESS */}
      <Section bg="#0D0D1F">
        <motion.div {...fadeUp} className="max-w-2xl">
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
            Wie wir arbeiten
          </h2>
          <p className="mt-6 text-lg text-zinc-400">
            Kein Template. Kein Copy-Paste. Jedes Projekt beginnt mit Verstehen.
          </p>
        </motion.div>

        <div className="relative mt-16 grid gap-12 md:grid-cols-4 md:gap-8 md:before:absolute md:before:top-10 md:before:left-0 md:before:right-0 md:before:h-px md:before:bg-gradient-to-r md:before:from-transparent md:before:via-purple-500/30 md:before:to-transparent">
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
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="relative"
            >
              <div className="text-6xl font-black leading-none text-purple-500/20">
                {s.n}
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">
                {s.t}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* SECTION 5 — PORTFOLIO */}
      <Section bg="#050510">
        <motion.div {...fadeUp} className="max-w-2xl">
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
            Ausgewählte Projekte
          </h2>
          <p className="mt-6 text-lg text-zinc-400">
            Jedes Projekt ist einzigartig. Hier ein Einblick in unsere Arbeit.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {[
            {
              gradient: "linear-gradient(135deg, #7C3AED, #2563EB)",
              label: "HANDWERKSBETRIEB · MAINZ",
              title: "Kompletter Neuauftritt mit 3× mehr Anfragen",
            },
            {
              gradient: "linear-gradient(135deg, #2563EB, #0891B2)",
              label: "BERATUNG · FRANKFURT",
              title: "Premium-Positionierung im B2B-Markt",
            },
          ].map((p, i) => (
            <motion.article
              key={p.label}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-purple-900/20 to-blue-900/20"
            >
              <div
                className="relative aspect-video w-full"
                style={{ background: p.gradient }}
                aria-hidden={true}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 text-lg font-semibold text-white">
                  {p.title}
                </div>
              </div>
              <div className="p-8">
                <div className="text-xs font-semibold uppercase tracking-widest text-purple-400">
                  {p.label}
                </div>
                <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-white">
                  {p.title}
                </h3>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Custom Design", "SEO", "DSGVO-konform"].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div {...fadeUp} className="mt-16 text-center">
          <p className="text-lg text-zinc-400">
            Ihr Projekt könnte das nächste sein.
          </p>
          <a
            href="#bewerbung"
            className="group mt-6 inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/5 px-8 py-3 font-medium text-white backdrop-blur transition-all duration-300 hover:bg-white hover:text-black"
          >
            Projekt anfragen
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden={true}
              focusable={false}
            />
          </a>
        </motion.div>
      </Section>

      {/* SECTION 6 — ÜBER UNS */}
      <Section bg="#0D0D1F">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <motion.div {...fadeUp}>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
              Warum Meine Traum Webseite
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-zinc-400">
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

            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { n: "5", l: "Projekte pro Monat (max.)" },
                { n: "48h", l: "Bis zur ersten Vorschau" },
                { n: "100%", l: "Individuelle Umsetzung" },
              ].map((s) => (
                <div key={s.n}>
                  <div className="text-3xl font-bold text-purple-400 md:text-4xl">
                    {s.n}
                  </div>
                  <div className="mt-2 text-sm text-zinc-500">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.15 }}
            className="relative aspect-square w-full max-w-md justify-self-center md:justify-self-end"
          >
            <div
              className="absolute inset-0 rounded-3xl opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, hsl(250 56% 48%), hsl(220 80% 50%))",
              }}
              aria-hidden={true}
            />
            <div
              className="absolute inset-6 rounded-3xl border border-white/30 backdrop-blur-sm"
              aria-hidden={true}
            />
            <div
              className="absolute inset-14 rounded-3xl border border-white/20"
              aria-hidden={true}
            />
          </motion.div>
        </div>
      </Section>

      {/* SECTION 7 — BEWERBUNGS-CTA */}
      <section
        id="bewerbung"
        className="relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-[#050510] to-[#050510] px-6 py-32 text-white md:py-40"
      >
        <motion.div
          {...fadeUp}
          className="relative mx-auto max-w-3xl text-center"
        >
          <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl">
            Bereit für eine Webseite,
            <br />
            die wirklich arbeitet?
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-zinc-400">
            Wir nehmen uns Zeit für jedes Projekt — deshalb limitieren wir uns
            auf 5 neue Kunden pro Monat. Wenn Sie ernsthaft über einen neuen
            Webauftritt nachdenken, sprechen Sie jetzt mit uns.
          </p>

          <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
            <span
              className="h-2 w-2 rounded-full bg-green-400"
              aria-hidden={true}
            />
            3 von 5 Plätzen für Juli noch verfügbar
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all hover:bg-purple-500 hover:shadow-[0_0_40px_rgba(124,58,237,0.5)]"
            >
              Projekt jetzt anfragen
              <ArrowRight
                className="ml-1 h-4 w-4"
                aria-hidden={true}
                focusable={false}
              />
            </Link>
            <a
              href="tel:+4961313076498"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 font-medium text-white transition-all hover:bg-white/5"
            >
              <Phone className="h-4 w-4" aria-hidden={true} focusable={false} />
              06131 30 764 98
            </a>
          </div>

          <p className="mt-8 text-sm text-zinc-500">
            Kein Verkaufsgespräch. Kein Druck. Wir prüfen gemeinsam ob wir
            zueinander passen.
          </p>
        </motion.div>
      </section>

      {/* SECTION 8 — FAQ */}
      <Section bg="#0D0D1F">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl">
          <h2 className="text-center text-4xl font-bold tracking-tight text-white md:text-5xl">
            Häufige Fragen
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
              <AccordionItem key={i} value={`item-${i}`} className="border-white/[0.08]">
                <AccordionTrigger className="text-left text-lg font-medium text-white [&>svg]:text-purple-400">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-zinc-400">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </Section>

      {/* MINIMAL FOOTER */}
      <footer className="border-t border-white/5 bg-[#050510] px-6 py-8 text-sm text-zinc-600">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div>© 2026 Meine Traum Webseite – QK Marketing</div>
          <div className="flex items-center gap-6">
            <Link to="/impressum" className="text-zinc-500 transition-colors hover:text-white">
              Impressum
            </Link>
            <Link to="/datenschutz" className="text-zinc-500 transition-colors hover:text-white">
              Datenschutz
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Premium;