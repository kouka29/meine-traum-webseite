import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";

const Datenschutz = () => (
  <main className="pt-20">
    <section className="section-padding">
      <div className="container-narrow px-4 max-w-3xl mx-auto">
        <AnimatedSection>
          <h1 className="mb-8">Datenschutzerklärung</h1>
        </AnimatedSection>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-8">
          <AnimatedSection delay={0.1}>
            <h2 className="text-xl font-semibold text-foreground">1. Datenschutz auf einen Blick</h2>
            <h3 className="text-lg font-medium text-foreground mt-4">Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, 
              wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert 
              werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer nachstehenden Datenschutzerklärung.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <h2 className="text-xl font-semibold text-foreground">2. Verantwortliche Stelle</h2>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:
            </p>
            <p>
              Meine Traum Webseite<br />
              QK Marketing Group<br />
              Muad Amar <br />
              Rheinallee 88 /Gebäude 23<br />
              55120 Mainz<br />
              Deutschland
            </p>
            <p>
              Telefon: +49 6131 30 765 00<br />
              E-Mail: info@meine-traum-webseite.de
            </p>
            <p>
              Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen 
              über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <h2 className="text-xl font-semibold text-foreground">3. Datenerfassung auf dieser Website</h2>
            
            <h3 className="text-lg font-medium text-foreground mt-4">Cookies</h3>
            <p>
              Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden. 
              Sie richten keinen Schaden an und enthalten keine Viren. Wir unterscheiden zwischen technisch notwendigen 
              Cookies (Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO, § 25 Abs. 2 TDDDG) und einwilligungspflichtigen 
              Cookies (Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG).
            </p>
            <p>
              Sie können Ihre Cookie-Einstellungen jederzeit über den Cookie-Banner auf unserer Website anpassen 
              oder Ihre Einwilligung widerrufen.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-4">Kontaktformular</h3>
            <p>
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Formular inklusive 
              der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von 
              Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
            </p>
            <p>
              Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre 
              Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher 
              Maßnahmen erforderlich ist.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <h2 className="text-xl font-semibold text-foreground">4. Ihre Rechte</h2>
            <p>Sie haben jederzeit das Recht:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Auskunft über Ihre bei uns gespeicherten Daten zu erhalten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten zu verlangen (Art. 16 DSGVO)</li>
              <li>Löschung Ihrer Daten zu verlangen (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung zu verlangen (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit zu verlangen (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen die Verarbeitung einzulegen (Art. 21 DSGVO)</li>
              <li>Eine erteilte Einwilligung jederzeit zu widerrufen (Art. 7 Abs. 3 DSGVO)</li>
              <li>Sich bei einer Aufsichtsbehörde zu beschweren (Art. 77 DSGVO)</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <h2 className="text-xl font-semibold text-foreground">5. Hosting</h2>
            <p>
              Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten, 
              die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann 
              es sich v.a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, 
              Kontaktdaten, Namen, Webseitenzugriffe und sonstige Daten handeln.
            </p>
            <p>
              Der Einsatz des Hosters erfolgt im Interesse einer sicheren, schnellen und effizienten Bereitstellung 
              unseres Online-Angebots (Art. 6 Abs. 1 lit. f DSGVO).
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.35}>
            <h2 className="text-xl font-semibold text-foreground">6. SSL- bzw. TLS-Verschlüsselung</h2>
            <p>
              Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte 
              eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die 
              Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <p className="text-xs text-muted-foreground border-t border-border pt-8">
              Stand: März 2026 · Diese Datenschutzerklärung entspricht den Anforderungen der DSGVO, 
              des BDSG und des TDDDG (ehem. TTDSG).
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  </main>
);

export default Datenschutz;
