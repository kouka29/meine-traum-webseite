import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => (
  <footer className="bg-foreground text-background/80 section-padding">
    <div className="container-narrow px-4">
      {/* Mini CTA */}
      <div className="text-center mb-12 pb-12 border-b border-background/10">
        <p className="font-heading text-xl font-semibold text-background mb-4">
          Verlieren Sie keine Kunden mehr an Ihre Konkurrenz.
        </p>
        <Button
          size="sm"
          className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90"
          asChild
        >
          <Link to="/kontakt">
            Kostenlose Vorschau sichern <ArrowRight size={14} />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <h3 className="font-heading text-lg font-bold text-background mb-4">
            Meine Traum Webseite
          </h3>
          <p className="text-sm leading-relaxed">
            Wir erstellen Websites, die aktiv Kunden gewinnen – für Selbstständige, 
            Handwerker, Coaches und KMUs im gesamten DACH-Raum.
          </p>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-background mb-4">Navigation</h4>
          <ul className="space-y-2 text-sm">
            {[
              ["Startseite", "/"],
              ["Leistungen", "/leistungen"],
              ["Über uns", "/ueber-uns"],
              ["Referenzen", "/portfolio"],
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
          <p className="text-sm leading-relaxed mb-2">
            info@meinetraumwebseite.de<br />
            +49 123 456 789
          </p>
          <p className="text-xs text-background/50">
            Mo-Fr: 9:00 – 18:00 Uhr
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
