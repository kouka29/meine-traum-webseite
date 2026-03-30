import AnimatedSection from "@/components/AnimatedSection";

const Impressum = () => (
  <main className="pt-20">
    <section className="section-padding">
      <div className="container-narrow px-4 max-w-3xl mx-auto">
        <AnimatedSection>
          <h1 className="mb-8">Impressum</h1>
        </AnimatedSection>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-8">
          <AnimatedSection delay={0.1}>
            <h2 className="text-xl font-semibold text-foreground">Angaben gemäß § 5 DDG</h2>
            <p>
              Meine Traum Webseite<br />
              Musterstraße 1<br />
              12345 Musterstadt<br />
              Deutschland
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <h2 className="text-xl font-semibold text-foreground">Kontakt</h2>
            <p>
              Telefon: +49 123 456 789<br />
              E-Mail: info@meinetraumwebseite.de
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <h2 className="text-xl font-semibold text-foreground">Vertreten durch</h2>
            <p>
              [Vorname Nachname], Geschäftsführer/in
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <h2 className="text-xl font-semibold text-foreground">Umsatzsteuer-ID</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
              DE XXX XXX XXX
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <h2 className="text-xl font-semibold text-foreground">Berufsbezeichnung und berufsrechtliche Regelungen</h2>
            <p>
              Berufsbezeichnung: Webdesign-Agentur<br />
              Zuständige Kammer: [Handels-/Handwerkskammer]<br />
              Verliehen in: Deutschland
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.35}>
            <h2 className="text-xl font-semibold text-foreground">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p>
              [Vorname Nachname]<br />
              Musterstraße 1<br />
              12345 Musterstadt
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <h2 className="text-xl font-semibold text-foreground">EU-Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.45}>
            <h2 className="text-xl font-semibold text-foreground">Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten 
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als 
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
              Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
              Tätigkeit hinweisen.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.5}>
            <h2 className="text-xl font-semibold text-foreground">Haftung für Links</h2>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
              Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
              Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber 
              der Seiten verantwortlich.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.55}>
            <h2 className="text-xl font-semibold text-foreground">Urheberrecht</h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
              dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
              der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
              Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.6}>
            <p className="text-xs text-muted-foreground border-t border-border pt-8">
              Stand: März 2026 · Dieses Impressum entspricht den Anforderungen des § 5 DDG 
              (Digitale-Dienste-Gesetz, ehem. TMG).
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  </main>
);

export default Impressum;
