import { motion } from "framer-motion";
import { Check, MessageCircle, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { useFunnel } from "../state";
import {
  formatDateLong,
  STIL_LABEL,
  whatsappLink,
  WHATSAPP_NUMBER_DISPLAY,
  ZIEL_LABEL,
} from "../utils";

export default function Step5Danke() {
  const { state } = useFunnel();
  const vorname = state.name.trim().split(" ")[0] || "Chef";

  useEffect(() => {
    // sessionStorage kann nach Danke gelöscht werden — beim Reload starten wir sauber.
    // Wir lassen ihn aber stehen, damit ein Refresh den Danke-Screen zeigt.
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto text-center px-4 pt-8 pb-24"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 15 }}
        className="w-20 h-20 rounded-full gradient-bg text-primary-foreground mx-auto flex items-center justify-center mb-6 shadow-elegant"
      >
        <Check className="w-10 h-10" strokeWidth={3} />
      </motion.div>

      <h1 className="text-3xl md:text-4xl font-bold mb-3">
        Stark, {vorname}!{" "}
        <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Dein Termin steht.
        </span>
      </h1>
      {state.terminDatum && (
        <p className="text-lg text-muted-foreground mb-8">
          {formatDateLong(state.terminDatum)}, {state.terminUhrzeit} Uhr
        </p>
      )}

      <div className="rounded-2xl border bg-card p-6 text-left space-y-3 mb-6 shadow-elegant">
        <Row label="Betrieb" value={`${state.firmenname} · ${state.ort}`} />
        <Row label="Gewerk" value={state.gewerk} />
        {state.stil && <Row label="Stil" value={STIL_LABEL[state.stil] ?? state.stil} />}
        {state.ziel && <Row label="Ziel" value={ZIEL_LABEL[state.ziel] ?? state.ziel} />}
        <Row
          label="Kontaktart"
          value={state.kontaktart === "phone" ? "Telefon" : "Videocall (WhatsApp/Meet)"}
        />
      </div>

      <p className="text-muted-foreground mb-6">
        Wir melden uns zum Termin unter <strong>{state.telefon}</strong>. Deine Vorschau ist bis
        dahin fertig.
      </p>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-left flex gap-3 items-start mb-8">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-muted-foreground">
          <strong className="text-foreground">Erinnerung:</strong> Die Vorschau ist komplett
          kostenlos. Wenn sie dir nicht gefällt, war&apos;s das — ohne Wenn und Aber.
        </p>
      </div>

      <a
        href={whatsappLink()}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-5 py-3 shadow-lg hover:scale-105 transition-transform"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-medium">Frage? Schreib uns</span>
      </a>

      <div className="text-xs text-muted-foreground">
        Oder direkt anrufen: {WHATSAPP_NUMBER_DISPLAY}
      </div>
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
