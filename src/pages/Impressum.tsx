import AnimatedSection from "@/components/AnimatedSection";

const Impressum = () => (
  <main className="pt-20">
    <section className="section-padding">
      <div className="container-narrow px-4 max-w-3xl mx-auto">
        <AnimatedSection>
          <h1 className="mb-8">Impressum</h1>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="space-y-8 text-muted-foreground leading-relaxed text-sm">
            <div>
              <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Angaben gemäß § 5 DDG</h2>
              <p>QK Marketing Group<br />Inhaber: Muad Amar<br />Rheinallee 88 / Gebäude 23<br />55120 Mainz<br />Deutschland</p>
            </div>

            <div>
              <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Kontakt</h2>
              <p>Telefon: 06131/30 765 00<br />E-Mail: info@meine-traum-webseite.de</p>
            </div>

            <div>
              <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Berufsbezeichnung</h2>
              <p>Webdesign & Online-Marketing</p>
            </div>

            <div>
              <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Umsatzsteuer-ID</h2>
              <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />DE458070108</p>
            </div>

            <div>
              <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
              <p>Muad Amar<br />Rheinallee 88 / Gebäude 23<br />55120 Mainz</p>
            </div>

            <div>
              <h2 className="text-lg font-heading font-semibold text-foreground mb-3">EU-Streitschlichtung</h2>
              <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://ec.europa.eu/consumers/odr/</a>.<br />Unsere E-Mail-Adresse findest du oben im Impressum.</p>
            </div>

            <div>
              <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
              <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
            </div>

            <div>
              <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Haftung für Inhalte</h2>
              <p>Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
              <p className="mt-2">Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
            </div>

            <div>
              <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Haftung für Links</h2>
              <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
            </div>

            <div>
              <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Urheberrecht</h2>
              <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  </main>
);

export default Impressum;
