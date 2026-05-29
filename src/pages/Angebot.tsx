import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Lock, Shield, Clock, Sparkles, CheckCircle2, Eye, Loader2, X, CheckCheck, AlertTriangle, Check as CheckIcon, ChevronRight, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import logo from "@/assets/logo.png";
import CheckoutFunnel, { type FunnelAddon, type PaymentConfig } from "@/components/angebot/CheckoutFunnel";

const BRAND = "#4F3FF0";
const BRAND_GRADIENT = "linear-gradient(135deg, #4F3FF0, #7B5EF8)";
const TEXT_DARK = "#1E1B4B";
const TEXT_MUTED = "#6B7280";
const BG_SOFT = "#F5F4FF";

interface Leistung { emoji: string; titel: string; beschreibung: string; }
interface Faq { frage: string; antwort: string; }
interface AngebotOption {
  id: string;
  emoji?: string;
  titel: string;
  beschreibung?: string;
  preis: number;
  preis_typ?: "einmalig" | "monatlich";
  stripe_link?: string;
}
interface AngebotBundle {
  id: string;
  label?: string;
  option_ids: string[];
  gesamt_preis?: number | null;
  stripe_link: string;
}

interface AngebotPaket {
  id: string;
  name: string;
  badge?: string;
  beschreibung?: string;
  preis: number;
  normalpreis?: number | null;
  miete_monatlich?: number | null;
  anzahlung?: number | null;
  stripe_link: string;
  leistungen: Leistung[];
  optionen?: AngebotOption[];
}

interface AngebotData {
  v: number;
  lead_name: string;
  lead_email: string;
  branche?: string;
  nachricht: string;
  pin: string;
  preis: number;
  normalpreis: number | null;
  miete_monatlich?: number | null;
  anzahlung?: number | null;
  wachstumspaket_preis?: number | null;
  wachstumspaket_beschreibung?: string | null;
  ablauf_datum: string;
  stripe_link: string;
  leistungen: Leistung[];
  faqs: Faq[];
  optionen?: AngebotOption[];
  bundles?: AngebotBundle[];
  pakete?: AngebotPaket[];
  pdf_path?: string | null;
  payment_method?: "stripe" | "rechnung";
  angebots_id?: string;
  addons?: FunnelAddon[];
  payment_config?: PaymentConfig;
}

function decodeBase64Utf8(b64: string): unknown {
  const json = decodeURIComponent(escape(atob(b64)));
  return JSON.parse(json);
}

function useCountdown(targetIso: string) {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return { diff, days, hours, mins, secs };
}

function pad(n: number) { return String(n).padStart(2, "0"); }

/** Inject Plus Jakarta Sans once. */
function useJakartaFont() {
  useEffect(() => {
    const id = "pjs-font";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
  }, []);
}

export default function Angebot() {
  useJakartaFont();
  const routeParams = useParams();
  const [params] = useSearchParams();
  const d = params.get("d");
  const s = routeParams.shortId || params.get("s") || params.get("id");
  const previewMode = params.get("preview") === "1";

  const [resolvedB64, setResolvedB64] = useState<string | null>(d);
  const [loadingShort, setLoadingShort] = useState<boolean>(!!s && !d);
  const [shortError, setShortError] = useState<string | null>(null);

  useEffect(() => {
    if (!s || d) return;
    let cancelled = false;
    (async () => {
      setLoadingShort(true);
      const cleanShortId = s.trim().replace(/^\?+|^s=/i, "").trim();
      const { data: res, error } = await supabase.functions.invoke("admin-leads", {
        body: { action: "angebot-get-by-short-id", short_id: cleanShortId },
      });
      if (cancelled) return;
      if (error || res?.error || !res?.base64_data) {
        setShortError(res?.error || error?.message || "Angebot nicht gefunden");
      } else {
        setResolvedB64(res.base64_data);
      }
      setLoadingShort(false);
    })();
    return () => { cancelled = true; };
  }, [s, d]);

  const data: AngebotData | null = useMemo(() => {
    if (!resolvedB64) return null;
    try {
      const parsed = decodeBase64Utf8(resolvedB64);
      if (parsed && typeof parsed === "object") return parsed as AngebotData;
      return null;
    } catch {
      return null;
    }
  }, [resolvedB64]);

  const [unlocked, setUnlocked] = useState(previewMode);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  if (loadingShort) {
    return (
      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: "100vh", background: BG_SOFT, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: TEXT_MUTED }}>
          <Loader2 size={20} className="animate-spin" /> Angebot wird geladen…
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: "100vh", background: BG_SOFT, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 40, maxWidth: 480, textAlign: "center", boxShadow: "0 10px 40px rgba(79,63,240,0.1)" }}>
          <h1 style={{ color: TEXT_DARK, fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Ungültiger Link</h1>
          <p style={{ color: TEXT_MUTED }}>{shortError || "Dieser Angebot-Link ist nicht gültig. Bitte prüfen Sie die URL oder kontaktieren Sie uns."}</p>
        </div>
      </div>
    );
  }

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === data.pin) {
      setUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: "100vh", background: "#fff", color: TEXT_DARK }}>
      {previewMode && (
        <div style={{
          position: "sticky", top: 0, zIndex: 9998,
          background: "#FEF3C7", color: "#92400E",
          padding: "10px 16px", textAlign: "center",
          fontSize: 13, fontWeight: 600,
          borderBottom: "1px solid #FCD34D",
        }}>
          <Eye size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "-2px" }} />
          Vorschau-Modus — so wird der Kunde das Angebot sehen
        </div>
      )}
      {!unlocked && <PinGate pinInput={pinInput} setPinInput={setPinInput} error={pinError} onSubmit={handlePinSubmit} />}
      {unlocked && <AngebotPage data={data} />}
    </div>
  );
}

function PinGate({ pinInput, setPinInput, error, onSubmit }: {
  pinInput: string;
  setPinInput: (v: string) => void;
  error: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: BG_SOFT,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <form onSubmit={onSubmit} style={{
        background: "#fff", borderRadius: 20, padding: "48px 40px",
        maxWidth: 480, width: "100%",
        boxShadow: "0 20px 60px rgba(79,63,240,0.15)",
        border: "1px solid rgba(79,63,240,0.1)",
        textAlign: "center",
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: `${BRAND}15`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
        }}>
          <Lock size={28} color={BRAND} />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: TEXT_DARK, marginBottom: 8 }}>
          Ihr persönliches Angebot wartet auf Sie
        </h1>
        <p style={{ color: TEXT_MUTED, marginBottom: 28, fontSize: 15 }}>
          Bitte geben Sie Ihren persönlichen Zugangscode ein.
        </p>
        <input
          type="password"
          inputMode="numeric"
          maxLength={5}
          autoFocus
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value.replace(/\D/g, "").slice(0, 5))}
          placeholder="•••••"
          style={{
            width: "100%", padding: "16px 20px",
            fontSize: 24, textAlign: "center", letterSpacing: "0.5em",
            border: `2px solid ${error ? "#EF4444" : "rgba(79,63,240,0.2)"}`,
            borderRadius: 12, outline: "none",
            fontFamily: "inherit", fontWeight: 700, color: TEXT_DARK,
            marginBottom: 16,
          }}
        />
        {error && (
          <p style={{ color: "#EF4444", fontSize: 14, marginBottom: 16 }}>
            Ungültiger Code. Bitte prüfen Sie Ihren Zugangscode.
          </p>
        )}
        <button
          type="submit"
          style={{
            width: "100%", padding: "14px 24px",
            background: BRAND_GRADIENT, color: "#fff",
            fontSize: 16, fontWeight: 700,
            border: "none", borderRadius: 50,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Angebot anzeigen →
        </button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 20, color: TEXT_MUTED, fontSize: 12 }}>
          <Shield size={12} /> SSL-verschlüsselt · Vertraulich
        </div>
      </form>
    </div>
  );
}

