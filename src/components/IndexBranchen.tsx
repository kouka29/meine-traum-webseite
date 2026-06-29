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
  ChevronDown,
  UtensilsCrossed,
  Scale,
  Dumbbell,
  BedDouble,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const handwerksGewerke = [
  { name: "Alle Handwerker", path: "/handwerker", icon: Hammer },
  { name: "Elektriker", path: "/elektriker", icon: Zap },
  { name: "Maler & Lackierer", path: "/maler", icon: PaintRoller },
  { name: "Sanitär & Heizung (SHK)", path: "/sanitaer", icon: Wrench },
  { name: "Dachdecker", path: "/dachdecker", icon: Home },
];

const branchen = [
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
  {
    name: "Gastronomie & Restaurants",
    path: "/kontakt?branche=gastronomie",
    icon: UtensilsCrossed,
    text: "Speisekarten, Reservierungen und Lieferdienst-Anbindung – appetitlich präsentiert.",
  },
  {
    name: "Anwälte & Steuerberater",
    path: "/kontakt?branche=kanzleien",
    icon: Scale,
    text: "Seriöse Kanzlei-Websites, die Mandanten Vertrauen und Kompetenz signalisieren.",
  },
  {
    name: "Fitness- & Yogastudios",
    path: "/kontakt?branche=fitness",
    icon: Dumbbell,
    text: "Studio-Websites mit Kursplan, Probetraining und Online-Anmeldung.",
  },
  {
    name: "Hotels & Pensionen",
    path: "/kontakt?branche=hotellerie",
    icon: BedDouble,
    text: "Direktbuchungen statt Portal-Provision – mit emotionalen Bildwelten.",
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
        {/* Handwerker-Card mit Popover für die Gewerke */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="group relative flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-elegant transition-all duration-300 text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Hammer size={24} aria-hidden focusable={false} />
                </div>
                <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                  5 Gewerke
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">
                  Handwerker
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Elektriker, Maler, SHK, Dachdecker & mehr – wählen Sie Ihr Gewerk.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Gewerk wählen
                <ChevronDown
                  size={16}
                  className="transition-transform group-data-[state=open]:rotate-180"
                  aria-hidden
                  focusable={false}
                />
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 p-2">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Handwerks-Gewerke
            </div>
            <div className="flex flex-col">
              {handwerksGewerke.map(({ name, path, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted transition-colors text-sm text-foreground"
                >
                  <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon size={16} aria-hidden focusable={false} />
                  </span>
                  <span className="flex-1 font-medium">{name}</span>
                  <ArrowRight size={14} className="text-muted-foreground" aria-hidden focusable={false} />
                </Link>
              ))}
            </div>
          </PopoverContent>
        </Popover>

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