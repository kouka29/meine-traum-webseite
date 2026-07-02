import AnimatedSection from "@/components/AnimatedSection";

const Barrierefreiheit = () => (
 <main id="main-content" className="pt-20" tabIndex={-1}>
    <section className="section-padding">
      <div className="container-narrow px-4 max-w-3xl mx-auto">
        <AnimatedSection>
          <h1 className="mb-8">Erklärung zur Barrierefreiheit</h1>
        </AnimatedSection>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-8">
          <AnimatedSection delay={0.1}>
            <p>
 QK Marketing (Meine Traum Webseite) ist bestrebt, seine Website im Einklang mit dem
 Barrierefreiheitsstärkungsgesetz (BFSG) barrierefrei zugänglich zu machen.
 </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <h2 className="text-xl font-semibold text-foreground">Stand der Vereinbarkeit mit den Anforderungen</h2>
            <p>
              Diese Website ist mit den Anforderungen des BFSG und den WCAG 2.1 Level AA{" "}
              <strong>teilweise vereinbar</strong>. Die nachfolgend aufgeführten Inhalte sind noch
 nicht barrierefrei:
 </p>
            <h3 className="text-lg font-medium text-foreground mt-4">Nicht barrierefreie Inhalte</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
 Einige dekorative SVG-Icons enthalten noch keine aria-hidden Auszeichnung (wird behoben)
 </li>
              <li>Ein Skip-Navigationlink wird ergänzt</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <h2 className="text-xl font-semibold text-foreground">Feedback und Kontaktangaben</h2>
            <p>
 Sind Ihnen Mängel beim barrierefreien Zugang zu Inhalten aufgefallen? Bitte melden Sie sich:
 </p>
            <p>
              <strong className="text-foreground">QK Marketing – Meine Traum Webseite</strong>
              <br />
 Muad Amar
 <br />
 Rheinallee 88, Gebäude 23
 <br />
 55120 Mainz
 <br />
 E-Mail: info@meine-traum-webseite.de
 <br />
 Telefon: 06131 3076498
 </p>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <h2 className="text-xl font-semibold text-foreground">Zuständige Marktüberwachungsstelle</h2>
            <p>
 Marktüberwachungsstelle der Länder für die Barrierefreiheit von Produkten und
 Dienstleistungen (MLBF)
 <br />
 c/o Ministerium für Arbeit, Soziales, Gesundheit und Gleichstellung Sachsen-Anhalt
 <br />
 Postfach 39 11 55, 39135 Magdeburg
 </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <p className="text-xs text-muted-foreground border-t border-border pt-8">
 Letzte Aktualisierung: Juni 2026
 </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  </main>
);

export default Barrierefreiheit;