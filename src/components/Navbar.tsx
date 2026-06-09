import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import { getTradeContext } from "@/lib/tradeContext";

const defaultNavItems = [
  { label: "Startseite", path: "/" },
  { label: "Leistungen", path: "/leistungen" },
  { label: "Über uns", path: "/ueber-uns" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Preise", path: "/preise" },
  { label: "Kontakt", path: "/kontakt" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const trade = getTradeContext(location.pathname);

  const navItems = trade
    ? [
        { label: `${trade.emoji} ${trade.label}`, path: trade.hubPath, highlight: true },
        { label: "Leistungen", path: "/handwerker/leistungen", highlight: false },
        { label: "Über uns", path: "/handwerker/ueber-uns", highlight: false },
        { label: "Portfolio", path: "/handwerker/portfolio", highlight: false },
        { label: "Preise", path: "/handwerker/preise", highlight: false },
        { label: "Kontakt", path: "/handwerker/kontakt", highlight: false },
      ]
    : defaultNavItems.map((i) => ({ ...i, highlight: false }));

  const ctaLabel = trade ? "Kostenlose Vorschau" : "Erstgespräch buchen";
  const ctaPath = trade ? "/handwerker/kontakt" : "/kontakt";

  return (
    <header role="banner" className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
      {trade && (
        <Link
          to="/handwerker/kontakt"
          className="block w-full text-center text-white text-xs sm:text-sm font-semibold py-2 px-4 hover:brightness-110 transition"
          style={{ background: "#F59E0B" }}
        >
          {trade.bannerText}
        </Link>
      )}
      <nav aria-label="Hauptnavigation" className="container-narrow flex items-center justify-between gap-6 h-[72px] px-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src={logo} alt="Meine Traum Webseite Logo" width={40} height={40} className="h-10 w-10 shrink-0" />
          <span className="font-heading text-base lg:text-lg font-bold gradient-text tracking-tight whitespace-nowrap">
            Meine Traum Webseite
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path + item.label}
                to={item.path}
                className={cn(
                  "text-[13px] font-medium tracking-wide whitespace-nowrap transition-colors hover:text-primary",
                  item.highlight ? "font-semibold" : "",
                  active && !item.highlight ? "text-primary" : !item.highlight ? "text-muted-foreground" : ""
                )}
                style={item.highlight ? { color: "#5B5FEF" } : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href="tel:+4961313076498"
            className="hidden xl:inline-flex items-center gap-1.5 text-[13px] font-semibold text-foreground whitespace-nowrap hover:text-primary transition-colors"
          >
            <Phone size={14} className="text-primary" />
            06131 30 764 98
          </a>
          <Button
            variant="gradient"
            size="sm"
            className="text-[13px] px-5 whitespace-nowrap"
            style={trade ? { background: "#5B5FEF", color: "#fff" } : undefined}
            asChild
          >
            <Link to={ctaPath}>{ctaLabel}</Link>
          </Button>
        </div>

        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Menü"
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div id="mobile-nav" className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border animate-fade-in">
          <div className="container-narrow px-4 py-6 flex flex-col gap-5">
            {navItems.map((item) => (
              <Link
                key={item.path + item.label}
                to={item.path}
                onClick={() => setOpen(false)}
                className={cn(
                  "text-sm font-medium py-1 transition-colors",
                  location.pathname === item.path || item.highlight
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
                style={item.highlight ? { color: "#5B5FEF" } : undefined}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="tel:+4961313076498"
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground"
              onClick={() => setOpen(false)}
            >
              <Phone size={14} className="text-primary" />
              06131 30 764 98
            </a>
            <Button
              variant="gradient"
              size="sm"
              style={trade ? { background: "#5B5FEF", color: "#fff" } : undefined}
              asChild
            >
              <Link to={ctaPath} onClick={() => setOpen(false)}>
                {ctaLabel}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