function AngebotPage({ data }: { data: AngebotData }) {
  const { diff, days, hours, mins, secs } = useCountdown(data.ablauf_datum);
  const expired = diff <= 0;

  const [showSticky, setShowSticky] = useState(false);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // ─── Pakete: Multi-Paket-Auswahl (wenn mehr als 1 Paket) ───
  const pakete = data.pakete ?? [];
  const hasMultiplePakete = pakete.length > 1;
  const [selectedPaketId, setSelectedPaketId] = useState<string>(pakete[0]?.id || "");
  const selectedPaket = hasMultiplePakete
    ? pakete.find((p) => p.id === selectedPaketId) ?? pakete[0]
    : pakete[0] || null;

  // Aktive Werte: Paket-Werte bevorzugen, sonst Top-Level-Daten
  const aktivePreis = selectedPaket?.preis ?? data.preis;
  const aktiverNormalpreis = selectedPaket?.normalpreis ?? data.normalpreis;
  const aktiveLeistungen = selectedPaket?.leistungen ?? data.leistungen;
  const aktiveOptionen = selectedPaket?.optionen ?? data.optionen ?? [];
  const aktiverStripeLink = selectedPaket?.stripe_link || data.stripe_link || "";
  const aktiveMiete = selectedPaket?.miete_monatlich ?? data.miete_monatlich;

  const bundles = data.bundles ?? [];

  // Wenn das Paket wechselt: Optionen-Auswahl zurücksetzen
  useEffect(() => {
    setSelectedOptionIds([]);
  }, [selectedPaketId]);

  const toggleOption = (id: string) =>
    setSelectedOptionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const selectedOptions = aktiveOptionen.filter((o) => selectedOptionIds.includes(o.id));
  const matchedBundle = selectedOptions.length >= 2
    ? bundles.find((b) =>
        b.option_ids.length === selectedOptions.length &&
        b.option_ids.every((id) => selectedOptionIds.includes(id))
      )
    : null;

  let ctaLink: string | null = aktiverStripeLink || null;
  let ctaMode: "haupt" | "option" | "bundle" | "anfrage" = "haupt";
  let ctaLabel = "Angebot annehmen & starten →";

  if (selectedOptions.length === 1) {
    const single = selectedOptions[0];
    if (single.stripe_link) {
      ctaLink = single.stripe_link;
      ctaMode = "option";
      ctaLabel = "Angebot annehmen & starten →";
    } else {
      ctaLink = null;
      ctaMode = "anfrage";
      ctaLabel = "Auswahl auf Anfrage →";
    }
  } else if (selectedOptions.length >= 2) {
    if (matchedBundle) {
      ctaLink = matchedBundle.stripe_link;
      ctaMode = "bundle";
      ctaLabel = "Angebot annehmen & starten →";
    } else {
      ctaLink = null;
      ctaMode = "anfrage";
      ctaLabel = "Auswahl auf Anfrage →";
    }
  }

  const isRechnung = data.payment_method === "rechnung";
  if (isRechnung && ctaMode !== "anfrage") {
    ctaLink = null;
    ctaLabel = "Jetzt verbindlich beauftragen →";
  }

  const einmaligeZusatz = selectedOptions
    .filter((o) => (o.preis_typ ?? "einmalig") === "einmalig")
    .reduce((sum, o) => sum + o.preis, 0);
  const monatlicheZusatz = selectedOptions
    .filter((o) => o.preis_typ === "monatlich")
    .reduce((sum, o) => sum + o.preis, 0);
  const anzeigeGesamt = matchedBundle?.gesamt_preis ?? (aktivePreis + einmaligeZusatz);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setShowSticky(docHeight > 0 && scrollTop / docHeight > 0.25);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ablaufDate = new Date(data.ablauf_datum);
  const ablaufStr = ablaufDate.toLocaleString("de-DE", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  if (expired) return <ExpiredOverlay />;

  const buildPositions = (): { titel: string; preis: number }[] => {
    if (matchedBundle?.gesamt_preis) {
      return [{ titel: `Bundle: ${matchedBundle.label || "Gesamtpaket"}`, preis: matchedBundle.gesamt_preis }];
    }
    const list: { titel: string; preis: number }[] = [
      { titel: selectedPaket?.name ? `Paket: ${selectedPaket.name}` : "Webseiten-Angebot (Hauptleistung)", preis: aktivePreis },
    ];
    for (const o of selectedOptions) {
      if ((o.preis_typ ?? "einmalig") === "einmalig") list.push({ titel: o.titel, preis: o.preis });
    }
    return list;
  };

  const openBooking = () => setBookingOpen(true);

  const showProblemSection = !!(data.lead_name && data.branche);

  // ─── Preis-Modus (Kauf / Miete) ──────────────────────
  const hasMiete = !!(aktiveMiete && aktiveMiete > 0);
  const [priceMode, setPriceMode] = useState<"kauf" | "miete">(hasMiete ? "miete" : "kauf");
  useEffect(() => {
    setPriceMode(hasMiete ? "miete" : "kauf");
  }, [hasMiete, selectedPaketId]);

  // ─── Checkout-Funnel ──────────────────────────────────
  const [funnelOpen, setFunnelOpen] = useState(false);
  const [funnelPaketId, setFunnelPaketId] = useState<string | null>(null);
  const funnelPaket = funnelPaketId
    ? pakete.find((p) => p.id === funnelPaketId) ?? selectedPaket
    : selectedPaket;

  const openFunnel = (paketId: string) => {
    setFunnelPaketId(paketId);
    setSelectedPaketId(paketId);
    setFunnelOpen(true);
  };

  const funnelAddons: FunnelAddon[] = data.addons ?? [];
  const funnelPaymentConfig: PaymentConfig = data.payment_config ?? {
    kauf: { enabled: true, mode: data.anzahlung ? "deposit" : "full", deposit_percent: data.anzahlung ? Math.round((Number(data.anzahlung) / Number(funnelPaket?.preis || data.preis)) * 100) : undefined },
    miete: funnelPaket?.miete_monatlich ? { enabled: true, monthly_cents: Math.round(Number(funnelPaket.miete_monatlich) * 100), min_months: 12 } : { enabled: false, monthly_cents: 0 },
  };

  return (
    <div style={{ position: "relative", paddingBottom: showSticky ? "var(--angebot-sticky-space)" : 0 }}>
      <AngebotGlobalStyles />
      {/* Standalone Header: nur Logo, kein Link */}
      <header style={{
        background: "#fff",
        borderBottom: "1px solid rgba(79,63,240,0.08)",
        padding: "14px 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <img src={logo} alt="Meine Traum Webseite" width={36} height={36} style={{ display: "block" }} />
          <span style={{ fontWeight: 800, color: TEXT_DARK, fontSize: 15, letterSpacing: "-0.01em" }}>
            Meine Traum Webseite
          </span>
        </div>
      </header>

      {/* ── SECTION 1: HERO ───────────────────────────────── */}
      <HeroSection
        leadName={data.lead_name}
        nachricht={data.nachricht}
        ablaufStr={ablaufStr}
        days={days} hours={hours} mins={mins} secs={secs}
      />

      {/* ── SECTION 2: PROBLEM / LÖSUNG ──────────────────── */}
      {showProblemSection && <ProblemSection />}

      {/* Divider between Problem & Paket */}
      {showProblemSection && <SectionDivider />}

      {/* ── SECTION 3: PAKET-AUSWAHL (nur bei mehreren) ──── */}
      {hasMultiplePakete && (
        <PaketChooserSection
          pakete={pakete}
          selectedPaketId={selectedPaketId}
          setSelectedPaketId={setSelectedPaketId}
          onChoose={openFunnel}
        />
      )}

      {/* ── SECTION 4: LEISTUNGEN ────────────────────────── */}
      {!hasMultiplePakete && <LeistungenSection leistungen={aktiveLeistungen} />}

      {/* ── SECTION 5: VERTRAUEN (vor Preis!) ────────────── */}
      <TrustSection />

      {/* Divider between Trust & Timeline */}
      <SectionDivider />

      {/* ── SECTION 6: SO LÄUFT ES AB ────────────────────── */}
      <TimelineSection />

      {/* ── SECTION 7: PREIS (Kauf / Miete) ──────────────── */}
      <PriceSection
        preis={aktivePreis}
        normalpreis={aktiverNormalpreis}
        miete={aktiveMiete}
        anzahlung={data.anzahlung ?? null}
        priceMode={priceMode}
        setPriceMode={setPriceMode}
        hasMiete={hasMiete}
        optionen={aktiveOptionen}
        selectedOptionIds={selectedOptionIds}
        toggleOption={toggleOption}
        anzeigeGesamt={anzeigeGesamt}
        monatlicheZusatz={monatlicheZusatz}
        einmaligeZusatz={einmaligeZusatz}
        selectedOptionsCount={selectedOptions.length}
        matchedBundle={matchedBundle}
        isRechnung={isRechnung}
        ctaModeAnfrage={ctaMode === "anfrage"}
      />

      {/* ── SECTION 8: FAQs ──────────────────────────────── */}
      {(() => {
        const displayFaqs = resolveFaqs(data.faqs, hasMiete);
        if (displayFaqs.length === 0) return null;
        return (
        <section style={{ padding: "clamp(48px, 8vw, 80px) 24px", background: "#F8F7FF" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: TEXT_DARK, marginBottom: 12, textAlign: "center", letterSpacing: "-0.025em", lineHeight: 1.12 }}>
              Häufige <span style={{ background: "linear-gradient(135deg,#4F3FF0 0%,#7B5EF8 50%,#5B8DEF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Fragen</span>
            </h2>
            <p style={{ fontSize: 18, color: TEXT_MUTED, textAlign: "center", marginBottom: 48, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
              Alles was Sie wissen möchten — bevor Sie den nächsten Schritt gehen.
            </p>
            <Accordion type="single" collapsible defaultValue="faq-0" className="angebot-faq-accordion">
              {displayFaqs.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="angebot-faq-item border bg-white"
                >
                  <AccordionTrigger className="angebot-faq-trigger text-left hover:no-underline" style={{ color: TEXT_DARK, fontFamily: "inherit", fontSize: 16, fontWeight: 600 }}>
                    {f.frage}
                  </AccordionTrigger>
                  <AccordionContent className="angebot-faq-content" style={{ color: TEXT_MUTED, fontSize: 15, lineHeight: 1.7, fontFamily: "inherit" }}>
                    {f.antwort}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <style>{`
              .angebot-faq-accordion .angebot-faq-item {
                background: #fff !important;
                border: 1px solid rgba(79,63,240,0.1) !important;
                border-radius: 14px !important;
                margin-bottom: 8px !important;
                padding: 4px 24px !important;
                transition: all 0.2s ease;
              }
              .angebot-faq-accordion .angebot-faq-item[data-state="open"] {
                border-color: rgba(79,63,240,0.3) !important;
                box-shadow: 0 2px 12px rgba(79,63,240,0.08);
              }
              .angebot-faq-accordion .angebot-faq-trigger {
                padding: 18px 0 !important;
              }
              .angebot-faq-accordion .angebot-faq-trigger svg {
                color: #4F3FF0 !important;
                transition: transform 200ms ease;
              }
              .angebot-faq-accordion .angebot-faq-content > div {
                padding-top: 12px !important;
                padding-bottom: 18px !important;
                border-top: 1px solid rgba(79,63,240,0.08);
                margin-top: 4px;
              }
            `}</style>
          </div>
        </section>
        );
      })()}

      {/* ── SECTION 9: FINALER CTA ───────────────────────── */}
      <FinalCtaSection
        ctaLink={ctaLink}
        ctaLabel={ctaLabel}
        ctaMode={ctaMode}
        isRechnung={isRechnung}
        openBooking={openBooking}
        selectedOptions={selectedOptions}
        leadName={data.lead_name}
      />

      {/* ── STICKY BOTTOM BAR ────────────────────────────── */}
      {showSticky && (
        <StickyBar
          paketName={selectedPaket?.name || data.branche || "Ihr Angebot"}
          preis={anzeigeGesamt}
          miete={aktiveMiete}
          priceMode={priceMode}
          days={days}
          ctaLink={ctaLink}
          isRechnung={isRechnung}
          ctaMode={ctaMode}
          openBooking={openBooking}
        />
      )}

      {bookingOpen && !bookingSuccess && (
        <BookingModal
          data={data}
          positions={buildPositions()}
          onClose={() => setBookingOpen(false)}
          onSuccess={(nr) => setBookingSuccess(nr)}
        />
      )}
      {bookingSuccess && (
        <BookingSuccessOverlay auftragsNr={bookingSuccess} onClose={() => { setBookingSuccess(null); setBookingOpen(false); }} />
      )}

      {funnelPaket && (
        <CheckoutFunnel
          open={funnelOpen}
          onClose={() => setFunnelOpen(false)}
          paket={{
            id: funnelPaket.id,
            name: funnelPaket.name,
            preis: Number(funnelPaket.preis),
            miete_monatlich: funnelPaket.miete_monatlich ? Number(funnelPaket.miete_monatlich) : null,
          }}
          pakete={pakete.map((p) => ({
            id: p.id,
            name: p.name,
            preis: Number(p.preis),
            miete_monatlich: p.miete_monatlich ? Number(p.miete_monatlich) : null,
          }))}
          addons={funnelAddons}
          paymentConfig={funnelPaymentConfig}
          angebots_id={data.angebots_id}
          leadEmail={data.lead_email}
          leadName={data.lead_name}
          stripeLink={funnelPaket.stripe_link || data.stripe_link || null}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION COMPONENTS
// ═══════════════════════════════════════════════════════════

function HeroSection({ leadName, nachricht, ablaufStr, days, hours, mins, secs }: {
  leadName: string; nachricht: string; ablaufStr: string;
  days: number; hours: number; mins: number; secs: number;
}) {
  return (
    <section style={{
      position: "relative", overflow: "hidden",
      background: "linear-gradient(135deg, #F5F4FF 0%, #EEF2FF 40%, #F0F4FF 70%, #E8F4FF 100%)",
      padding: "clamp(64px, 10vw, 110px) 20px clamp(56px, 8vw, 90px)",
    }}>
      {/* Geometrische Deko-Elemente — wie Hauptseite */}
      <div aria-hidden className="ang-hero-deco">
        <div className="ang-deco-circle-lg" />
        <div className="ang-deco-circle-md" />
        <div className="ang-deco-dot ang-deco-dot-1" />
        <div className="ang-deco-dot ang-deco-dot-2" />
        <div className="ang-deco-circle-bl" />
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 860 }}>
        <div className="ang-reveal ang-d-3" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(244,67,54,0.08)", color: "#E53935",
          padding: "6px 16px", borderRadius: 20,
          fontSize: 12, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.06em",
          marginBottom: 28,
        }}>
          Persönliches Angebot — nur für Sie
        </div>

        <h1 className="ang-reveal ang-d-4" style={{
          fontSize: "clamp(42px, 6.5vw, 72px)", fontWeight: 800, lineHeight: 1.05,
          color: TEXT_DARK, marginBottom: 24, letterSpacing: "-0.025em",
          maxWidth: 800,
        }}>
          Hallo {leadName},<br />hier ist Ihr{" "}
          <span style={{
            background: "linear-gradient(135deg, #4F3FF0 0%, #7B5EF8 50%, #5B8DEF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            maßgeschneidertes
          </span>{" "}
          Angebot.
        </h1>

        <p className="ang-reveal ang-d-5" style={{
          fontSize: 18, color: TEXT_MUTED, lineHeight: 1.7,
          marginBottom: 36, maxWidth: 640,
        }}>
          {nachricht && nachricht.trim()
            ? nachricht
            : "Schön, dass wir uns kennenlernen durften. Dieses Angebot haben wir speziell für Sie und Ihr Unternehmen zusammengestellt — kein Standard, sondern genau das, was wir gemeinsam besprochen haben."}
        </p>

        {/* Countdown — Inline, kein Kasten */}
        <div className="ang-reveal ang-d-6 ang-count-wrap" style={{ maxWidth: 640, marginBottom: 28 }}>
          <div className="ang-count-pill">
            <Clock size={14} color="#4F3FF0" strokeWidth={2.5} />
            <span>Reserviert bis <strong>{ablaufStr}</strong></span>
          </div>
          <div className="ang-count-row">
            <div className="ang-count-glow" aria-hidden="true" />
            {[
              { v: days, l: "TAGE" },
              { v: hours, l: "STD" },
              { v: mins, l: "MIN" },
              { v: secs, l: "SEK" },
            ].flatMap((b, idx, arr) => {
              const block = (
                <div key={b.l} className="ang-count-block">
                  <div className="ang-count-card">
                    <span className="ang-count-num">{pad(b.v)}</span>
                  </div>
                  <div className={`ang-count-lab${b.l === "SEK" ? " is-live" : ""}`}>{b.l}</div>
                </div>
              );
              if (idx < arr.length - 1) {
                return [block, <span key={`sep-${idx}`} className="ang-count-sep" aria-hidden="true"><i /><i /></span>];
              }
              return [block];
            })}
          </div>
          <div style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.5, marginTop: 18 }}>
            Danach wird die Kapazität neu vergeben — und der Preis neu kalkuliert.
          </div>
        </div>

        {/* Zahlmodell-Optionen */}
        <div className="ang-reveal ang-d-7" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 14px", borderRadius: 12,
              background: "#fff", border: `1px solid ${BRAND}20`,
              fontSize: 13, color: TEXT_DARK, fontWeight: 600,
              boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
            }}>
              <span aria-hidden="true">💳</span>
              <strong style={{ color: BRAND, fontWeight: 700 }}>Einmalkauf</strong>
              <span style={{ color: TEXT_MUTED, fontWeight: 500 }}>— Website gehört Ihnen</span>
            </span>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 14px", borderRadius: 12,
              background: "#fff", border: `1px solid ${BRAND}20`,
              fontSize: 13, color: TEXT_DARK, fontWeight: 600,
              boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
            }}>
              <span aria-hidden="true">📅</span>
              <strong style={{ color: BRAND, fontWeight: 700 }}>Mietmodell</strong>
              <span style={{ color: TEXT_MUTED, fontWeight: 500 }}>— monatliche Rate, jederzeit kündbar</span>
            </span>
          </div>
          <div style={{ fontSize: 13, color: TEXT_MUTED, fontStyle: "italic" }}>
            Sie entscheiden nach dem Erstgespräch — wir beraten Sie ehrlich.
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems = [
    { titel: "Unsichtbar bei Google", text: "Kunden finden Ihre Mitbewerber — nicht Sie." },
    { titel: "Kein Vertrauen auf den ersten Blick", text: "Interessenten springen ab, bevor sie überhaupt anrufen." },
    { titel: "Kein System für neue Anfragen", text: "Aufträge kommen per Zufall — nicht planbar." },
  ];
  return (
    <section style={{ padding: "clamp(48px, 8vw, 80px) 16px", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: TEXT_DARK, marginBottom: 48, textAlign: "center", letterSpacing: "-0.025em", lineHeight: 1.12 }}>
          Was Ihr Unternehmen gerade <span style={{ background: "linear-gradient(135deg,#4F3FF0 0%,#7B5EF8 50%,#5B8DEF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>kostet</span><br />ohne professionelle Website
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {problems.map((p, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 20,
              border: "1px solid rgba(79,63,240,0.1)",
              padding: 28,
              boxShadow: "0 4px 24px rgba(79,63,240,0.06)",
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "#FEE2E2", color: "#DC2626",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 16,
              }}>
                <AlertTriangle size={20} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: TEXT_DARK, marginBottom: 8 }}>{p.titel}</h3>
              <p style={{ fontSize: 15, color: TEXT_MUTED, lineHeight: 1.6, margin: 0 }}>{p.text}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 40, textAlign: "center", fontSize: 18, color: TEXT_DARK, fontWeight: 600 }}>
          Genau das ändern wir — mit Ihrem individuellen Projekt.
        </p>
      </div>
    </section>
  );
}

// ─── Nutzen-Helper ──────────────────────────────────────
function nutzenFor(titel: string, beschreibung?: string): string {
  if (beschreibung && beschreibung.trim()) {
    const b = beschreibung.trim();
    return b.startsWith("→") ? b : `→ ${b}`;
  }
  const t = (titel || "").toLowerCase();
  if (t.includes("produkt") || t.includes("artikel")) return "→ Ihre Produkte sind sofort online kaufbar — rund um die Uhr.";
  if (t.includes("kategor")) return "→ Kunden finden sich in Ihrem Shop sofort zurecht.";
  if (t.includes("design") || t.includes("marke")) return "→ Kunden nehmen Sie auf den ersten Blick ernst.";
  if (t.includes("smartphone") || t.includes("mobil") || t.includes("tablet")) return "→ Jeder Kunde erreicht Sie — egal von welchem Gerät.";
  if (t.includes("shop-funktion") || t.includes("funktion")) return "→ Ihr Shop läuft automatisch — Sie müssen nichts manuell tun.";
  if (t.includes("kontaktformular")) return "→ Neue Anfragen landen direkt bei Ihnen — ohne Umwege.";
  if (t.includes("korrektur") || t.includes("runde")) return "→ Sie bekommen genau das, was Sie sich vorgestellt haben.";
  if (t.includes("impressum") || t.includes("datenschutz")) return "→ Rechtlich abgesichert — kein Stress mit Abmahnungen.";
  if (t.includes("support") || t.includes("whatsapp")) return "→ Bei Fragen sind wir direkt für Sie da — ohne Warteschleife.";
  if (t.includes("launch") || t.includes("live") || t.includes("veröffentlich")) return "→ Ihre Website geht pünktlich online — wir kümmern uns um alles.";
  return "";
}

// ─── Add-on Beschreibungs-Fallback ──────────────────────
function addonBeschreibungFor(titel: string, beschreibung?: string): string {
  if (beschreibung && beschreibung.trim()) return beschreibung.trim();
  const t = (titel || "").toLowerCase();
  if (t.includes("care") || t.includes("wartung") || t.includes("support")) {
    return "Wir halten Ihre Website aktuell, sicher und fehlerfrei. Updates, Backups und technischer Support — monatlich gebucht, monatlich kündbar.";
  }
  if (t.includes("seo")) {
    return "Mehr Sichtbarkeit bei Google — damit Kunden Sie finden, bevor sie zur Konkurrenz gehen.";
  }
  return "Auf Anfrage erfahren Sie mehr Details.";
}

function badgeFor(index: number, total: number): string {
  if (total === 1) return "";
  if (index === 0) return "EINSTIEG";
  if (index === total - 1) return "FÜR WACHSTUM";
  return "BELIEBT";
}

// ─── Standard-FAQs (Fallback wenn Admin keine eingetragen hat) ──
const STANDARD_FAQS: Faq[] = [
  { frage: "Was passiert direkt nach der Beauftragung?", antwort: "Sobald Sie den Auftrag erteilt haben, erhalten Sie innerhalb weniger Minuten eine Auftragsbestätigung per E-Mail. Wir melden uns anschließend innerhalb von 24 Stunden bei Ihnen, um einen Kickoff-Termin zu vereinbaren — und die Umsetzung startet." },
  { frage: "Wie lange dauert die Umsetzung?", antwort: "Die Umsetzung beginnt direkt nach Zahlungseingang. Je nach Paket und Ihrer Mitwirkung (Texte, Bilder, Inhalte) ist Ihre Website in der Regel innerhalb von 2–4 Wochen fertig und live. Wir halten Sie während des gesamten Prozesses auf dem Laufenden." },
  { frage: "Was wenn das Ergebnis nicht den Erwartungen entspricht?", antwort: "Kein Problem — dafür sind die Korrekturrunden im Paket enthalten. Sie sehen die Website bevor sie live geht und können gezielt Änderungen anfordern. Wir arbeiten so lange daran, bis Sie zufrieden sind — im Rahmen der vereinbarten Runden." },
  { frage: "Besteht eine langfristige Bindung?", antwort: "Beim Einmalkauf gehört Ihnen die Website vollständig — keine Bindung, kein Abo. Beim Mietmodell gilt eine Mindestlaufzeit von 12 Monaten, danach monatlich kündbar. In beiden Fällen bleiben Sie flexibel." },
  { frage: "Welche monatlichen Kosten entstehen nach dem Projekt?", antwort: "Beim Einmalkauf entstehen nach Projektabschluss nur die regulären Hosting- und Domain-Kosten (ca. 10–20 € / Monat, je nach Anbieter). Diese werden direkt bei Ihrem Hosting-Anbieter abgerechnet — nicht bei uns. Beim Mietmodell ist Hosting bereits enthalten." },
  { frage: "Kann die Website später selbst bearbeitet werden?", antwort: "Ja. Wir bauen Ihre Website so auf, dass Sie Texte, Bilder und Inhalte selbst aktualisieren können — ohne technisches Vorwissen. Auf Wunsch zeigen wir Ihnen im Kickoff wie das funktioniert. Für alles Weitere steht Ihnen unser Care-Paket zur Verfügung." },
  { frage: "Was ist der Unterschied zwischen Website kaufen und Website mieten?", antwort: "Beim Kauf zahlen Sie einmalig und die Website gehört Ihnen. Beim Mietmodell zahlen Sie eine monatliche Rate — dafür ist der Einstieg günstiger, und Wartung sowie Updates sind inklusive. Welches Modell besser zu Ihnen passt, hängt von Ihrem Budget und Ihren Zielen ab. Beides führt zum gleichen Ergebnis: eine professionelle Website die Kunden bringt." },
];

function resolveFaqs(custom: Faq[] | undefined, hasMiete: boolean): Faq[] {
  const cleaned = (custom ?? []).filter((f) => f && f.frage?.trim() && f.antwort?.trim());
  // Priorität: 1, 3, 4, (7 nur bei Miete), 2, 6, 5  →  Indizes 0, 2, 3, (6), 1, 5, 4
  const fillOrder = [0, 2, 3, ...(hasMiete ? [6] : []), 1, 5, 4];
  if (cleaned.length === 0) {
    return fillOrder.map((i) => STANDARD_FAQS[i]);
  }
  if (cleaned.length >= 3) return cleaned;
  const result = [...cleaned];
  for (const idx of fillOrder) {
    if (result.length >= 5) break;
    result.push(STANDARD_FAQS[idx]);
  }
  return result;
}

function PaketChooserSection({ pakete, selectedPaketId, setSelectedPaketId, onChoose }: {
  pakete: AngebotPaket[];
  selectedPaketId: string;
  setSelectedPaketId: (id: string) => void;
  onChoose?: (paketId: string) => void;
}) {
  const anyHasMiete = pakete.some((p) => p.miete_monatlich && p.miete_monatlich > 0);
  const minMiete = anyHasMiete
    ? Math.min(...pakete.filter((p) => p.miete_monatlich && p.miete_monatlich > 0).map((p) => Number(p.miete_monatlich)))
    : 0;
  return (
    <section style={{ padding: "clamp(48px, 8vw, 80px) 16px", background: "linear-gradient(180deg, #F5F4FF 0%, #FFFFFF 100%)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: TEXT_DARK, marginBottom: 12, letterSpacing: "-0.025em", lineHeight: 1.12 }}>
            Welches <span style={{ background: "linear-gradient(135deg,#4F3FF0 0%,#7B5EF8 50%,#5B8DEF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Paket</span> passt zu Ihnen?
          </h2>
          <p style={{ fontSize: 18, color: TEXT_MUTED, margin: "0 auto", maxWidth: 560 }}>
            Wählen Sie Ihre Variante — alle Inhalte unten passen sich automatisch an.
          </p>
        </div>

        {anyHasMiete && (
          <div style={{
            maxWidth: 720, margin: "0 auto 28px",
            background: "linear-gradient(135deg, rgba(79,63,240,0.06) 0%, rgba(123,94,248,0.08) 100%)",
            border: "1px solid rgba(79,63,240,0.18)",
            borderRadius: 14,
            padding: "14px 22px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            fontSize: 14.5, color: TEXT_DARK, textAlign: "center", flexWrap: "wrap",
          }}>
            <span style={{ fontSize: 18 }}>💡</span>
            <span>
              <strong style={{ color: BRAND }}>Zwei Wege zu Ihrer Website</strong> — mieten ab <strong>{minMiete} €/Monat</strong> oder einmalig kaufen. Sie entscheiden später.
            </span>
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`,
          gap: 16,
        }}>
          {pakete.map((p, idx) => {
            const active = p.id === selectedPaketId;
            const badge = p.badge || badgeFor(idx, pakete.length);
            const recommended = idx === pakete.length - 1 && pakete.length > 1;
            const paketMiete = p.miete_monatlich && p.miete_monatlich > 0 ? Number(p.miete_monatlich) : null;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPaketId(p.id)}
                style={{
                  textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                  background: "#fff",
                  border: active ? `2px solid ${BRAND}` : "1px solid rgba(79,63,240,0.15)",
                  borderRadius: 20, padding: "28px 22px 22px",
                  boxShadow: active ? "0 8px 32px rgba(79,63,240,0.15)" : "0 2px 12px rgba(79,63,240,0.05)",
                  opacity: active ? 1 : 0.85,
                  transform: active ? "scale(1.01)" : "scale(1)",
                  transition: "all 0.2s ease",
                  position: "relative",
                }}
              >
                {badge && (
                  <div style={{
                    position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
                    background: recommended ? BRAND_GRADIENT : BRAND,
                    color: "#fff",
                    fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "4px 16px", borderRadius: "0 0 10px 10px",
                  }}>{badge}</div>
                )}
                <div style={{ fontSize: 13, fontWeight: 700, color: BRAND, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                  Paket
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: TEXT_DARK, marginBottom: 6 }}>{p.name}</div>
                {p.beschreibung && (
                  <p style={{ fontSize: 14, color: TEXT_MUTED, margin: "0 0 14px", lineHeight: 1.5 }}>{p.beschreibung}</p>
                )}
                <div style={{ borderTop: "1px solid rgba(79,63,240,0.1)", margin: "16px 0" }} />
                {paketMiete ? (
                  <>
                    <div style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                      Ab nur
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6, lineHeight: 1 }}>
                      <span style={{ fontSize: 40, fontWeight: 800, color: BRAND, letterSpacing: "-0.02em" }}>
                        {paketMiete} €
                      </span>
                      <span style={{ fontSize: 16, fontWeight: 600, color: TEXT_MUTED }}>/Monat</span>
                    </div>
                    <div style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 2 }}>
                      oder einmalig <strong style={{ color: TEXT_DARK }}>{Number(p.preis).toLocaleString("de-DE")} €</strong>
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: 40, fontWeight: 800, color: BRAND, marginBottom: 4, lineHeight: 1, letterSpacing: "-0.02em" }}>
                    {Number(p.preis).toLocaleString("de-DE")} €
                  </div>
                )}
                {p.leistungen && p.leistungen.length > 0 && (
                  <Accordion type="single" collapsible className="mt-3">
                    <AccordionItem value="leistungen" className="border-none">
                      <AccordionTrigger
                        className="py-2 text-sm font-semibold hover:no-underline"
                        style={{ color: BRAND, fontFamily: "inherit" }}
                      >
                        Alle {p.leistungen.length} Leistungen anzeigen
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0", display: "grid", gap: 10 }}>
                          {p.leistungen.map((l, i) => (
                            <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                              <CheckIcon size={14} color="#059669" style={{ marginTop: 4, flexShrink: 0 }} />
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: TEXT_DARK }}>{l.titel}</div>
                                {nutzenFor(l.titel, l.beschreibung) && (
                                  <div style={{ fontSize: 12, color: TEXT_MUTED, fontStyle: "italic", lineHeight: 1.5 }}>
                                    {nutzenFor(l.titel, l.beschreibung)}
                                  </div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
                {active && (
                  <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, color: BRAND, fontSize: 13, fontWeight: 700 }}>
                    <CheckCircle2 size={16} /> Ausgewählt
                  </div>
                )}
                {onChoose && (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); onChoose(p.id); }}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); onChoose(p.id); } }}
                    style={{
                      marginTop: 16, width: "100%",
                      padding: "12px 16px",
                      background: active ? BRAND_GRADIENT : "#fff",
                      color: active ? "#fff" : BRAND,
                      border: active ? "none" : `2px solid ${BRAND}`,
                      borderRadius: 12,
                      fontSize: 14, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      cursor: "pointer",
                      boxShadow: active ? "0 6px 20px rgba(79,63,240,0.25)" : "none",
                      transition: "all 0.15s",
                    }}
                  >
                    Dieses Paket wählen <ChevronRight size={16} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {pakete.length > 1 && (
          <div style={{
            marginTop: 20, textAlign: "center",
            fontSize: 14, color: TEXT_MUTED, fontStyle: "italic",
          }}>
            Mehr Funktionen, mehr Inhalte, längerer Support? → Das größere Paket wählen.
          </div>
        )}
      </div>
    </section>
  );
}

function LeistungenSection({ leistungen }: { leistungen: Leistung[] }) {
  if (!leistungen || leistungen.length === 0) return null;
  return (
    <section style={{ padding: "clamp(48px, 8vw, 80px) 16px", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: TEXT_DARK, marginBottom: 12, letterSpacing: "-0.025em", lineHeight: 1.12 }}>
            Was wir gemeinsam <span style={{ background: "linear-gradient(135deg,#4F3FF0 0%,#7B5EF8 50%,#5B8DEF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>umsetzen</span>
          </h2>
          <p style={{ fontSize: 18, color: TEXT_MUTED, maxWidth: 560, margin: "0 auto" }}>
            Jede Leistung — mit konkretem Nutzen für Sie.
          </p>
        </div>
        <div className="angebot-leistungen-grid ang-stagger-leist" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}>
          {leistungen.map((l, i) => (
            <div key={i} className="angebot-leistung-card ang-reveal" style={{
              animationDelay: `${i * 80}ms`,
            }}>
              <div className="ang-leist-emoji">
                {l.emoji || <span style={{ color: BRAND, fontSize: 22, fontWeight: 800 }}>✦</span>}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT_DARK, marginBottom: 6 }}>{l.titel}</h3>
              {nutzenFor(l.titel, l.beschreibung) && (
                <p style={{ fontSize: 14, color: TEXT_MUTED, lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
                  {nutzenFor(l.titel, l.beschreibung)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PriceSection({
  preis, normalpreis, miete, anzahlung,
  priceMode, setPriceMode, hasMiete,
  optionen, selectedOptionIds, toggleOption,
  anzeigeGesamt, monatlicheZusatz, einmaligeZusatz, selectedOptionsCount, matchedBundle,
  isRechnung, ctaModeAnfrage,
}: {
  preis: number;
  normalpreis?: number | null;
  miete?: number | null;
  anzahlung?: number | null;
  priceMode: "kauf" | "miete";
  setPriceMode: (m: "kauf" | "miete") => void;
  hasMiete: boolean;
  optionen: AngebotOption[];
  selectedOptionIds: string[];
  toggleOption: (id: string) => void;
  anzeigeGesamt: number;
  monatlicheZusatz: number;
  einmaligeZusatz: number;
  selectedOptionsCount: number;
  matchedBundle: AngebotBundle | null | undefined;
  isRechnung: boolean;
  ctaModeAnfrage: boolean;
}) {
  return (
    <section style={{ padding: "clamp(48px, 8vw, 80px) 16px 48px", background: "linear-gradient(160deg, #F5F4FF 0%, #EEF2FF 100%)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: TEXT_DARK, marginBottom: 12, letterSpacing: "-0.025em", lineHeight: 1.12 }}>
            {hasMiete ? (
              <>Wie möchten Sie <span style={{ background: "linear-gradient(135deg,#4F3FF0 0%,#7B5EF8 50%,#5B8DEF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>zahlen</span>?</>
            ) : (
              <>Ihr <span style={{ background: "linear-gradient(135deg,#4F3FF0 0%,#7B5EF8 50%,#5B8DEF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Investitionsvolumen</span></>
            )}
          </h2>
          <p style={{ fontSize: 18, color: TEXT_MUTED, margin: "0 auto", maxWidth: 560 }}>
            {hasMiete ? "Beide Wege — gleiches Ergebnis. Sie entscheiden." : "Einmalige Investition — Ihre Website gehört Ihnen."}
          </p>
        </div>

        {/* TWO-CARD CHOICE */}
        <div style={{
          display: "grid",
          gridTemplateColumns: hasMiete ? "repeat(auto-fit, minmax(280px, 1fr))" : "1fr",
          gap: 20,
          maxWidth: hasMiete ? 880 : 560,
          margin: "0 auto",
          position: "relative",
        }}>
          {hasMiete && (
            <div aria-hidden="true" className="ang-oder-badge" style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 52, height: 52, borderRadius: "50%",
              background: "#fff",
              border: `2px solid ${BRAND}`,
              boxShadow: "0 4px 16px rgba(79,63,240,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800, color: BRAND,
              letterSpacing: "0.06em",
              zIndex: 5,
            }}>ODER</div>
          )}
          {/* CARD: KAUF */}
          <PriceCard
            kind="kauf"
            active={priceMode === "kauf"}
            onSelect={() => setPriceMode("kauf")}
            badge="EINMALIG"
            badgeStyle={{ background: "#EDE9FF", color: BRAND }}
            mainPrice={`${Number(preis).toLocaleString("de-DE")} €`}
            mainSub={null}
            normalpreis={normalpreis ?? null}
            tagline="Einmalige Investition. Website gehört Ihnen."
            bullets={[
              "Kein monatlicher Aufwand",
              "Vollständiges Eigentum",
              "Einmalig. Fertig.",
            ]}
            buttonLabel="Website kaufen"
            buttonVariant={hasMiete ? "outline" : "primary"}
          />

          {/* CARD: MIETE */}
          {hasMiete && (
            <PriceCard
              kind="miete"
              active={priceMode === "miete"}
              onSelect={() => setPriceMode("miete")}
              badge="EMPFOHLEN"
              badgeStyle={{ background: BRAND_GRADIENT, color: "#fff" }}
              mainPrice={`${Number(miete).toLocaleString("de-DE")} €`}
              mainSub="/Monat"
              anzahlung={anzahlung ?? null}
              normalpreis={null}
              tagline="Geringer Einstieg. Volle Leistung."
              bullets={[
                "Geringes Startkapital nötig",
                "Immer aktuell & gewartet",
                "Flexibel — monatlich kündbar nach Mindestlaufzeit",
              ]}
              buttonLabel="Website mieten"
              buttonVariant="primary"
              highlighted
            />
          )}
        </div>

        {hasMiete && (
          <div style={{
            maxWidth: 720, margin: "24px auto 0",
            background: "#fff",
            border: "1px solid rgba(79,63,240,0.12)",
            borderRadius: 12,
            padding: "14px 22px",
            fontSize: 13.5, color: TEXT_MUTED, textAlign: "center",
            lineHeight: 1.6,
          }}>
            <strong style={{ color: TEXT_DARK }}>Beides enthält:</strong> alle Leistungen aus Ihrem Paket · 2 Korrekturrunden · DSGVO-konform · Hosting & Domain
          </div>
        )}

        {isRechnung && (
          <div style={{
            maxWidth: 560, margin: "20px auto 0",
            background: "#fff", borderRadius: 12,
            padding: "12px 18px", fontSize: 13, color: TEXT_MUTED, textAlign: "center",
            border: "1px solid rgba(79,63,240,0.1)",
          }}>
            Zahlung per Rechnung · 14 Tage Zahlungsziel nach Auftragserteilung
          </div>
        )}

        {/* OPTIONALE ERWEITERUNGEN */}
        {optionen.length > 0 && (
          <div style={{ marginTop: 48, maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: BRAND, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                Optionale Erweiterungen
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: TEXT_DARK, marginBottom: 6 }}>
                Stellen Sie Ihr Paket zusammen
              </h3>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {optionen.map((o) => {
                const active = selectedOptionIds.includes(o.id);
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => toggleOption(o.id)}
                    style={{
                      textAlign: "left",
                      borderRadius: 16,
                      border: `2px solid ${active ? BRAND : "rgba(79,63,240,0.15)"}`,
                      padding: "16px 18px",
                      cursor: "pointer",
                      display: "flex", gap: 14, alignItems: "flex-start",
                      fontFamily: "inherit",
                      transition: "all 0.15s",
                      background: active ? `${BRAND}08` : "#fff",
                    }}
                  >
                    <div style={{
                      width: 22, height: 22, borderRadius: 6,
                      border: `2px solid ${active ? BRAND : "rgba(79,63,240,0.3)"}`,
                      background: active ? BRAND : "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 2,
                    }}>
                      {active && <CheckIcon size={14} color="#fff" />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
                        <div style={{ fontWeight: 700, color: TEXT_DARK, fontSize: 16 }}>
                          {o.emoji ? `${o.emoji} ` : ""}{o.titel}
                        </div>
                        <div style={{ fontWeight: 800, color: BRAND, fontSize: 16, whiteSpace: "nowrap" }}>
                          + {Number(o.preis).toLocaleString("de-DE")} €
                          {o.preis_typ === "monatlich" && <span style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}> /Monat</span>}
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.5, margin: 0 }}>
                        {addonBeschreibungFor(o.titel, o.beschreibung)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedOptionsCount > 0 && (
              <div style={{
                marginTop: 16, background: "#fff", borderRadius: 14,
                padding: "14px 18px", border: `1px solid ${BRAND}20`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                flexWrap: "wrap", gap: 8,
              }}>
                <div style={{ fontSize: 13, color: TEXT_MUTED, fontWeight: 600 }}>
                  Ihre Auswahl ({selectedOptionsCount} Option{selectedOptionsCount !== 1 ? "en" : ""})
                </div>
                <div style={{ textAlign: "right" }}>
                  {priceMode === "miete" && miete ? (
                    <>
                      <div style={{ fontSize: 18, fontWeight: 800, color: BRAND }}>
                        {Number(Number(miete) + monatlicheZusatz).toLocaleString("de-DE")} € <span style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 600 }}>/Monat</span>
                      </div>
                      {einmaligeZusatz > 0 && (
                        <div style={{ fontSize: 13, color: TEXT_MUTED, fontWeight: 600 }}>
                          + {Number(einmaligeZusatz).toLocaleString("de-DE")} € einmalig
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 18, fontWeight: 800, color: BRAND }}>
                        {Number(anzeigeGesamt).toLocaleString("de-DE")} €
                        {matchedBundle?.gesamt_preis ? null : <span style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}> ca.</span>}
                      </div>
                      {monatlicheZusatz > 0 && (
                        <div style={{ fontSize: 13, color: TEXT_MUTED, fontWeight: 600 }}>
                          + {Number(monatlicheZusatz).toLocaleString("de-DE")} € / Monat
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {ctaModeAnfrage && (
              <div style={{
                marginTop: 12, padding: "12px 16px",
                background: "#FEF3C7", color: "#92400E",
                borderRadius: 12, fontSize: 13, lineHeight: 1.5,
              }}>
                Für diese Kombination ist kein Direkt-Checkout hinterlegt — sprechen Sie uns kurz an, wir senden Ihnen einen passenden Zahlungslink.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function PriceCard({
  kind, active, onSelect, badge, badgeStyle, mainPrice, mainSub,
  normalpreis, tagline, bullets, buttonLabel, buttonVariant, highlighted, anzahlung,
}: {
  kind: "kauf" | "miete";
  active: boolean;
  onSelect: () => void;
  badge: string;
  badgeStyle: React.CSSProperties;
  mainPrice: string;
  mainSub: string | null;
  normalpreis: number | null;
  tagline: string;
  bullets: string[];
  buttonLabel: string;
  buttonVariant: "primary" | "outline";
  highlighted?: boolean;
  anzahlung?: number | null;
}) {
  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(); } }}
      className={highlighted ? "ang-price-miete" : "ang-price-kauf"}
      style={{
        background: highlighted ? "linear-gradient(145deg, #EDE9FF 0%, #E8E4FF 40%, #DDD7FF 100%)" : "#fff",
        borderRadius: 20,
        border: highlighted ? `2px solid ${BRAND}` : "1.5px solid rgba(79,63,240,0.15)",
        padding: "36px 32px",
        position: "relative",
        overflow: "visible",
        cursor: "pointer",
        boxShadow: highlighted
          ? "0 8px 40px rgba(79,63,240,0.20), 0 0 0 1px rgba(79,63,240,0.10)"
          : "0 2px 16px rgba(79,63,240,0.06)",
        transition: "all 0.2s",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{
        position: "absolute", top: -12, left: 20,
        ...badgeStyle,
        fontSize: 11, fontWeight: 800, letterSpacing: "0.08em",
        padding: "5px 14px", borderRadius: 50,
      }}>{badge}</div>

      {active && (
        <div style={{
          position: "absolute", top: 16, right: 16,
          width: 28, height: 28, borderRadius: "50%",
          background: BRAND, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <CheckIcon size={16} />
        </div>
      )}

      <div style={{ marginTop: 10, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
          <span style={{
            fontSize: "clamp(40px, 6vw, 56px)", fontWeight: 800,
            lineHeight: 1, letterSpacing: "-0.02em",
            ...(kind === "miete" ? {
              background: BRAND_GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            } : { color: TEXT_DARK }),
          }}>
            {mainPrice}
          </span>
          {mainSub && (
            <span style={{ fontSize: 14, color: TEXT_MUTED, fontWeight: 600 }}>{mainSub}</span>
          )}
        </div>
        {normalpreis && normalpreis > 0 && (
          <div style={{ fontSize: 15, color: TEXT_MUTED, textDecoration: "line-through", marginTop: 6 }}>
            {Number(normalpreis).toLocaleString("de-DE")} €
          </div>
        )}
        {anzahlung && anzahlung > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 14, color: TEXT_MUTED, fontWeight: 600 }}>
              + {Number(anzahlung).toLocaleString("de-DE")} € Anzahlung einmalig zum Start
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
              Die Anzahlung wird bei Auftragserteilung fällig.
            </div>
          </div>
        )}
      </div>

      <p style={{ fontSize: 14, color: TEXT_DARK, fontWeight: 600, margin: "0 0 16px", lineHeight: 1.5 }}>
        {tagline}
      </p>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "grid", gap: 10, flex: 1 }}>
        {bullets.map((b, i) => (
          <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: TEXT_DARK, lineHeight: 1.5 }}>
            <CheckIcon size={16} color="#059669" style={{ marginTop: 2, flexShrink: 0 }} />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={buttonVariant === "outline" ? "ang-btn-outline" : "ang-btn-primary"}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        style={{
          width: "100%",
          padding: "16px 32px",
          borderRadius: 50,
          fontSize: 16, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit",
          border: buttonVariant === "outline" ? `2px solid ${BRAND}` : "none",
          background: buttonVariant === "outline" ? "transparent" : BRAND_GRADIENT,
          color: buttonVariant === "outline" ? BRAND : "#fff",
          transition: "all 0.2s",
          boxShadow: buttonVariant === "outline" ? "none" : "0 4px 20px rgba(79,63,240,0.35)",
        }}
      >
        {active ? "✓ " : ""}{buttonLabel}
      </button>
    </div>
  );
}

function TimelineSection() {
  const steps = [
    {
      n: 1,
      titel: "Auftrag erteilen",
      text: "Sie bestätigen heute verbindlich. Wir reservieren Ihre Kapazitäten und schalten den Zugang frei.",
      badge: "Sofort",
      badgeTone: "primary" as const,
    },
    {
      n: 2,
      titel: "Kickoff-Call",
      text: "Wir klären alle Details und Ziele in einem gemeinsamen Videocall für einen reibungslosen Start.",
      badge: "48 Stunden",
      badgeTone: "neutral" as const,
    },
    {
      n: 3,
      titel: "Umsetzung",
      text: "Ihr Projekt wird nach höchsten Standards umgesetzt. Sie erhalten regelmäßige Updates zum Fortschritt.",
      badge: "Hauptphase",
      badgeTone: "neutral" as const,
    },
    {
      n: 4,
      titel: "Live & fertig",
      text: "Wir feiern den Launch gemeinsam und begleiten Sie auch danach, um den dauerhaften Erfolg zu sichern.",
      badge: "Go-Live",
      badgeTone: "success" as const,
    },
  ];
  return (
    <section className="angebot-timeline-section" style={{ padding: "clamp(58px, 8vw, 92px) 16px", background: "#fff" }}>
      <div className="angebot-timeline-inner" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <h2 className="angebot-timeline-title" style={{ fontSize: "clamp(34px, 5vw, 50px)", fontWeight: 800, color: TEXT_DARK, marginBottom: 48, textAlign: "center", letterSpacing: "-0.025em", lineHeight: 1.12 }}>
          Ihr Weg zur fertigen <span style={{ background: "linear-gradient(135deg,#4F3FF0 0%,#7B5EF8 50%,#5B8DEF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Website</span>
        </h2>
        <div className="angebot-timeline" style={{ position: "relative" }}>
          {steps.map((s, i) => (
            <div key={s.n} className="angebot-timeline-step" data-step={s.n}>
              <div className="angebot-timeline-dot">
                <span className="angebot-timeline-dot-num">{s.n}</span>
              </div>
              <div className="angebot-timeline-card">
                <span className={`angebot-timeline-badge tone-${s.badgeTone}`}>{s.badge}</span>
                <h3>{s.titel}</h3>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
        <style>{`
          .angebot-timeline {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 32px;
            position: relative;
            padding: 0 6%;
          }
          /* Horizontal progress rail behind the dots */
          .angebot-timeline::before {
            content: "";
            position: absolute;
            top: 40px;
            left: calc(6% + 40px);
            right: calc(6% + 40px);
            height: 4px;
            background: #E2E8F0;
            border-radius: 999px;
            z-index: 0;
          }
          .angebot-timeline::after {
            content: "";
            position: absolute;
            top: 40px;
            left: calc(6% + 40px);
            width: calc((100% - 12% - 80px) * 0.34);
            height: 4px;
            background: linear-gradient(90deg,#4F3FF0 0%,#5B8DEF 100%);
            border-radius: 999px;
            z-index: 0;
          }
          .angebot-timeline-badge { display: none; }
          .angebot-timeline-step {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            z-index: 1;
          }
          .angebot-timeline-dot {
            width: 80px; height: 80px; border-radius: 999px;
            background: #fff;
            color: #CBD5E1;
            border: 2px solid #F1F5F9;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 28px;
            box-shadow: 0 4px 12px rgba(15,23,42,0.05), 0 0 0 8px #fff;
            position: relative;
            z-index: 2;
            transition: transform .3s cubic-bezier(.4,0,.2,1);
          }
          .angebot-timeline-step:hover .angebot-timeline-dot { transform: scale(1.06); }
          .angebot-timeline-dot-num { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; }
          .angebot-timeline-step[data-step="1"] .angebot-timeline-dot {
            background: #4F3FF0;
            border-color: #4F3FF0;
            box-shadow: 0 14px 30px rgba(79,63,240,0.32), 0 0 0 8px #fff;
          }
          .angebot-timeline-step[data-step="1"] .angebot-timeline-dot-num { color: #fff; }
          .angebot-timeline-step[data-step="2"] .angebot-timeline-dot-num { color: #4F3FF0; }
          .angebot-timeline-badge {
            display: inline-block;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            padding: 5px 12px;
            border-radius: 999px;
            margin-bottom: 14px;
            border: 1px solid transparent;
          }
          .angebot-timeline-badge.tone-primary { background: #EEF0FF; color: #4F3FF0; border-color: #E0E4FF; }
          .angebot-timeline-badge.tone-neutral { background: #EFF6FF; color: #5B8DEF; border-color: #DBEAFE; }
          .angebot-timeline-badge.tone-success { background: #F1F5F9; color: #64748B; border-color: #E2E8F0; }
          .angebot-timeline-step[data-step="4"] .angebot-timeline-badge { background: #ECFDF5; color: #059669; border-color: #D1FAE5; }
          .angebot-timeline-card {
            width: 100%;
            background: transparent;
            border: none;
            border-radius: 0;
            padding: 0 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            box-shadow: none;
          }
          .angebot-timeline-card h3 {
            font-size: 20px; font-weight: 800; color: ${TEXT_DARK};
            margin: 0 0 12px; letter-spacing: -0.015em;
          }
          .angebot-timeline-card p {
            font-size: 14px; color: ${TEXT_MUTED}; margin: 0; line-height: 1.6;
          }
          @media (max-width: 720px) {
            .angebot-timeline-section { padding: 52px 16px 64px !important; overflow: hidden; }
            .angebot-timeline-inner { padding: 0 !important; max-width: 430px !important; }
            .angebot-timeline-title { font-size: 32px !important; line-height: 1.08 !important; margin: 0 auto 30px !important; max-width: 300px !important; }
            .angebot-timeline {
              grid-template-columns: 1fr !important;
              gap: 24px !important;
              text-align: left !important;
              position: relative !important;
              padding: 0 !important;
            }
            .angebot-timeline::after { display: none !important; }
            /* Vertical timeline line behind dots */
            .angebot-timeline::before {
              content: "";
              position: absolute;
              left: 23px !important;
              right: auto !important;
              top: 28px;
              bottom: 28px;
              height: auto !important;
              width: 2px;
              background: #E2E8F0;
              z-index: 0;
            }
            .angebot-timeline-track, .angebot-timeline-track-fill { display: none !important; }
            .angebot-timeline-step {
              display: grid !important;
              grid-template-columns: 46px minmax(0, 1fr) !important;
              gap: 16px !important;
              align-items: flex-start !important;
              text-align: left !important;
              padding: 0 !important;
              border: none !important;
              border-radius: 0 !important;
              background: transparent !important;
              box-shadow: none !important;
              position: relative !important;
            }
            .angebot-timeline-dot {
              width: 32px !important; height: 32px !important;
              border-radius: 999px !important;
              margin: 18px 0 0 8px !important;
              background: #fff !important;
              border: 2px solid #4F3FF0 !important;
              box-shadow: 0 0 0 4px #fff !important;
              position: relative !important;
              z-index: 1 !important;
            }
            .angebot-timeline-step[data-step="1"] .angebot-timeline-dot {
              background: #4F3FF0 !important;
              border-color: #4F3FF0 !important;
              box-shadow: 0 8px 20px rgba(79,63,240,0.30), 0 0 0 4px #fff !important;
            }
            .angebot-timeline-step[data-step="1"] .angebot-timeline-dot-num { color: #fff !important; }
            .angebot-timeline-dot-num { font-size: 14px !important; font-weight: 700 !important; color: #4F3FF0 !important; }
            .angebot-timeline-card {
              padding: 18px 18px 20px !important;
              border: 1px solid #F1F5F9 !important;
              background: #fff !important;
              border-radius: 24px !important;
              box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 12px 28px -20px rgba(15,23,42,0.18) !important;
            }
            .angebot-timeline-card:hover { transform: none !important; }
            .angebot-timeline-card h3 { margin: 8px 0 6px !important; font-size: 16px !important; line-height: 1.25 !important; font-weight: 700 !important; }
            .angebot-timeline-card p { font-size: 13.5px !important; line-height: 1.5 !important; color: #64748B !important; }
            .angebot-timeline-badge {
              display: inline-block !important;
              font-size: 10px !important;
              font-weight: 700 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.08em !important;
              padding: 4px 10px !important;
              border-radius: 999px !important;
            }
            .angebot-timeline-badge.tone-primary { background: #EFF6FF !important; color: #5B8DEF !important; }
            .angebot-timeline-badge.tone-neutral { background: #F1F5F9 !important; color: #64748B !important; }
            .angebot-timeline-badge.tone-success { background: #ECFDF5 !important; color: #059669 !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

function TrustSection() {
  const stats = [
    {
      v: "150+", l: "Webseiten umgesetzt",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18M8 21h8M12 18v3"/></svg>
      ),
    },
    {
      v: "98%", l: "Weiterempfehlungsrate",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      ),
    },
    {
      v: "48h", l: "Bis zum ersten Konzept",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
      ),
    },
    {
      v: "2–5x", l: "Mehr Anfragen nach Launch",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="15 7 21 7 21 13"/></svg>
      ),
    },
  ];

  return (
    <section style={{ padding: "clamp(48px, 8vw, 80px) 16px", background: BG_SOFT }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Mobile: Icon list with hairlines */}
        <div className="ang-trust-mobile">
          <div className="ang-trust-list">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="ang-trust-row-item">
                  <div className="ang-trust-icon" aria-hidden="true">{s.icon}</div>
                  <div className="ang-trust-value">{s.v}</div>
                  <div className="ang-trust-label">{s.l}</div>
                </div>
                {i < stats.length - 1 && <div className="ang-trust-hairline" />}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: classic 4-column row */}
        <div className="ang-trust-row">
          {stats.map((s, i) => (
            <div key={i} className="ang-trust-item">
              <div className="ang-trust-item-icon" aria-hidden="true">{s.icon}</div>
              <div className="ang-trust-item-value">{s.v}</div>
              <div className="ang-trust-item-label">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCtaSection({
  ctaLink, ctaLabel, ctaMode, isRechnung, openBooking, selectedOptions, leadName,
}: {
  ctaLink: string | null; ctaLabel: string;
  ctaMode: "haupt" | "option" | "bundle" | "anfrage";
  isRechnung: boolean; openBooking: () => void;
  selectedOptions: AngebotOption[]; leadName: string;
}) {
  const buttonBaseStyle: React.CSSProperties = {
    display: "inline-block",
    background: "#fff", color: BRAND,
    padding: "18px 48px", borderRadius: 50,
    fontSize: 16, fontWeight: 700,
    textDecoration: "none", border: "none", cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
  };
  return (
    <section style={{ padding: "clamp(48px, 8vw, 80px) 16px", background: "#fff" }}>
      <div style={{
        maxWidth: 760, margin: "0 auto",
        background: BRAND_GRADIENT,
        borderRadius: 24,
        padding: "clamp(40px, 6vw, 60px) clamp(24px, 5vw, 56px)",
        textAlign: "center", color: "#fff",
        boxShadow: `0 30px 80px ${BRAND}40`,
      }}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 800, color: "#fff", marginBottom: 12, letterSpacing: "-0.02em" }}>
          Bereit, loszulegen?
        </h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.85)", marginBottom: 8, lineHeight: 1.6 }}>
          {leadName ? `${leadName}, Ihr Projekt wartet auf den Startschuss.` : "Ihr Projekt wartet auf den Startschuss."}
        </p>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", marginBottom: 32, lineHeight: 1.6 }}>
          Ein Klick — und wir kümmern uns um den Rest.
        </p>
        {ctaLink ? (
          <a href={ctaLink} target="_blank" rel="noopener noreferrer" style={buttonBaseStyle}>
            {ctaLabel}
          </a>
        ) : isRechnung && ctaMode !== "anfrage" ? (
          <button type="button" onClick={openBooking} style={buttonBaseStyle}>
            {ctaLabel}
          </button>
        ) : (
          <a
            href={`mailto:hallo@meine-traum-webseite.de?subject=${encodeURIComponent("Angebot-Auswahl für " + leadName)}&body=${encodeURIComponent("Ich möchte folgende Optionen dazubuchen: " + selectedOptions.map((o) => o.titel).join(", "))}`}
            style={buttonBaseStyle}
          >
            {ctaLabel}
          </a>
        )}
        <div style={{ marginTop: 18, fontSize: 13, color: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Shield size={13} />
          {isRechnung
            ? "Zahlung per Rechnung · 14 Tage Zahlungsziel · B2B · Kein Widerrufsrecht"
            : "Sichere Zahlung via Stripe · SSL-verschlüsselt"}
        </div>
        <div style={{ marginTop: 24, display: "grid", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.7)", textAlign: "left", maxWidth: 400, margin: "24px auto 0" }}>
          <div>✓ Verbindliche Auftragserteilung gemäß AGB</div>
          <div>✓ Auftragsbestätigung per E-Mail innerhalb von Minuten</div>
          <div>✓ Umsetzung startet nach Zahlungseingang</div>
        </div>
      </div>
    </section>
  );
}

function StickyBar({
  paketName, preis, miete, priceMode, days, ctaLink, isRechnung, ctaMode, openBooking,
}: {
  paketName: string;
  preis: number;
  miete?: number | null;
  priceMode: "kauf" | "miete";
  days: number;
  ctaLink: string | null;
  isRechnung: boolean;
  ctaMode: "haupt" | "option" | "bundle" | "anfrage";
  openBooking: () => void;
}) {
  const showMiete = priceMode === "miete" && !!miete;
  const priceLabel = showMiete
    ? `${Number(miete).toLocaleString("de-DE")} €/Monat`
    : `${Number(preis).toLocaleString("de-DE")} €`;
  const btnLabel = isRechnung || ctaMode === "anfrage"
    ? "Jetzt verbindlich beauftragen"
    : "Angebot annehmen & starten";

  const btnStyle: React.CSSProperties = {
    background: BRAND_GRADIENT, color: "#fff",
    padding: "10px 28px", borderRadius: 50,
    fontSize: 15, fontWeight: 700,
    border: "none", cursor: "pointer",
    textDecoration: "none", fontFamily: "inherit",
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    whiteSpace: "nowrap",
    boxShadow: "0 4px 16px rgba(79,63,240,0.3)",
  };

  return (
    <div className="angebot-sticky-bar" style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "rgba(255,255,255,0.90)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderTop: "1px solid rgba(79,63,240,0.12)",
      boxShadow: "0 -4px 32px rgba(79,63,240,0.10)",
      padding: "14px 40px",
      zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 16, flexWrap: "wrap",
      animation: "angebot-slide-up 0.3s ease-out",
    }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 11, color: BRAND, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2, lineHeight: 1.2 }}>
          {paketName}
        </div>
        <div style={{ color: TEXT_DARK, fontWeight: 800, fontSize: 22, lineHeight: 1.1 }}>
          {priceLabel}
        </div>
        <div style={{ fontSize: 12, color: "#EF4444", fontWeight: 600, marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
          <span className="ang-pulse-dot" />
          Noch {days} Tag{days !== 1 ? "e" : ""} reserviert
        </div>
      </div>
      {ctaLink ? (
        <a href={ctaLink} target="_blank" rel="noopener noreferrer" style={btnStyle}>
          {btnLabel} <ChevronRight size={16} />
        </a>
      ) : isRechnung && ctaMode !== "anfrage" ? (
        <button type="button" onClick={openBooking} style={btnStyle}>
          {btnLabel} <ChevronRight size={16} />
        </button>
      ) : (
        <a href="mailto:hallo@meine-traum-webseite.de" style={btnStyle}>
          Auf Anfrage <ChevronRight size={16} />
        </a>
      )}
      <style>{`
        @keyframes angebot-slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @media (max-width: 640px) {
          .angebot-sticky-bar { padding: 10px 14px max(12px, env(safe-area-inset-bottom)) !important; flex-direction: column !important; align-items: stretch !important; gap: 8px !important; }
          .angebot-sticky-bar > div:first-child { text-align: center; }
          .angebot-sticky-bar > div:first-child > div:first-child { font-size: 10px !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .angebot-sticky-bar > div:first-child > div:nth-child(2) { font-size: 20px !important; }
          .angebot-sticky-bar > div:first-child > div:nth-child(3) { justify-content: center; margin-top: 3px !important; }
          .angebot-sticky-bar > a, .angebot-sticky-bar > button { width: 100%; min-height: 42px; padding: 11px 16px !important; font-size: 14px !important; white-space: normal !important; line-height: 1.2 !important; }
        }
      `}</style>
    </div>
  );
}

function ExpiredOverlay() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(30,27,75,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      backdropFilter: "blur(6px)",
    }}>
      <div style={{
        background: "#fff", borderRadius: 24, padding: "48px 40px",
        maxWidth: 480, width: "100%", textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: "rgba(107,114,128,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <Clock size={28} color={TEXT_MUTED} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: TEXT_DARK, marginBottom: 12 }}>
          Dieses Angebot ist abgelaufen.
        </h2>
        <p style={{ color: TEXT_MUTED, marginBottom: 24, fontSize: 15 }}>
          Sprechen Sie uns gerne an — wir erstellen ein aktuelles Angebot.
        </p>
        <a
          href="https://meine-traum-webseite.de/kontakt"
          style={{
            display: "inline-block",
            background: BRAND_GRADIENT, color: "#fff",
            padding: "14px 28px", borderRadius: 50,
            fontSize: 15, fontWeight: 700,
            textDecoration: "none", fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          Jetzt Kontakt aufnehmen
        </a>
      </div>
    </div>
  );
}
function BookingModal({ data, positions, onClose, onSuccess }: {
  data: AngebotData;
  positions: { titel: string; preis: number }[];
  onClose: () => void;
  onSuccess: (auftragsNr: string) => void;
}) {
  const [vorname, setVorname] = useState(data.lead_name?.split(" ")[0] || "");
  const [nachname, setNachname] = useState(data.lead_name?.split(" ").slice(1).join(" ") || "");
  const [firma, setFirma] = useState("");
  const [email, setEmail] = useState(data.lead_email || "");
  const [telefon, setTelefon] = useState("");
  const [agb, setAgb] = useState(false);
  const [kostenpflichtig, setKostenpflichtig] = useState(false);
  const [sendCopy, setSendCopy] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const netto = positions.reduce((s, p) => s + p.preis, 0);
  const mwst = Math.round(netto * 19) / 100;
  const brutto = Math.round((netto + mwst) * 100) / 100;

  const canSubmit = vorname.trim() && nachname.trim() && firma.trim() && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && agb && kostenpflichtig && !submitting;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const { data: resp, error: invErr } = await supabase.functions.invoke("buchung-erstellen", {
        body: {
          kunde_vorname: vorname.trim(),
          kunde_nachname: nachname.trim(),
          kunde_firma: firma.trim(),
          kunde_email: email.trim(),
          kunde_telefon: telefon.trim(),
          angebots_id: data.angebots_id || null,
          payment_method: "rechnung",
          positions,
          agb_akzeptiert: true,
          kostenpflichtig_bestaetigt: true,
          send_copy: sendCopy,
        },
      });
      if (invErr) throw invErr;
      const r = resp as { success?: boolean; auftrags_nr?: string; error?: string };
      if (!r?.success || !r.auftrags_nr) throw new Error(r?.error || "Buchung fehlgeschlagen");
      onSuccess(r.auftrags_nr);
    } catch (err: any) {
      setError(err?.message || "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: "rgba(30,27,75,0.6)",
      backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16, overflowY: "auto",
    }}>
      <form onSubmit={submit} style={{
        background: "#fff", borderRadius: 20, maxWidth: 560, width: "100%",
        padding: "32px 28px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        maxHeight: "92vh", overflowY: "auto", fontFamily: "inherit",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: TEXT_DARK, margin: 0 }}>Verbindlich buchen</h2>
          <button type="button" onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: TEXT_MUTED, padding: 4 }}>
            <X size={20} />
          </button>
        </div>
        <p style={{ color: TEXT_MUTED, fontSize: 14, marginBottom: 20 }}>
          Bezahlung per Rechnung · 14 Tage Zahlungsziel nach Lieferung
        </p>

        {/* Positionen */}
        <div style={{ background: BG_SOFT, borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
          {positions.map((p, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: TEXT_DARK, padding: "4px 0" }}>
              <span>{p.titel}</span>
              <strong>{p.preis.toLocaleString("de-DE")} €</strong>
            </div>
          ))}
          <div style={{ borderTop: "1px dashed rgba(79,63,240,0.2)", marginTop: 8, paddingTop: 8, display: "grid", gap: 4, fontSize: 13, color: TEXT_MUTED }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Netto</span><span>{netto.toLocaleString("de-DE")} €</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>MwSt (19%)</span><span>{mwst.toLocaleString("de-DE")} €</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, color: BRAND, fontWeight: 800 }}>
              <span>Gesamt (Brutto)</span><span>{brutto.toLocaleString("de-DE")} €</span>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <Field label="Vorname *" value={vorname} onChange={setVorname} />
          <Field label="Nachname *" value={nachname} onChange={setNachname} />
        </div>
        <Field label="Firma *" value={firma} onChange={setFirma} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          <Field label="E-Mail *" type="email" value={email} onChange={setEmail} />
          <Field label="Telefon" value={telefon} onChange={setTelefon} />
        </div>

        <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
          <Check label={<>Ich akzeptiere die <a href="/agb" target="_blank" rel="noopener noreferrer" style={{ color: BRAND, textDecoration: "underline" }}>AGB</a> sowie die <a href="/datenschutz" target="_blank" rel="noopener noreferrer" style={{ color: BRAND, textDecoration: "underline" }}>Datenschutzerklärung</a>. *</>} checked={agb} onChange={setAgb} />
          <Check label={<>Ich beauftrage hiermit verbindlich und <strong>kostenpflichtig</strong> die oben aufgeführten Leistungen zum Gesamtbetrag von <strong>{brutto.toLocaleString("de-DE")} € brutto</strong>. *</>} checked={kostenpflichtig} onChange={setKostenpflichtig} />
          <Check label={<>Bestellbestätigung an meine E-Mail senden</>} checked={sendCopy} onChange={setSendCopy} />
        </div>

        {error && (
          <div style={{ marginTop: 14, padding: "10px 14px", background: "#FEE2E2", color: "#991B1B", borderRadius: 10, fontSize: 13 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          style={{
            marginTop: 20, width: "100%",
            padding: "14px 24px",
            background: canSubmit ? BRAND_GRADIENT : "rgba(79,63,240,0.4)",
            color: "#fff", fontSize: 16, fontWeight: 700,
            border: "none", borderRadius: 50,
            cursor: canSubmit ? "pointer" : "not-allowed",
            fontFamily: "inherit",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          {submitting ? <><Loader2 size={16} className="animate-spin" /> Wird verarbeitet…</> : <>Zahlungspflichtig bestellen →</>}
        </button>
        <p style={{ marginTop: 12, fontSize: 11, color: TEXT_MUTED, textAlign: "center" }}>
          Mit Klick erteilen Sie einen verbindlichen Auftrag. Zeitstempel und IP-Adresse werden zu Beweiszwecken gespeichert.
        </p>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: TEXT_DARK }}>
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          marginTop: 4, width: "100%", padding: "10px 12px",
          border: "1.5px solid rgba(79,63,240,0.2)",
          borderRadius: 10, fontSize: 14, fontFamily: "inherit",
          outline: "none", color: TEXT_DARK, background: "#fff",
        }}
      />
    </label>
  );
}

function Check({ label, checked, onChange }: { label: React.ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", fontSize: 13, color: TEXT_DARK, lineHeight: 1.5 }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ marginTop: 3, width: 16, height: 16, accentColor: BRAND, flexShrink: 0 }}
      />
      <span>{label}</span>
    </label>
  );
}

function BookingSuccessOverlay({ auftragsNr, onClose }: { auftragsNr: string; onClose: () => void }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: "rgba(30,27,75,0.7)",
      backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{
        background: "#fff", borderRadius: 24, padding: "44px 36px", maxWidth: 480, width: "100%",
        textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: `${BRAND}15`, color: BRAND,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <CheckCheck size={32} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: TEXT_DARK, marginBottom: 10 }}>
          Vielen Dank für Ihren Auftrag!
        </h2>
        <p style={{ color: TEXT_MUTED, fontSize: 15, marginBottom: 16 }}>
          Ihre Bestellung wurde verbindlich erfasst. Sie erhalten in Kürze eine Bestätigung per E-Mail.
        </p>
        <div style={{
          display: "inline-block", background: BG_SOFT, color: TEXT_DARK,
          padding: "10px 18px", borderRadius: 12, fontWeight: 700, fontSize: 15, marginBottom: 24,
        }}>
          Auftrags-Nr.: <span style={{ color: BRAND }}>{auftragsNr}</span>
        </div>
        <div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: BRAND_GRADIENT, color: "#fff",
              padding: "12px 28px", borderRadius: 50, border: "none",
              fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SHARED DESIGN COMPONENTS
// ═══════════════════════════════════════════════════════════

function SectionDivider() {
  return (
    <div style={{
      width: 60, height: 3,
      background: "linear-gradient(90deg, #4F3FF0, #7B5EF8)",
      borderRadius: 2, margin: "0 auto 48px",
    }} />
  );
}

function AngebotGlobalStyles() {
  return (
    <style>{`
      :root {
        --angebot-sticky-space: 96px;
      }
      @media (max-width: 640px) {
        :root {
          --angebot-sticky-space: 172px;
        }
      }

      @keyframes ang-blob-float {
        0%, 100% { transform: translate(0,0) scale(1); }
        33% { transform: translate(15px,-20px) scale(1.05); }
        66% { transform: translate(-10px,10px) scale(0.97); }
      }
      @keyframes ang-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.8); }
      }
      @keyframes ang-reveal-in {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .ang-blob {
        position: absolute; border-radius: 50%;
        pointer-events: none; z-index: 0;
        animation: ang-blob-float 8s ease-in-out infinite;
      }

      /* Hero deco — geometrische Kreise (wie Hauptseite) */
      .ang-hero-deco {
        position: absolute; inset: 0;
        overflow: hidden; pointer-events: none; z-index: 1;
      }
      .ang-deco-circle-lg {
        position: absolute; top: -60px; right: -60px;
        width: 320px; height: 320px; border-radius: 50%;
        border: 2px solid rgba(79,63,240,0.12);
      }
      .ang-deco-circle-md {
        position: absolute; top: 35%; right: 8%;
        width: 180px; height: 180px; border-radius: 50%;
        border: 1.5px solid rgba(79,63,240,0.08);
      }
      .ang-deco-dot {
        position: absolute; border-radius: 50%;
      }
      .ang-deco-dot-1 {
        top: 15%; right: 20%;
        width: 10px; height: 10px;
        background: rgba(79,63,240,0.25);
      }
      .ang-deco-dot-2 {
        bottom: 20%; right: 35%;
        width: 6px; height: 6px;
        background: rgba(123,94,248,0.2);
      }
      .ang-deco-circle-bl {
        position: absolute; bottom: -140px; left: -80px;
        width: 280px; height: 280px; border-radius: 50%;
        border: 2px solid rgba(79,63,240,0.08);
      }
      @media (max-width: 720px) {
        .ang-deco-circle-lg { width: 220px; height: 220px; top: -40px; right: -80px; }
        .ang-deco-circle-md { display: none; }
        .ang-deco-circle-bl { width: 200px; height: 200px; bottom: -120px; left: -100px; }
      }

      /* Reveal */
      .ang-reveal {
        opacity: 0;
        animation: ang-reveal-in 0.55s ease-out forwards;
      }
      .ang-d-3 { animation-delay: 300ms; }
      .ang-d-4 { animation-delay: 400ms; }
      .ang-d-5 { animation-delay: 500ms; }
      .ang-d-6 { animation-delay: 600ms; }
      .ang-d-7 { animation-delay: 700ms; }
      .ang-stagger-leist > .ang-reveal { /* delays set inline */ }

      /* Countdown — inline (kein Kasten) */
      /* Countdown — Glassmorphism Gradient */
      .ang-count-wrap { display: flex; flex-direction: column; align-items: flex-start; }
      .ang-count-pill {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 7px 14px;
        background: rgba(255,255,255,0.85);
        border: 1px solid rgba(15,23,42,0.08);
        border-radius: 999px;
        box-shadow: 0 1px 2px rgba(15,23,42,0.04);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        font-size: 13px; font-weight: 600; color: #475569;
        letter-spacing: 0.01em;
        margin-bottom: 22px;
      }
      .ang-count-pill strong { color: #4F3FF0; font-weight: 700; }
      .ang-count-row {
        position: relative;
        display: flex; align-items: flex-start; justify-content: flex-start;
        gap: 16px; flex-wrap: nowrap;
      }
      .ang-count-glow {
        position: absolute; inset: -10px -20px;
        background: linear-gradient(90deg, rgba(79,63,240,0.12), rgba(91,141,239,0.12));
        filter: blur(48px);
        border-radius: 999px;
        opacity: 0.55;
        pointer-events: none; z-index: 0;
      }
      .ang-count-block {
        position: relative; z-index: 1;
        display: flex; flex-direction: column; align-items: center;
      }
      .ang-count-card {
        position: relative;
        width: 84px; height: 96px;
        display: flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
        border: 1px solid #FFFFFF;
        border-radius: 20px;
        box-shadow:
          0 1px 2px rgba(15,23,42,0.04),
          0 12px 32px -8px rgba(79,63,240,0.18),
          inset 0 1px 0 rgba(255,255,255,0.9);
        overflow: hidden;
      }
      .ang-count-num {
        font-family: 'Poppins', sans-serif;
        font-size: 44px; font-weight: 700; line-height: 1;
        font-variant-numeric: tabular-nums;
        background: linear-gradient(135deg, #4F3FF0 0%, #5B8DEF 100%);
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent; color: transparent;
      }
      .ang-count-lab {
        margin-top: 12px;
        font-size: 11px; font-weight: 700; color: #94A3B8;
        text-transform: uppercase; letter-spacing: 0.22em;
      }
      .ang-count-lab.is-live { color: #4F3FF0; }
      .ang-count-sep {
        position: relative; z-index: 1;
        display: inline-flex; flex-direction: column; gap: 6px;
        align-self: center;
        padding-bottom: 28px;
      }
      .ang-count-sep i {
        width: 5px; height: 5px; border-radius: 999px;
        background: #CBD5E1; display: block;
      }
      @media (max-width: 560px) {
        .ang-count-row { gap: 10px; }
        .ang-count-card { width: 64px; height: 78px; border-radius: 16px; }
        .ang-count-num { font-size: 32px; }
        .ang-count-lab { font-size: 10px; letter-spacing: 0.18em; margin-top: 10px; }
        .ang-count-sep { padding-bottom: 24px; }
        .ang-count-sep i { width: 4px; height: 4px; }
        .ang-count-pill { font-size: 12px; padding: 6px 12px; }
      }

      /* Trust stats row — Icon-Liste mit Hairlines */
      .ang-trust-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        max-width: 1120px;
        margin: 0 auto;
        gap: 24px;
        background: transparent;
      }
      .ang-trust-item {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 16px;
        padding: 32px 24px;
        background: #FFFFFF;
        border: 1px solid #F1F5F9;
        border-radius: 20px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.04);
        transition: transform .3s ease, box-shadow .3s ease;
      }
      .ang-trust-item:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 40px rgba(79,63,240,0.08);
      }
      .ang-trust-item:hover .ang-trust-item-icon {
        background: rgba(79,63,240,0.1);
      }
      .ang-trust-item-icon {
        flex-shrink: 0;
        width: 48px; height: 48px;
        border-radius: 14px;
        background: rgba(79,63,240,0.05);
        color: #4F3FF0;
        display: flex; align-items: center; justify-content: center;
        transition: background .3s ease;
      }
      .ang-trust-item-icon svg { width: 24px; height: 24px; }
      .ang-trust-item-value {
        font-size: clamp(30px, 2.6vw, 38px);
        font-weight: 800;
        color: #4F3FF0;
        line-height: 1;
        letter-spacing: -0.03em;
        margin-bottom: 4px;
      }
      .ang-trust-item-label {
        font-size: 11px;
        color: #94A3B8;
        font-weight: 700;
        line-height: 1.4;
        text-transform: uppercase;
        letter-spacing: 0.12em;
      }
      .ang-trust-mobile { display: none; }
      @media (max-width: 720px) {
        .ang-trust-row { display: none; }
        .ang-trust-mobile { display: block; }
      }

      /* Trust stats — Mobile icon list with hairlines */
      .ang-trust-list {
        background: #FFFFFF;
        border: 1px solid rgba(79,63,240,0.08);
        border-radius: 32px;
        padding: 8px 0;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03), 0 12px 32px -16px rgba(79,63,240,0.16);
      }
      .ang-trust-row-item {
        display: grid;
        grid-template-columns: 44px 1fr auto;
        align-items: center;
        gap: 14px;
        padding: 16px 20px;
        min-width: 0;
      }
      .ang-trust-icon {
        width: 44px; height: 44px;
        border-radius: 14px;
        background: linear-gradient(135deg, rgba(237,233,255,0.9), rgba(245,244,255,0.9));
        color: #4F3FF0;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      .ang-trust-label {
        font-size: 13.5px;
        color: #6B7280;
        font-weight: 500;
        line-height: 1.3;
        min-width: 0;
        word-break: normal;
        overflow-wrap: break-word;
      }
      .ang-trust-value {
        font-size: 24px;
        font-weight: 800;
        line-height: 1;
        background: linear-gradient(135deg,#4F3FF0 0%,#7B5EF8 50%,#5B8DEF 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: -0.02em;
        white-space: nowrap;
        padding-left: 8px;
        order: 3;
      }
      .ang-trust-row-item .ang-trust-label { order: 2; }
      .ang-trust-hairline {
        height: 1px;
        background: rgba(79,63,240,0.08);
        margin: 0 20px;
      }

      /* Leistungs-Cards */
      .angebot-leistung-card {
        background: #FFFFFF;
        border: 1px solid rgba(79,63,240,0.08);
        border-left: 3px solid #4F3FF0;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 2px 16px rgba(79,63,240,0.05);
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: default;
      }
      .ang-leist-emoji {
        width: 52px; height: 52px;
        background: linear-gradient(135deg, #EDE9FF, #F5F4FF);
        border-radius: 14px;
        display: flex; align-items: center; justify-content: center;
        font-size: 26px; margin-bottom: 16px;
      }
      @media (hover: hover) {
        .angebot-leistung-card:hover {
          box-shadow: 0 8px 32px rgba(79,63,240,0.14);
          transform: translateY(-4px);
          border-left-color: #7B5EF8;
          background: linear-gradient(160deg, #FFFFFF 0%, #FAFAFF 100%);
        }
      }

      /* Miete-Card decorative glow */
      .ang-price-miete::before {
        content: "";
        position: absolute; top: 0; right: 0;
        width: 150px; height: 150px;
        background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
        border-radius: 0 20px 0 0;
        pointer-events: none;
      }

      /* Buttons */
      @media (hover: hover) {
        .ang-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(79,63,240,0.45) !important;
        }
        .ang-btn-outline:hover {
          background: #F5F4FF !important;
        }
      }

      /* Sticky bar pulse dot */
      .ang-pulse-dot {
        width: 6px; height: 6px; border-radius: 50%;
        background: #EF4444; display: inline-block;
        animation: ang-pulse 1.5s ease-in-out infinite;
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .ang-pulse-dot, .ang-reveal,
        .angebot-leistung-card { animation: none !important; transition: none !important; }
        .ang-reveal { opacity: 1 !important; transform: none !important; }
      }

      /* Mobile: disable hover transforms */
      @media (hover: none) {
        .angebot-leistung-card:hover { transform: none !important; }
      }
    `}</style>
  );
}
