import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-foreground text-background/80 section-padding">
    <div className="container-narrow px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <h3 className="font-heading text-lg font-bold text-background mb-4">
            Meine Traum Webseite
          </h3>
          <p className="text-sm leading-relaxed">
            Wir erstellen moderne, professionelle Webseiten, die Kunden gewinnen und
            Ihr Unternehmen voranbringen.
          </p>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-background mb-4">Navigation</h4>
          <ul className="space-y-2 text-sm">
            {[
              ["Startseite", "/"],
              ["Leistungen", "/leistungen"],
              ["Über uns", "/ueber-uns"],
              ["Portfolio", "/portfolio"],
              ["Kontakt", "/kontakt"],
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
          <h4 className="font-heading font-semibold text-background mb-4">Kontakt</h4>
          <p className="text-sm leading-relaxed">
            info@meinetraumwebseite.de<br />
            +49 123 456 789
          </p>
        </div>
      </div>
      <div className="border-t border-background/20 pt-8 text-center text-xs">
        © {new Date().getFullYear()} Meine Traum Webseite. Alle Rechte vorbehalten.
      </div>
    </div>
  </footer>
);

export default Footer;
