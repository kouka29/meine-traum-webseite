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
  HeartPulse,
  ShoppingBag,
  Truck,
  Cpu,
  Sparkles,
  Scissors,
  Smile,
  Car,
  Activity,
  Leaf,
  Heart,
  Sofa,
  Flower2,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const metaBranchen = [
  {
    name: "Handwerker",
    icon: Hammer,
    text: "Elektriker, Maler, SHK, Dachdecker & mehr – wählen Sie Ihr Gewerk.",
    cta: "Gewerk wählen",
    items: [
      { name: "Alle Handwerker", path: "/handwerker", icon: Hammer },
      { name: "Elektriker", path: "/elektriker", icon: Zap },
      { name: "Maler & Lackierer", path: "/maler", icon: PaintRoller },
      { name: "Sanitär & Heizung (SHK)", path: "/sanitaer", icon: Wrench },
      { name: "Dachdecker", path: "/dachdecker", icon: Home },
    ],
  },
  {
    name: "Gesundheit & Wellness",
    icon: HeartPulse,
    text: "Praxis-Websites, Studio-Portale und Online-Terminbuchung für Gesundheitsberufe.",
    cta: "Branche wählen",
    items: [
      { name: "Ärzte & Praxen", path: "/webdesign-aerzte", icon: Stethoscope },
      { name: "Fitness- & Yogastudios", path: "/fitness", icon: Dumbbell },
    ],
  },
  {
    name: "Beratung & Kanzleien",
    icon: Scale,
    text: "Vertrauen schaffende Websites für Coaches, Anwälte und Steuerberater.",
    cta: "Branche wählen",
    items: [
      { name: "Coaches & Trainer", path: "/webdesign-coaches", icon: GraduationCap },
      { name: "Anwälte & Steuerberater", path: "/kanzleien", icon: Scale },
    ],
  },
  {
    name: "Immobilien & Bau",
    icon: Building2,
    text: "Exposé-starke und technisch fundierte Websites für Makler und Ingenieure.",
    cta: "Branche wählen",
    items: [
      { name: "Immobilienmakler", path: "/webdesign-immobilienmakler", icon: Building2 },
      { name: "Ingenieure & Planer", path: "/ingenieure", icon: Cpu },
    ],
  },
  {
    name: "Gastronomie & Hotellerie",
    icon: UtensilsCrossed,
    text: "Speisekarten, Reservierungen, Lieferdienste und direkte Zimmerbuchungen – alles an einem Ort.",
    path: "/gastronomie",
  },
  {
    name: "Einzelhandel & Shops",
    icon: ShoppingBag,
    text: "Lokale Laden-Websites und Online-Shops, die verkaufen.",
    path: "/einzelhandel",
  },
  {
    name: "Dienstleistungen",
    icon: Truck,
    text: "Seriöse Auftritt-Websites für Reinigungs- und Logistikbetriebe.",
    cta: "Branche wählen",
    items: [
      { name: "Reinigungsdienstleister", path: "/reinigung", icon: Sparkles },
      { name: "Logistiker & Speditionen", path: "/logistik", icon: Truck },
    ],
  },
  {
    name: "Maßgeschneiderte Lösungen",
    icon: Sparkles,
    text: "Wir finden das passende Konzept für Ihre Branche – ganz individuell und professionell.",
    cta: "Branchen entdecken",
    items: [
      { name: "Friseure & Kosmetik", path: "/friseure", icon: Scissors },
      { name: "Zahnärzte & Kieferorthopäden", path: "/zahnaerzte", icon: Smile },
      { name: "Autohäuser & Kfz-Werkstätten", path: "/autohaeuser", icon: Car },
      { name: "Physiotherapeuten & Ergotherapeuten", path: "/physiotherapeuten", icon: Activity },
      { name: "Garten- & Landschaftsbau", path: "/gartenbau", icon: Leaf },
      { name: "Schreiner & Tischler", path: "/schreiner", icon: Sofa },
      { name: "Tierärzte", path: "/tieraerzte", icon: Heart },
      { name: "Floristen", path: "/floristen", icon: Flower2 },
    ],
  },
];

const PopoverCard = ({
  name,
  icon: Icon,
  text,
  cta,
  items,
}: {
  name: string;
  icon: typeof Hammer;
  text: string;
  cta: string;
  items: { name: string; path: string; icon: typeof Hammer }[];
}) => (
 <Popover>
    <PopoverTrigger asChild>
      <button
        type="button"
        className="group relative flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-elegant transition-all duration-300 text-left h-full"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
            <Icon size={24} aria-hidden focusable={false} />
          </div>
          <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-primary/10 text-primary shrink-0">
            {items.length} {items.length === 1 ? "Branche" : "Branchen"}
          </span>
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
          {cta}
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
        {name}
      </div>
      <div className="flex flex-col">
        {items.map(({ name: itemName, path, icon: ItemIcon }) => (
 <Link
            key={path}
            to={path}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted transition-colors text-sm text-foreground"
          >
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ItemIcon size={16} aria-hidden focusable={false} />
            </span>
            <span className="flex-1 font-medium">{itemName}</span>
            <ArrowRight size={16} className="text-muted-foreground" aria-hidden focusable={false} />
          </Link>
        ))}
      </div>
    </PopoverContent>
  </Popover>
);

const LinkCard = ({
  name,
  icon: Icon,
  text,
  path,
}: {
  name: string;
  icon: typeof Hammer;
  text: string;
  path: string;
}) => (
 <Link
    to={path}
    className="group relative flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-elegant transition-all duration-300 h-full"
  >
    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
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
);

const IndexBranchen = () => (
 <section id="branchen" className="section-padding bg-muted/30 scroll-mt-24">
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
        {metaBranchen.map((branche) =>
 "items" in branche && branche.items ? (
 <PopoverCard
              key={branche.name}
              name={branche.name}
              icon={branche.icon}
              text={branche.text}
              cta={branche.cta ?? "Branche wählen"}
              items={branche.items}
            />
 ) : (
 <LinkCard
              key={branche.name}
              name={branche.name}
              icon={branche.icon}
              text={branche.text}
              path={branche.path!}
            />
          )
        )}
      </div>
    </div>
  </section>
);

export default IndexBranchen;
