import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFunnel, type Stil, type Ziel } from "../state";
import { STIL_LABEL, ZIEL_LABEL } from "../utils";

const stile: { key: Stil; sw: string[]; hint: string }[] = [
  { key: "hell-modern", sw: ["#ffffff", "#f8fafc", "#0f172a"], hint: "Clean, viel Weißraum" },
  { key: "dunkel-edel", sw: ["#0a0a0f", "#1a1a2e", "#e94560"], hint: "Premium, kontrastreich" },
  { key: "logo-angepasst", sw: ["var(--primary-swatch)"], hint: "Farben aus deinem Logo" },
  { key: "ueberrascht", sw: ["#7c3aed", "#3b82f6", "#10b981"], hint: "Wir wählen für dich" },
];

const ziele: { key: Ziel; emoji: string }[] = [
  { key: "mehr-anfragen", emoji: "📈" },
  { key: "professioneller", emoji: "💎" },
  { key: "mitarbeiter", emoji: "👷" },
  { key: "google", emoji: "🔍" },
];

export default function Step2Fragen() {
  const { state, patch, next, back } = useFunnel();
  const idx = state.fragenIndex;

  const total = 5;
  const setIdx = (i: number) => patch({ fragenIndex: Math.max(0, Math.min(total - 1, i)) });

  const handleNext = () => {
    if (idx === total - 1) {
      patch({ fragenIndex: 0 });
      next();
    } else {
      setIdx(idx + 1);
    }
  };
  const handleBack = () => {
    if (idx === 0) back();
    else setIdx(idx - 1);
  };

  const valid = (() => {
    if (idx === 0) return state.firmenname.trim().length >= 2 && state.ort.trim().length >= 2;
    if (idx === 1) return state.gewerk.trim().length >= 2 && state.leistungen.trim().length >= 3;
    if (idx === 2) {
      if (state.hatWebsite === null) return false;
      return true;
    }
    if (idx === 3) return !!state.stil;
    if (idx === 4) return !!state.ziel;
    return false;
  })();

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-32 md:pb-12">
      <div className="text-xs text-muted-foreground mb-2">Frage {idx + 1} von {total}</div>
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {idx === 0 && (
            <>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Wie heißt dein Betrieb und wo seid ihr zuhause?
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="firma">Firmenname *</Label>
                  <Input
                    id="firma"
                    value={state.firmenname}
                    onChange={(e) => patch({ firmenname: e.target.value })}
                    placeholder="z. B. Müller Sanitär GmbH"
                    className="mt-1 h-12"
                    autoFocus
                  />
                </div>
                <div>
                  <Label htmlFor="ort">Stadt / Region *</Label>
                  <Input
                    id="ort"
                    value={state.ort}
                    onChange={(e) => patch({ ort: e.target.value })}
                    placeholder="z. B. Mainz"
                    className="mt-1 h-12"
                  />
                </div>
              </div>
            </>
          )}

          {idx === 1 && (
            <>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Was machst du? Nenn uns dein Gewerk und deine 3 wichtigsten Leistungen.
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="gewerk">Gewerk / Branche *</Label>
                  <Input
                    id="gewerk"
                    value={state.gewerk}
                    onChange={(e) => patch({ gewerk: e.target.value })}
                    placeholder="z. B. Heizungsbauer"
                    className="mt-1 h-12"
                    autoFocus
                  />
                </div>
                <div>
                  <Label htmlFor="leistungen">Deine Top-Leistungen *</Label>
                  <Textarea
                    id="leistungen"
                    value={state.leistungen}
                    onChange={(e) => patch({ leistungen: e.target.value })}
                    placeholder="z. B. Badsanierung, Heizungsinstallation, Notdienst"
                    className="mt-1 min-h-24"
                  />
                </div>
              </div>
            </>
          )}

          {idx === 2 && (
            <>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Hast du schon eine Website?</h2>
              <RadioGroup
                value={state.hatWebsite === null ? "" : state.hatWebsite ? "ja" : "nein"}
                onValueChange={(v) => patch({ hatWebsite: v === "ja" })}
                className="space-y-3"
              >
                {[
                  { v: "ja", l: "Ja" },
                  { v: "nein", l: "Nein, noch nicht" },
                ].map((o) => (
                  <label
                    key={o.v}
                    className={`flex items-center gap-3 rounded-xl border p-4 min-h-14 cursor-pointer hover:bg-muted/50 ${
                      (state.hatWebsite ? "ja" : state.hatWebsite === false ? "nein" : "") === o.v
                        ? "border-primary bg-primary/5"
                        : ""
                    }`}
                  >
                    <RadioGroupItem value={o.v} />
                    <span className="font-medium">{o.l}</span>
                  </label>
                ))}
              </RadioGroup>
              {state.hatWebsite && (
                <div className="mt-4">
                  <Label htmlFor="url">Deine aktuelle Website (optional)</Label>
                  <Input
                    id="url"
                    type="url"
                    inputMode="url"
                    value={state.websiteUrl}
                    onChange={(e) => patch({ websiteUrl: e.target.value })}
                    placeholder="https://…"
                    className="mt-1 h-12"
                  />
                </div>
              )}
            </>
          )}

          {idx === 3 && (
            <>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Welcher Stil passt zu dir?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stile.map((s) => {
                  const active = state.stil === s.key;
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => patch({ stil: s.key })}
                      className={`text-left rounded-2xl border p-5 min-h-24 transition-all ${
                        active ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex gap-1 mb-3">
                        {s.sw.map((c, i) =>
                          c.startsWith("var(") ? (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full bg-primary border"
                            />
                          ) : (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full border"
                              style={{ background: c }}
                            />
                          ),
                        )}
                      </div>
                      <div className="font-semibold">{STIL_LABEL[s.key]}</div>
                      <div className="text-sm text-muted-foreground">{s.hint}</div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {idx === 4 && (
            <>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Was ist das wichtigste Ziel deiner neuen Website?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ziele.map((z) => {
                  const active = state.ziel === z.key;
                  return (
                    <button
                      key={z.key}
                      type="button"
                      onClick={() => patch({ ziel: z.key })}
                      className={`text-left rounded-2xl border p-5 min-h-24 transition-all ${
                        active ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="text-3xl mb-2">{z.emoji}</div>
                      <div className="font-semibold">{ZIEL_LABEL[z.key]}</div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="md:static fixed bottom-0 left-0 right-0 p-4 md:p-0 md:mt-10 bg-background/95 md:bg-transparent backdrop-blur md:backdrop-blur-none border-t md:border-0 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={handleBack}>
          ← Zurück
        </Button>
        <Button variant="gradient" onClick={handleNext} disabled={!valid} className="min-h-12 flex-1 md:flex-none">
          {idx === total - 1 ? "Weiter →" : "Weiter →"}
        </Button>
      </div>
    </div>
  );
}
