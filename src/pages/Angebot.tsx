import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Lock, Shield, Clock, Sparkles, CheckCircle2 } from "lucide-react";
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
  const [params] = useSearchParams();
  const d = params.get("d");

  const data: AngebotData | null = useMemo(() => {
    if (!d) return null;
    try {
      const parsed = decodeBase64Utf8(d);
      if (parsed && typeof parsed === "object") return parsed as AngebotData;
      return null;
    } catch {
      return null;
    }
  }, [d]);

  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  if (!data) {
    return (
      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: "100vh", background: BG_SOFT, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 40, maxWidth: 480, textAlign: "center", boxShadow: "0 10px 40px rgba(79,63,240,0.1)" }}>
          <h1 style={{ color: TEXT_DARK, fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Ungültiger Link</h1>
          <p style={{ color: TEXT_MUTED }}>Dieser Angebot-Link ist nicht gültig. Bitte prüfen Sie die URL oder kontaktieren Sie uns.</p>
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
          <a
            href={data.stripe_link}
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
            Angebot annehmen & starten →
          </a>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 20, color: "rgba(255,255,255,0.85)", fontSize: 12 }}>
            <Shield size={12} /> Sichere Zahlung via Stripe · SSL-verschlüsselt
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
            <span style={{ color: BRAND, fontWeight: 800 }}>{Number(data.preis).toLocaleString("de-DE")} €</span>
            <span style={{ color: TEXT_MUTED, fontWeight: 500 }}> · Angebot läuft ab in {days} Tagen</span>
          </div>
          <a
            href={data.stripe_link}
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
        </div>
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