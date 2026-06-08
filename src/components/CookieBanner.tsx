import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Settings, X } from "lucide-react";

type ConsentState = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
};

const CONSENT_KEY = "mtw_cookie_consent";

const getStoredConsent = (): ConsentState | null => {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const consent = getStoredConsent();
    if (!consent) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    const reopen = () => {
      const stored = getStoredConsent();
      setAnalytics(stored?.analytics ?? false);
      setMarketing(stored?.marketing ?? false);
      setShowDetails(true);
      setVisible(true);
    };
    window.addEventListener("open-cookie-settings", reopen);
    return () => window.removeEventListener("open-cookie-settings", reopen);
  }, []);

  const saveConsent = (consent: ConsentState) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    setVisible(false);
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    });
  };

  const acceptSelected = () => {
    saveConsent({
      necessary: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
    });
  };

  const rejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    });
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 bg-foreground/30 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-background rounded-2xl shadow-elevated border border-border p-6 md:p-8 animate-fade-up">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Shield size={20} className="text-primary" />
            </div>
            <h3 className="font-heading text-lg font-semibold">Cookie-Einstellungen</h3>
          </div>
          <button onClick={rejectAll} className="text-muted-foreground hover:text-foreground p-1" aria-label="Schließen">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Wir verwenden Cookies, um dir die bestmögliche Erfahrung auf unserer Website zu bieten. 
          Einige Cookies sind technisch notwendig, während andere uns helfen, die Website zu verbessern 
          und dir relevante Inhalte anzuzeigen. Du kannst deine Einwilligung jederzeit widerrufen.{" "}
          <a href="/datenschutz" className="text-primary underline underline-offset-2 hover:text-primary/80">
            Mehr erfahren
          </a>
        </p>

        {showDetails && (
          <div className="space-y-3 mb-5 p-4 rounded-xl bg-muted/50 border border-border">
            <label className="flex items-center gap-3 cursor-not-allowed">
              <input type="checkbox" checked disabled className="w-4 h-4 rounded accent-primary" />
              <div>
                <span className="text-sm font-medium">Notwendige Cookies</span>
                <p className="text-xs text-muted-foreground">Erforderlich für die Grundfunktionen der Website. Können nicht deaktiviert werden.</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="w-4 h-4 rounded accent-primary"
              />
              <div>
                <span className="text-sm font-medium">Analyse-Cookies</span>
                <p className="text-xs text-muted-foreground">Helfen uns zu verstehen, wie Besucher unsere Website nutzen (z. B. Seitenaufrufe, Verweildauer).</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="w-4 h-4 rounded accent-primary"
              />
              <div>
                <span className="text-sm font-medium">Marketing-Cookies</span>
                <p className="text-xs text-muted-foreground">Werden verwendet, um dir relevante Werbung und Inhalte anzuzeigen.</p>
              </div>
            </label>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="gradient" className="flex-1" onClick={acceptAll}>
            Alle akzeptieren
          </Button>
          {showDetails ? (
            <Button variant="outline-primary" className="flex-1" onClick={acceptSelected}>
              Auswahl speichern
            </Button>
          ) : (
            <Button
              variant="outline-primary"
              className="flex-1"
              onClick={() => setShowDetails(true)}
            >
              <Settings size={16} /> Einstellungen
            </Button>
          )}
          <Button variant="outline" className="flex-1" onClick={rejectAll}>
            Nur notwendige
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground mt-4 text-center">
          Gemäß DSGVO Art. 6 Abs. 1 lit. a und § 25 TDDDG (ehemals TTDSG) · 
          <a href="/impressum" className="underline underline-offset-2 hover:text-foreground ml-1">Impressum</a> · 
          <a href="/datenschutz" className="underline underline-offset-2 hover:text-foreground ml-1">Datenschutz</a>
        </p>
      </div>
    </div>
  );
};

export default CookieBanner;
