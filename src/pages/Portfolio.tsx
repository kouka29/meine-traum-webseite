import { useState, useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import CTABanner from "@/components/CTABanner";
import DeviceMockup from "@/components/DeviceMockup";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, ArrowRight } from "lucide-react";
import { getCachedPortfolio, fetchPortfolio } from "@/lib/portfolioCache";
import techstartImg from "@/assets/portfolio/techstart.jpg";
import yogastudioImg from "@/assets/portfolio/yogastudio.jpg";
import digitalboostImg from "@/assets/portfolio/digitalboost.jpg";
import kanzleiImg from "@/assets/portfolio/kanzlei.jpg";
import fitlifeImg from "@/assets/portfolio/fitlife.jpg";
import greentechImg from "@/assets/portfolio/greentech.jpg";

const FALLBACK_IMAGES: Record<string, string> = {
  "TechStart GmbH": techstartImg,
  "Yoga Studio Flow": yogastudioImg,
  "DigitalBoost": digitalboostImg,
  "Kanzlei Weber": kanzleiImg,
  "FitLife Coaching": fitlifeImg,
  "GreenTech Solutions": greentechImg,
};

const fallbackProjects = [
  { id: "1", title: "TechStart GmbH", category: "SaaS Landing Page", description: "Conversion-optimierte Landing Page – Anfragen um 300% gesteigert in nur 8 Wochen.", result: "+300% Anfragen", image_url: techstartImg, external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
  { id: "2", title: "Yoga Studio Flow", category: "Branding & Webdesign", description: "Ganzheitlicher Markenauftritt – von 3 auf 20+ Anfragen pro Monat.", result: "+700% Neukunden", image_url: yogastudioImg, external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
  { id: "3", title: "DigitalBoost", category: "E-Commerce", description: "Online-Shop mit optimiertem Checkout – Umsatz um 180% gesteigert.", result: "+180% Umsatz", image_url: digitalboostImg, external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
  { id: "4", title: "Kanzlei Weber", category: "Corporate Website", description: "Vertrauensvolle Online-Präsenz – 5x mehr Mandantenanfragen über die Website.", result: "5x mehr Mandanten", image_url: kanzleiImg, external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
  { id: "5", title: "FitLife Coaching", category: "Personal Brand", description: "Persönliche Website mit Buchungssystem – Auslastung von 40% auf 95% gesteigert.", result: "95% Auslastung", image_url: fitlifeImg, external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
  { id: "6", title: "GreenTech Solutions", category: "Startup Website", description: "Investoren-fokussiertes Webdesign – erfolgreich Series A Funding gesichert.", result: "Funding gesichert", image_url: greentechImg, external_url: "", mockup_desktop_url: "", mockup_mobile_url: "" },
];

const Portfolio = () => {
  const [projects, setProjects] = useState(() => {
    const cached = getCachedPortfolio();
    if (cached && cached.length > 0) {
      return cached.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        description: p.description,
        result: p.result,
        image_url: p.image_url || FALLBACK_IMAGES[p.title] || "",
        external_url: p.external_url || "",
        mockup_desktop_url: p.mockup_desktop_url || "",
        mockup_mobile_url: p.mockup_mobile_url || "",
      }));
    }
    return fallbackProjects;
  });

  const normalizeUrl = (url: string) => {
    if (!url) return "";
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };

  useEffect(() => {
    let cancelled = false;
    fetchPortfolio().then(data => {
      if (cancelled || !data || data.length === 0) return;
      setProjects(data.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        description: p.description,
        result: p.result,
        image_url: p.image_url || FALLBACK_IMAGES[p.title] || "",
        external_url: p.external_url || "",
        mockup_desktop_url: p.mockup_desktop_url || "",
        mockup_mobile_url: p.mockup_mobile_url || "",
      })));
    });
    return () => { cancelled = true; };
  }, []);

  const normalizeImageSrc = (image_url: string): string => {
    if (!image_url) return "";
    if (/^https?:\/\//i.test(image_url)) {
      return image_url
        .replace("/storage/v1/render/image/public/", "/storage/v1/object/public/")
        .split("?")[0];
    }
    // bundled asset import (starts with / or data:) — use as-is
    if (image_url.startsWith("/") || image_url.startsWith("data:") || image_url.startsWith("blob:")) {
      return image_url;
    }
    const base = (import.meta.env.VITE_SUPABASE_URL as string) || "";
    return `${base}/storage/v1/object/public/portfolio-images/${image_url}`;
  };

  // Auto-screenshots for projects with URL but no image
  const [autoShots, setAutoShots] = useState<Record<string, string>>({});
  const [shotLoading, setShotLoading] = useState<Record<string, boolean>>({});

  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  useEffect(() => {
    let cancelled = false;
    projects.forEach((p) => {
      if (p.image_url) return;
      const ext = p.external_url;
      if (!ext) return;
      if (autoShots[p.id] || shotLoading[p.id]) return;
      setShotLoading((s) => ({ ...s, [p.id]: true }));
      supabase.functions
        .invoke("portfolio-screenshot", { body: { url: normalizeUrl(ext), key: p.id } })
        .then(({ data }) => {
          if (cancelled) return;
          if (data?.url) setAutoShots((m) => ({ ...m, [p.id]: data.url as string }));
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setShotLoading((s) => ({ ...s, [p.id]: false }));
        });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  return (
    <>
      <SEOHead
        title="Webdesign Portfolio & Referenzen | Meine Traum Webseite"
        description="Referenzen & Ergebnisse: Website-Projekte für Selbstständige, KMUs und Handwerksbetriebe – bis zu +700% mehr Anfragen durch conversion-optimiertes Design."
        path="/portfolio"
        breadcrumbs={[
          { name: "Start", url: "/" },
          { name: "Portfolio", url: "/portfolio" }
        ]}
      />
      <main id="main-content" className="pt-20">
      <section className="section-padding">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <div className="text-center mb-20 max-w-2xl mx-auto">
              <span className="badge-label bg-primary/10 text-primary mb-5">Portfolio & Referenzen</span>
              <h1 className="mb-5 text-balance">
                Webdesign-Referenzen –{" "}
                <span className="gradient-text">echte Ergebnisse für echte Unternehmen</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Keine Stockfotos, keine leeren Versprechen – sondern messbare Resultate von Unternehmen,
                die ihre Website erstellen lassen haben und jetzt mehr Kunden gewinnen.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {projects.map((p, i) => {
                const rawSrc = p.image_url || autoShots[p.id] || "";
                const imgSrc = normalizeImageSrc(rawSrc);
                const isLoadingShot = !p.image_url && !!p.external_url && !autoShots[p.id];
                const eager = i < 3;
                const imgAlt = `Webdesign-Referenz – ${p.title}, ${p.category}`;
                const card = (
                  <div className="group h-full w-full text-left bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col transition-all hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5">
                    {/* Mockup */}
                    <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 p-5">
                      <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border">
                        <div className="bg-muted h-6 flex items-center gap-1.5 px-2.5">
                          <span className="w-2 h-2 rounded-full bg-rose-400" />
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        </div>
                        {imgSrc ? (
                          <div className="overflow-hidden">
                            <img
                              src={imgSrc}
                              alt={imgAlt}
                              width={800}
                              height={450}
                              loading={eager ? "eager" : "lazy"}
                              {...(eager ? ({ fetchpriority: "high" } as Record<string, string>) : {})}
                              decoding="async"
                              className={`aspect-video w-full object-cover object-top ${reducedMotion ? "" : "group-hover:[object-position:50%_100%]"}`}
                              style={reducedMotion ? undefined : { transition: "object-position 9s linear" }}
                            />
                          </div>
                        ) : isLoadingShot ? (
                          <div className="aspect-video w-full bg-muted animate-pulse" />
                        ) : p.mockup_desktop_url ? (
                          <DeviceMockup desktopUrl={p.mockup_desktop_url} title={p.title} />
                        ) : (
                          <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 p-4 flex flex-col justify-end">
                            <div className="h-2 w-2/3 bg-foreground/20 rounded mb-2" />
                            <div className="h-1.5 w-1/2 bg-foreground/15 rounded mb-1" />
                            <div className="h-1.5 w-1/3 bg-foreground/15 rounded" />
                          </div>
                        )}
                      </div>
                      {p.external_url && (
                        <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-200">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 inline-flex items-center gap-2 rounded-full bg-card text-foreground px-4 py-2 text-sm font-semibold shadow-lg">
                            <ExternalLink className="w-4 h-4" aria-hidden={true} focusable={false} />
                            Live ansehen
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      {p.category && (
                        <span className="inline-flex self-start items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold mb-2">
                          {p.category}
                        </span>
                      )}
                      <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">{p.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 flex-1">
                        {p.description || `Individuelles ${p.category}-Projekt – konzipiert und umgesetzt von unserer Webdesign Agentur.`}
                      </p>
                      {p.external_url && (
                        <div className="flex items-center justify-end">
                          <span className="text-xs font-semibold text-primary inline-flex items-center gap-1 shrink-0">
                            Ansehen <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" aria-hidden={true} focusable={false} />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
                return (
                  <AnimatedSection key={p.id} delay={i * 0.08} className="h-full">
                    {p.external_url ? (
                      <a
                        href={normalizeUrl(p.external_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full"
                      >
                        {card}
                      </a>
                    ) : (
                      card
                    )}
                  </AnimatedSection>
                );
              })}
          </div>

          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-5 text-lg">
              Willst du ähnliche Ergebnisse? Lass deine Website von unserer Webdesign Agentur erstellen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gradient" size="lg" asChild>
                <Link to="/kontakt">Kostenlose Vorschau anfordern <ArrowRight size={18} aria-hidden={true} focusable={false} /></Link>
              </Button>
              <Button variant="outline-primary" size="lg" asChild>
                <Link to="/kostenloser-website-check">Kostenlosen Website-Check starten</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <CTABanner />
    </main>
    </>
  );
};

export default Portfolio;
