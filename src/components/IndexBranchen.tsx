import { Link } from "react-router-dom";
import {
  ArrowRight,
  Hammer,
  Zap,
  PaintRoller,
  Wrench,
  Home,
  Stethoscope,
  Building2,
  GraduationCap,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const branchen = [
  {
    name: "Handwerker",
    path: "/handwerker",
    icon: Hammer,
    text: "Mehr Aufträge & qualifizierte Anfragen für Ihren Handwerksbetrieb.",
  },
  {
    name: "Elektriker",
    path: "/elektriker",
    icon: Zap,
    text: "Webseiten, die Privat- und Gewerbekunden gezielt ansprechen.",
  },
  {
    name: "Maler & Lackierer",
    path: "/maler",
    icon: PaintRoller,
    text: "Hochwertige Referenz-Präsentation für mehr lukrative Projekte.",
  },
  {
    name: "Sanitär & Heizung (SHK)",
    path: "/sanitaer",
    icon: Wrench,
    text: "Notdienst-Anfragen und Sanierungs-Leads automatisch generieren.",
  },
  {
    name: "Dachdecker",
    path: "/dachdecker",
    icon: Home,
    text: "Sichtbar in Ihrer Region – mit Vertrauens-Booster für Hausbesitzer.",
  },
  {
    name: "Ärzte & Praxen",
    path: "/webdesign-aerzte",
    icon: Stethoscope,
    text: "Patienten-freundliche Praxis-Websites inkl. Online-Terminbuchung.",
  },
  {
    name: "Immobilienmakler",
    path: "/webdesign-immobilienmakler",
    icon: Building2,
    text: "Exposé-starke Websites, die Eigentümer und Käufer überzeugen.",
  },
  {
    name: "Coaches & Trainer",
    path: "/webdesign-coaches",
    icon: GraduationCap,
    text: "Positionierungs-Websites, die Ihre Expertise verkaufen.",
  },
];

const IndexBranchen = () => (
  <section className="section-padding bg-muted/30">
    <div className="container-narrow px-4">
      <AnimatedSection>
        <div className="max-w-2xl mb-12">
          <span className="badge-label bg-primary/10 text-primary mb-4">Branchen</span>
          <h2 className="mb-4">Webdesign für Ihre Branche</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Spezialisierte Landingpages mit branchenspezifischen Argumenten,
            Referenzen und Funktionen – damit Ihre Website genau die Kunden
            anzieht, die zu Ihnen passen.
          </p>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {branchen.map(({ name, path, icon: Icon, text }) => (
          <Link
            key={path}
            to={path}
            className="group relative flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-elegant transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Icon size={24} aria-hidden focusable={false} />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {text}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Mehr erfahren
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
                aria-hidden
                focusable={false}
              />
            </span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default IndexBranchen;