import { useSearchParams, Link } from "react-router-dom";
import { Check } from "lucide-react";

export default function ZahlungErfolgreich() {
  const [params] = useSearchParams();
  const auftrag = params.get("auftrag");
  const sessionId = params.get("session_id");

  return (
    <main id="main-content" style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 20px", background: "linear-gradient(135deg,#F5F4FF 0%,#FFFFFF 100%)",
      fontFamily: "'Plus Jakarta Sans', Inter, system-ui, sans-serif",
    }}>
      <div style={{
        maxWidth: 520, width: "100%", background: "#fff",
        borderRadius: 20, padding: "40px 28px",
        boxShadow: "0 20px 60px rgba(79,63,240,0.15)",
        textAlign: "center",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "#10B98115", color: "#10B981",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20,
        }}>
          <Check size={24} strokeWidth={3} aria-hidden={true} focusable={false} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1E1B4B", marginBottom: 10, letterSpacing: "-0.02em" }}>
          Zahlung erfolgreich
        </h1>
        <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.6, marginBottom: 18 }}>
          Vielen Dank! Deine Zahlung wurde erfolgreich verarbeitet.
          {auftrag && (<> Dein Auftrag <strong style={{ color: "#1E1B4B" }}>{auftrag}</strong> ist bestätigt.</>)}
        </p>
        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 24 }}>
          Du erhältst in Kürze eine Bestätigung per E-Mail. Wir melden uns innerhalb von 24 h für die nächsten Schritte.
        </p>
        {sessionId && (
          <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 24, fontFamily: "monospace" }}>
            Ref: {sessionId.slice(0, 24)}…
          </div>
        )}
        <Link to="/" style={{
          display: "inline-block", padding: "12px 24px",
          background: "linear-gradient(135deg,#4F3FF0,#7B5EF8)", color: "#fff",
          fontSize: 15, fontWeight: 700, borderRadius: 12,
          textDecoration: "none",
        }}>
          Zur Startseite
        </Link>
      </div>
    </main>
  );
}