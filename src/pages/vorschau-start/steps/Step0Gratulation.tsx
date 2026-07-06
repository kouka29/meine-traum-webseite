import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useFunnel } from "../state";
import { currentMonthLabel, fetchFunnelAvailability } from "../utils";
import { CheckCircle2, Upload, Calendar, ShieldCheck } from "lucide-react";

const PLAETZE_FALLBACK = 5;

export default function Step0Gratulation() {
  const { next } = useFunnel();
  const [total, setTotal] = useState<number>(PLAETZE_FALLBACK);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [confettiMod, avail] = await Promise.all([
        import("canvas-confetti"),
        fetchFunnelAvailability(),
      ]);
      if (cancelled) return;
      if (avail) setTotal(avail.total);
      const confetti = confettiMod.default;
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.35 },
        disableForReducedMotion: true,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-2xl mx-auto text-center px-4 pt-4 pb-32 md:pb-16"
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-semibold mb-6">
        <CheckCircle2 className="w-4 h-4" />
        Platz gesichert · {currentMonthLabel()}
      </div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Glückwunsch! 🎉{" "}
        <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Dein Vorschau-Platz ist gesichert.
        </span>
      </h1>
      <p className="text-lg text-muted-foreground mb-6">
        Diesen Monat vergeben wir nur <strong>{total}</strong> kostenlose Website-Vorschauen —
        einer davon gehört jetzt dir.
      </p>

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 mb-10 text-left flex gap-4 items-start shadow-elegant">
        <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="text-sm leading-relaxed">
          <div className="font-semibold text-base mb-1">
            Komplett kostenlos & unverbindlich.
          </div>
          <p className="text-muted-foreground">
            Wir bauen deine Vorschau <strong>auf unsere Kosten</strong>. Erst wenn sie dir gefällt,
            sprechen wir über Preise. Gefällt sie dir nicht: entstehen dir{" "}
            <strong>keinerlei Kosten</strong> — versprochen.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-10 text-left">
        {[
          { icon: CheckCircle2, title: "1. Kurze Fragen (2 Min)", desc: "Wir lernen deinen Betrieb kennen." },
          { icon: Upload, title: "2. Logo & Fotos hochladen", desc: "Damit deine Vorschau echt aussieht." },
          { icon: Calendar, title: "3. Termin wählen", desc: "Wir zeigen dir deine fertige Vorschau." },
        ].map((s) => (
          <div key={s.title} className="rounded-2xl border bg-card p-5 shadow-elegant">
            <s.icon className="w-6 h-6 text-primary mb-3" />
            <div className="font-semibold mb-1">{s.title}</div>
            <div className="text-sm text-muted-foreground">{s.desc}</div>
          </div>
        ))}
      </div>

      <div className="md:static fixed bottom-0 left-0 right-0 p-4 md:p-0 bg-background/95 md:bg-transparent backdrop-blur md:backdrop-blur-none border-t md:border-0 z-10">
        <Button variant="gradient" size="lg" onClick={next} className="w-full md:w-auto min-h-12 text-base font-semibold">
          Los geht&apos;s →
        </Button>
      </div>
    </motion.div>
  );
}
