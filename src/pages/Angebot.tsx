import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Lock, Shield, Clock, Sparkles, CheckCircle2, FileDown, Eye, Loader2, X, CheckCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

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

  const optionen = data.optionen ?? [];
  const bundles = data.bundles ?? [];

  const toggleOption = (id: string) =>
    setSelectedOptionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  // Match-Logik: 0 → Hauptangebot; 1 → Einzel-Link; >=2 → Bundle (oder "auf Anfrage")
  const selectedOptions = optionen.filter((o) => selectedOptionIds.includes(o.id));
  const matchedBundle = selectedOptions.length >= 2
    ? bundles.find((b) =>
        b.option_ids.length === selectedOptions.length &&
        b.option_ids.every((id) => selectedOptionIds.includes(id))
      )
    : null;

  let ctaLink: string | null = data.stripe_link || null;
  let ctaMode: "haupt" | "option" | "bundle" | "anfrage" = "haupt";
  let ctaLabel = "Angebot annehmen & starten →";

  if (selectedOptions.length === 1) {
    const single = selectedOptions[0];
    if (single.stripe_link) {
      ctaLink = single.stripe_link;
      ctaMode = "option";
      ctaLabel = `Angebot + ${single.titel} buchen →`;
    } else {
      ctaLink = null;
      ctaMode = "anfrage";
      ctaLabel = "Auswahl auf Anfrage →";
    }
  } else if (selectedOptions.length >= 2) {
    if (matchedBundle) {
      ctaLink = matchedBundle.stripe_link;
      ctaMode = "bundle";
      ctaLabel = "Bundle buchen →";
    } else {
      ctaLink = null;
      ctaMode = "anfrage";
      ctaLabel = "Auswahl auf Anfrage →";
    }
  }

  // Wenn Rechnung als Zahlart konfiguriert ist → Buchungs-Modal statt Stripe
  const isRechnung = data.payment_method === "rechnung";
  if (isRechnung && ctaMode !== "anfrage") {
    ctaLink = null;
    ctaLabel = "Jetzt verbindlich buchen →";
  }

  // Geschätzter Gesamtpreis (Anzeige): Hauptpreis + einmalige Optionen; monatliche separat
  const einmaligeZusatz = selectedOptions
    .filter((o) => (o.preis_typ ?? "einmalig") === "einmalig")
    .reduce((sum, o) => sum + o.preis, 0);
  const monatlicheZusatz = selectedOptions
    .filter((o) => o.preis_typ === "monatlich")
    .reduce((sum, o) => sum + o.preis, 0);
  const anzeigeGesamt = matchedBundle?.gesamt_preis ?? (data.preis + einmaligeZusatz);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setShowSticky(docHeight > 0 && scrollTop / docHeight > 0.3);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ablaufDate = new Date(data.ablauf_datum);
  const ablaufStr = ablaufDate.toLocaleString("de-DE", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  if (expired) {
    return <ExpiredOverlay />;
  }

  // Positions für Rechnung berechnen (nur einmalige Beträge)
  const buildPositions = (): { titel: string; preis: number }[] => {
    if (matchedBundle?.gesamt_preis) {
      return [{
        titel: `Bundle: ${matchedBundle.label || "Gesamtpaket"}`,
        preis: matchedBundle.gesamt_preis,
      }];
    }
    const list: { titel: string; preis: number }[] = [
      { titel: "Webseiten-Angebot (Hauptleistung)", preis: data.preis },
    ];
    for (const o of selectedOptions) {
      if ((o.preis_typ ?? "einmalig") === "einmalig") {
        list.push({ titel: o.titel, preis: o.preis });
      }
    }
    return list;
  };

  const openBooking = () => {
    setBookingOpen(true);
  };

  return (
    <div style={{ position: "relative", paddingBottom: showSticky ? 96 : 0 }}>
      {/* HERO */}
      <section style={{ background: BG_SOFT, padding: "80px 24px 60px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#fff", color: BRAND,
            padding: "8px 16px", borderRadius: 50,
            fontSize: 13, fontWeight: 600,
            border: `1px solid ${BRAND}20`,
            marginBottom: 24,
          }}>
            <Sparkles size={14} /> Persönliches Angebot — nur für Sie
          </div>

          <h1 style={{
            fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, lineHeight: 1.1,
            color: TEXT_DARK, marginBottom: 20,
          }}>
            Hallo {data.lead_name}, hier ist Ihr{" "}
            <span style={{
              background: BRAND_GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              maßgeschneidertes
            </span>{" "}
            Angebot.
          </h1>

          {data.nachricht && (
            <p style={{ fontSize: 18, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 32, maxWidth: 720 }}>
              {data.nachricht}
            </p>
          )}

          {/* Countdown */}
          <div style={{
            background: "#fff", borderRadius: 16,
            borderLeft: "4px solid #EF4444",
            padding: "20px 24px",
            border: "1px solid rgba(79,63,240,0.1)",
            borderLeftWidth: 4, borderLeftColor: "#EF4444",
            maxWidth: 600,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: TEXT_DARK, fontWeight: 600, marginBottom: 12, fontSize: 14 }}>
              <Clock size={16} color="#EF4444" />
              Dieses Angebot ist reserviert bis: {ablaufStr}
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
              {[
                { v: days, l: "Tage" },
                { v: hours, l: "Std" },
                { v: mins, l: "Min" },
                { v: secs, l: "Sek" },
              ].map((b) => (
                <div key={b.l} style={{ flex: 1, textAlign: "center", background: BG_SOFT, borderRadius: 10, padding: "10px 4px" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: BRAND, fontVariantNumeric: "tabular-nums" }}>
                    {pad(b.v)}
                  </div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, textTransform: "uppercase" }}>{b.l}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13, color: TEXT_MUTED }}>
              Danach wird die Kapazität neu vergeben.
            </div>
          </div>
        </div>
      </section>

      {/* LEISTUNGEN */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: TEXT_DARK, marginBottom: 40, textAlign: "center" }}>
            Was wir gemeinsam umsetzen
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}>
            {data.leistungen.map((l, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 20,
                border: "1px solid rgba(79,63,240,0.1)",
                padding: 28,
                transition: "all 0.2s",
              }}>
                {l.emoji && <div style={{ fontSize: 36, marginBottom: 12 }}>{l.emoji}</div>}
                <h3 style={{ fontSize: 18, fontWeight: 700, color: TEXT_DARK, marginBottom: 8 }}>{l.titel}</h3>
                {l.beschreibung && (
                  <p style={{ fontSize: 15, color: TEXT_MUTED, lineHeight: 1.6 }}>{l.beschreibung}</p>
                )}
              </div>
            ))}
          </div>

          {/* PREIS-CARD */}
          <div style={{
            marginTop: 48,
            background: "#fff", borderRadius: 24,
            border: `2px solid ${BRAND}`,
            padding: "40px 32px",
            textAlign: "center",
            maxWidth: 520, marginLeft: "auto", marginRight: "auto",
            boxShadow: `0 20px 60px ${BRAND}20`,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
              Ihr Investitionsvolumen
            </div>
            <div style={{ fontSize: "clamp(40px, 8vw, 56px)", fontWeight: 800, color: BRAND, lineHeight: 1, marginBottom: 8 }}>
              {Number(data.preis).toLocaleString("de-DE")} €
            </div>
            {data.normalpreis && data.normalpreis > data.preis && (
              <div style={{ fontSize: 20, color: TEXT_MUTED, textDecoration: "line-through", marginBottom: 12 }}>
                {Number(data.normalpreis).toLocaleString("de-DE")} €
              </div>
            )}
            <div style={{ fontSize: 14, color: TEXT_MUTED, marginTop: 12 }}>
              Einmalig. Kein Abo. Keine versteckten Kosten.
            </div>

            {(data.miete_monatlich || data.anzahlung) && (
              <div style={{
                marginTop: 24, paddingTop: 20,
                borderTop: "1px dashed rgba(79,63,240,0.2)",
                display: "grid", gap: 10,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Alternative: flexible Zahlung
                </div>
                {data.anzahlung ? (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, color: TEXT_DARK }}>
                    <span>Einmalige Anzahlung</span>
                    <strong style={{ color: BRAND }}>{Number(data.anzahlung).toLocaleString("de-DE")} €</strong>
                  </div>
                ) : null}
                {data.miete_monatlich ? (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, color: TEXT_DARK }}>
                    <span>Monatliche Miete</span>
                    <strong style={{ color: BRAND }}>{Number(data.miete_monatlich).toLocaleString("de-DE")} € / Monat</strong>
                  </div>
                ) : null}
                <div style={{ fontSize: 12, color: TEXT_MUTED }}>
                  Kein Abo-Zwang. Jederzeit auf einmalige Investition umstellbar.
                </div>
              </div>
            )}
          </div>

          {/* WACHSTUMSPAKET */}
          {data.wachstumspaket_preis ? (
            <div style={{
              marginTop: 24,
              background: BG_SOFT, borderRadius: 20,
              padding: "28px 28px",
              maxWidth: 520, marginLeft: "auto", marginRight: "auto",
              border: `1px dashed ${BRAND}40`,
              textAlign: "center",
            }}>
              <div style={{
                display: "inline-block", background: "#fff", color: BRAND,
                padding: "4px 12px", borderRadius: 50,
                fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                marginBottom: 12,
              }}>
                Optionales Wachstumspaket
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: TEXT_DARK, marginBottom: 8 }}>
                + {Number(data.wachstumspaket_preis).toLocaleString("de-DE")} €
              </div>
              {data.wachstumspaket_beschreibung ? (
                <p style={{ fontSize: 14, color: TEXT_MUTED, lineHeight: 1.6, margin: 0 }}>
                  {data.wachstumspaket_beschreibung}
                </p>
              ) : null}
            </div>
          ) : null}

          {/* OPTIONALE ERWEITERUNGEN */}
          {optionen.length > 0 && (
            <div style={{ marginTop: 48, maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: BRAND, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                  Optionale Erweiterungen
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: TEXT_DARK, marginBottom: 6 }}>
                  Stellen Sie Ihr Paket zusammen
                </h3>
                <p style={{ fontSize: 14, color: TEXT_MUTED }}>
                  Wählen Sie aus, was Sie zusätzlich dazubuchen möchten.
                </p>
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
                        padding: "18px 20px",
                        cursor: "pointer",
                        display: "flex",
                        gap: 14,
                        alignItems: "flex-start",
                        fontFamily: "inherit",
                        transition: "border-color 0.15s, background 0.15s",
                        background: active ? `${BRAND}08` : "#fff",
                      }}
                    >
                      <div style={{
                        width: 24, height: 24, borderRadius: 6,
                        border: `2px solid ${active ? BRAND : "rgba(79,63,240,0.3)"}`,
                        background: active ? BRAND : "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, marginTop: 2,
                      }}>
                        {active && <CheckCircle2 size={16} color="#fff" />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
                          <div style={{ fontWeight: 700, color: TEXT_DARK, fontSize: 16 }}>
                            {o.emoji ? `${o.emoji} ` : ""}{o.titel}
                          </div>
                          <div style={{ fontWeight: 800, color: BRAND, fontSize: 16, whiteSpace: "nowrap" }}>
                            + {Number(o.preis).toLocaleString("de-DE")} €
                            {o.preis_typ === "monatlich" ? <span style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 600 }}> /Monat</span> : null}
                          </div>
                        </div>
                        {o.beschreibung && (
                          <p style={{ fontSize: 14, color: TEXT_MUTED, lineHeight: 1.5, margin: 0 }}>
                            {o.beschreibung}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Live-Summary */}
              {selectedOptions.length > 0 && (
                <div style={{
                  marginTop: 16,
                  background: BG_SOFT, borderRadius: 14,
                  padding: "14px 18px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  flexWrap: "wrap", gap: 8,
                }}>
                  <div style={{ fontSize: 13, color: TEXT_MUTED, fontWeight: 600 }}>
                    Ihre Auswahl ({selectedOptions.length} Option{selectedOptions.length !== 1 ? "en" : ""})
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: BRAND }}>
                      {Number(anzeigeGesamt).toLocaleString("de-DE")} €
                      {matchedBundle?.gesamt_preis ? null : <span style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}> ca.</span>}
                    </div>
                    {monatlicheZusatz > 0 && (
                      <div style={{ fontSize: 13, color: TEXT_MUTED, fontWeight: 600 }}>
                        + {Number(monatlicheZusatz).toLocaleString("de-DE")} € / Monat
                      </div>
                    )}
                  </div>
                </div>
              )}

              {ctaMode === "anfrage" && (
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

      {/* FAQs */}
      {data.faqs && data.faqs.length > 0 && (
        <section style={{ padding: "80px 24px", background: BG_SOFT }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: TEXT_DARK, marginBottom: 32, textAlign: "center" }}>
              Häufige Fragen
            </h2>
            <Accordion type="single" collapsible className="space-y-3">
              {data.faqs.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border rounded-2xl px-5 bg-white"
                  style={{ borderColor: "rgba(79,63,240,0.1)" }}
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline" style={{ color: TEXT_DARK, fontFamily: "inherit" }}>
                    {f.frage}
                  </AccordionTrigger>
                  <AccordionContent style={{ color: TEXT_MUTED, fontSize: 15, lineHeight: 1.6, fontFamily: "inherit" }}>
                    {f.antwort}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{
          maxWidth: 720, margin: "0 auto",
          background: BRAND_GRADIENT,
          borderRadius: 24,
          padding: "56px 40px",
          textAlign: "center",
          color: "#fff",
        }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#fff", marginBottom: 12 }}>
            Bereit, loszulegen?
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.85)", marginBottom: 28 }}>
            Kein Risiko. Einmalige Investition.
          </p>
          {ctaLink ? (
            <a
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "#fff", color: BRAND,
                padding: "16px 36px", borderRadius: 50,
                fontSize: 16, fontWeight: 700,
                textDecoration: "none",
                fontFamily: "inherit",
              }}
            >
              {ctaLabel}
            </a>
          ) : isRechnung && ctaMode !== "anfrage" ? (
            <button
              type="button"
              onClick={openBooking}
              style={{
                display: "inline-block",
                background: "#fff", color: BRAND,
                padding: "16px 36px", borderRadius: 50,
                fontSize: 16, fontWeight: 700,
                border: "none", cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {ctaLabel}
            </button>
          ) : (
            <a
              href={`mailto:hallo@meine-traum-webseite.de?subject=${encodeURIComponent("Angebot-Auswahl für " + data.lead_name)}&body=${encodeURIComponent("Ich möchte folgende Optionen dazubuchen: " + selectedOptions.map((o) => o.titel).join(", "))}`}
              style={{
                display: "inline-block",
                background: "#fff", color: BRAND,
                padding: "16px 36px", borderRadius: 50,
                fontSize: 16, fontWeight: 700,
                textDecoration: "none",
                fontFamily: "inherit",
              }}
            >
              {ctaLabel}
            </a>
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 20, color: "rgba(255,255,255,0.85)", fontSize: 12 }}>
            <Shield size={12} /> {isRechnung ? "Bezahlung per Rechnung · 14 Tage Zahlungsziel" : "Sichere Zahlung via Stripe · SSL-verschlüsselt"}
          </div>
        </div>
      </section>

      {/* STICKY BOTTOM BAR */}
      {showSticky && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "#fff", borderTop: "1px solid rgba(79,63,240,0.1)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
          padding: "12px 24px",
          zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          flexWrap: "wrap",
        }}>
          <div style={{ color: TEXT_DARK, fontWeight: 600, fontSize: 15 }}>
            <span style={{ color: BRAND, fontWeight: 800 }}>{Number(anzeigeGesamt).toLocaleString("de-DE")} €</span>
            <span style={{ color: TEXT_MUTED, fontWeight: 500 }}> · Angebot läuft ab in {days} Tagen</span>
          </div>
          {ctaLink ? (
            <a
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: BRAND_GRADIENT, color: "#fff",
                padding: "12px 28px", borderRadius: 50,
                fontSize: 15, fontWeight: 700, textDecoration: "none",
                fontFamily: "inherit",
              }}
            >
              Jetzt starten →
            </a>
          ) : isRechnung && ctaMode !== "anfrage" ? (
            <button
              type="button"
              onClick={openBooking}
              style={{
                background: BRAND_GRADIENT, color: "#fff",
                padding: "12px 28px", borderRadius: 50,
                fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Jetzt verbindlich buchen →
            </button>
          ) : (
            <a
              href="mailto:hallo@meine-traum-webseite.de"
              style={{
                background: BRAND_GRADIENT, color: "#fff",
                padding: "12px 28px", borderRadius: 50,
                fontSize: 15, fontWeight: 700, textDecoration: "none",
                fontFamily: "inherit",
              }}
            >
              Auf Anfrage →
            </a>
          )}
        </div>
      )}

      {bookingOpen && !bookingSuccess && (
        <BookingModal
          data={data}
          positions={buildPositions()}
          onClose={() => setBookingOpen(false)}
          onSuccess={(nr) => { setBookingSuccess(nr); }}
        />
      )}
      {bookingSuccess && (
        <BookingSuccessOverlay auftragsNr={bookingSuccess} onClose={() => { setBookingSuccess(null); setBookingOpen(false); }} />
      )}
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
