import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";

const Datenschutz = () => (
 <main id="main-content" className="pt-20">
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
 Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit deinen personenbezogenen Daten passiert, 
 wenn du diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen du persönlich identifiziert 
 werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen du unserer nachstehenden Datenschutzerklärung.
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
              <br />
 55120 Mainz<br />
 Deutschland
 </p>
            <p>
 Telefon: 06131 3076498<br />
 E-Mail: info@meine-traum-webseite.de<br />
              <br />
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
 Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die auf deinem Endgerät gespeichert werden. 
 Du richten keinen Schaden an und enthalten keine Viren. Wir unterscheiden zwischen technisch notwendigen 
 Cookies (Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO, § 25 Abs. 2 TDDDG) und einwilligungspflichtigen 
 Cookies (Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG).
 </p>
            <p>
 Du kannst deine Cookie-Einstellungen jederzeit über den Cookie-Banner auf unserer Website anpassen 
 oder deine Einwilligung widerrufen.
 </p>

            <h3 className="text-lg font-medium text-foreground mt-4">Kontaktformular</h3>
            <p>
 Wenn du uns per Kontaktformular Anfragen zukommen lassen, werden deine Angaben aus dem Formular inklusive 
 der von dir dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von 
 Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne deine Einwilligung weiter.
 </p>
            <p>
 Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern deine 
 Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher 
 Maßnahmen erforderlich ist.
 </p>

            <h3 className="text-lg font-medium text-foreground mt-4">Formspree (Kontaktformular-Dienstleister)</h3>
            <p>
 Zur Verarbeitung von Kontaktanfragen nutzen wir den Dienst Formspree (Formspree Inc., 2025 Shattuck Ave, Berkeley, CA 94704, USA).
 </p>
            <p>
 Wenn du das Kontaktformular auf unserer Website ausfüllen, werden deine eingegebenen Daten (Name, Telefonnummer, E-Mail, Betriebsname sowie weitere Angaben) an die Server von Formspree in den USA übertragen und dort verarbeitet.
 </p>
            <p>
 Formspree ist nach dem EU-US Data Privacy Framework zertifiziert. Die Übertragung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung).
 </p>
            <p>
              Datenschutzerklärung von Formspree:{" "}
              <a href="https://formspree.io/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
 formspree.io/legal/privacy-policy
 </a>
            </p>

            <h3 className="text-lg font-medium text-foreground mt-4">Aufbewahrungsdauer</h3>
            <p>
 Deine über das Kontaktformular übermittelten Daten werden gelöscht, sobald sie für den Zweck der Erhebung nicht mehr erforderlich sind. Dies ist in der Regel nach Abschluss oder Ablehnung der Zusammenarbeit der Fall, spätestens jedoch nach 24 Monaten.
 </p>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <h2 className="text-xl font-semibold text-foreground">4. Deine Rechte</h2>
            <p>Du hast jederzeit das Recht:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Auskunft über deine bei uns gespeicherten Daten zu erhalten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten zu verlangen (Art. 16 DSGVO)</li>
              <li>Löschung deiner Daten zu verlangen (Art. 17 DSGVO)</li>
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
 Diese Website wird bei Lovable gehostet (Lovable, betrieben durch Hibiscus Technologies, Inc.). Beim Aufruf werden technisch notwendige Verbindungsdaten (u. a. IP-Adresse, Zeitpunkt, abgerufene Seite) verarbeitet. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Die DNS-Verwaltung der Domain erfolgt über Cloudflare (Cloudflare, Inc., USA); dabei werden DNS-Anfragedaten verarbeitet.
 </p>
          </AnimatedSection>

          <AnimatedSection delay={0.35}>
            <h2 className="text-xl font-semibold text-foreground">6. Dienstleister und Auftragsverarbeitung</h2>
            
            <h3 className="text-lg font-medium text-foreground mt-4">Datenbank &amp; Backend (Lovable Cloud)</h3>
            <p>
 Anfrage- und Formulardaten (Name, Telefonnummer, E-Mail, Betriebsname und weitere Angaben) werden in der von Lovable bereitgestellten Cloud-Datenbank gespeichert und verarbeitet (technische Basis: Supabase). Rechtsgrundlage: Art. 6 Abs. 1 lit. b und f DSGVO. Soweit eine Übermittlung in ein Drittland erfolgt, geschieht dies auf Grundlage von Standardvertragsklauseln.
 </p>

            <h3 className="text-lg font-medium text-foreground mt-4">E-Mail-Postfach (STRATO)</h3>
            <p>
 Der Empfang und die Verarbeitung von Kontakt-E-Mails (u. a. über das info@-Postfach / Webmail) erfolgt über STRATO (STRATO AG, Otto-Ostrowski-Straße 7, 10249 Berlin). Rechtsgrundlage: Art. 6 Abs. 1 lit. b und f DSGVO.
 </p>

            <h3 className="text-lg font-medium text-foreground mt-4">Meta-Pixel (Facebook)</h3>
            <p>
              Diese Website nutzt das Besucheraktions-Pixel von Meta Platforms Ireland Ltd. (4 Grand Canal Square, Dublin 2, Irland). Damit kann das Verhalten von Besuchern nach Klick auf eine Meta-Werbeanzeige statistisch ausgewertet und für Remarketing genutzt werden. Der Einsatz erfolgt ausschließlich nach deiner Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), widerrufbar jederzeit mit Wirkung für die Zukunft. Eine Datenübermittlung in die USA ist möglich. Mehr:{" "}
              <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
 facebook.com/privacy/policy
 </a>
            </p>

            <h3 className="text-lg font-medium text-foreground mt-4">Stripe (Zahlungsabwicklung)</h3>
            <p>
              Für Zahlungen nutzen wir Stripe (Stripe Payments Europe Ltd., 1 Grand Canal Street Lower, Dublin, Irland). Dabei werden die erforderlichen Zahlungsdaten an Stripe übermittelt. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Mehr:{" "}
              <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
 stripe.com/de/privacy
 </a>
            </p>

            <h3 className="text-lg font-medium text-foreground mt-4">Resend (E-Mail-Versand)</h3>
            <p>
 Für Benachrichtigungs- und Transaktions-E-Mails nutzen wir Resend. Die Verarbeitung erfolgt in der Region eu-west-1 (Irland, EU). Verarbeitet werden die für den Versand nötigen Daten (E-Mail-Adresse, Inhalt). Rechtsgrundlage: Art. 6 Abs. 1 lit. b und f DSGVO.
 </p>

            <h3 className="text-lg font-medium text-foreground mt-4">KI-Chatassistent</h3>
            <p>
 Auf dieser Website bieten wir einen KI-gestützten Chat-Assistenten an. Deine eingegebenen Nachrichten werden zur Beantwortung an das KI-Gateway von Lovable (technische Basis: Google Gemini) übermittelt und verarbeitet. Zweck: Beantwortung von Anfragen und Anbahnung einer Geschäftsbeziehung. Rechtsgrundlage: Art. 6 Abs. 1 lit. a und f DSGVO. Eine Übermittlung in Drittländer (u.&nbsp;a. USA) ist möglich und erfolgt auf Grundlage von Standardvertragsklauseln. Gib im Chat keine sensiblen Daten ein. Übermittelst du über das Chat-Formular deine Kontaktdaten, verarbeiten wir diese zur Kontaktaufnahme.
 </p>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <h2 className="text-xl font-semibold text-foreground">7. SSL- bzw. TLS-Verschlüsselung</h2>
            <p>
 Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte 
 eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennst du daran, dass die 
 Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem Schloss-Symbol in deiner Browserzeile.
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
