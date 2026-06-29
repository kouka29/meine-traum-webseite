import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-foreground text-background/70 section-padding">
    <div className="container-narrow px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-14 mb-16">
        <div>
          <h3 className="font-heading text-xl font-bold text-background mb-4 tracking-tight">
            Meine Traum Webseite
          </h3>
          <p className="text-sm leading-relaxed">
            Professionelle Webdesign Agentur – wir erstellen Websites, die aktiv Kunden gewinnen.
            Spezialisiert auf Handwerksbetriebe im DACH-Raum.
          </p>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-background mb-5 text-sm tracking-wide uppercase">Branchen</h4>
          <ul className="space-y-3 text-sm">
            {[
              ["Website für Handwerker", "/handwerker"],
              ["Website für Elektriker", "/elektriker"],
              ["Website für Maler", "/maler"],
              ["Website für Sanitärbetriebe", "/sanitaer"],
              ["Website für Dachdecker", "/dachdecker"],
              ["Website für Ärzte", "/webdesign-aerzte"],
              ["Website für Immobilienmakler", "/webdesign-immobilienmakler"],
              ["Website für Coaches", "/webdesign-coaches"],
            ].map(([label, path]) => (
              <li key={path}>
                <Link to={path} className="hover:text-background transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-background mb-5 text-sm tracking-wide uppercase">Navigation</h4>
          <ul className="space-y-3 text-sm">
            {[
              ["Startseite", "/"],
              ["Alle Leistungen", "/leistungen"],
              ["Webdesign Preise", "/webdesign-preise"],
              ["Über uns", "/ueber-uns"],
              ["Referenzen", "/portfolio"],
              ["Kontakt", "/kontakt"],
              ["Kostenloser Website-Check", "/kostenloser-website-check"],
            ].map(([label, path]) => (
              <li key={path}>
                <Link to={path} className="hover:text-background transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-background mb-5 text-sm tracking-wide uppercase">Kontakt</h4>
          <p className="text-sm leading-relaxed mb-3">
            info@meine-traum-webseite.de<br />
            06131/30 765 00
          </p>
          <p className="text-xs text-background/70 mb-6">
            Mo–Fr: 9:00 – 18:00 Uhr
          </p>
          <h4 className="font-heading font-semibold text-background mb-3 text-sm tracking-wide uppercase">Rechtliches</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/impressum" className="hover:text-background transition-colors">Impressum</Link>
            </li>
            <li>
              <Link to="/datenschutz" className="hover:text-background transition-colors">Datenschutzerklärung</Link>
            </li>
            <li>
              <Link to="/agb" className="hover:text-background transition-colors">AGB</Link>
            </li>
            <li>
              <Link to="/barrierefreiheit" className="hover:text-background transition-colors">Barrierefreiheit</Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
                className="hover:text-background transition-colors text-left"
              >
                Cookie-Einstellungen
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-background/70">
        <span>© {new Date().getFullYear()} Meine Traum Webseite – Webdesign Agentur. Alle Rechte vorbehalten.</span>
        <div className="flex gap-4">
          <Link to="/impressum" className="hover:text-background transition-colors">Impressum</Link>
          <Link to="/datenschutz" className="hover:text-background transition-colors">Datenschutz</Link>
          <Link to="/agb" className="hover:text-background transition-colors">AGB</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
