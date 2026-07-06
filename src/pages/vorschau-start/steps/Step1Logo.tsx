import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { useFunnel } from "../state";
import { uploadFile } from "../utils";

const ACCEPT = "image/png,image/jpeg,image/svg+xml,image/webp,application/pdf";
const MAX_MB = 10;

export default function Step1Logo() {
  const { state, patch, next, back } = useFunnel();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Datei zu groß (max. ${MAX_MB} MB)`);
      return;
    }
    setUploading(true);
    try {
      const { url } = await uploadFile(state.funnelUuid, "logo", file);
      patch({ logoUrl: url, logoName: file.name, keinLogo: false });
    } catch (e) {
      console.error(e);
      toast.error("Upload fehlgeschlagen — versuch's nochmal.");
    } finally {
      setUploading(false);
    }
  }

  const canContinue = !!state.logoUrl || state.keinLogo;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto px-4 pt-6 pb-32 md:pb-12"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-3">Lade dein aktuelles Logo hoch</h2>
      <p className="text-muted-foreground mb-8">
        Wir übernehmen deine Farben und deinen Stil in die Vorschau.
      </p>

      {state.logoUrl ? (
        <div className="rounded-2xl border bg-card p-4 flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden flex items-center justify-center">
            <img src={state.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{state.logoName}</div>
            <div className="text-xs text-muted-foreground">Hochgeladen</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => patch({ logoUrl: null, logoName: null })}
            aria-label="Logo entfernen"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`w-full rounded-2xl border-2 border-dashed p-10 md:p-14 text-center transition-colors ${
            drag ? "border-primary bg-primary/5" : "border-muted-foreground/30 bg-muted/30"
          } hover:border-primary hover:bg-primary/5`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span>Wird hochgeladen …</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-8 h-8 text-primary" />
              <div className="font-medium">Datei hier ablegen oder klicken</div>
              <div className="text-xs text-muted-foreground">
                PNG, JPG, SVG, WEBP, PDF · max. {MAX_MB} MB
              </div>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </button>
      )}

      <button
        type="button"
        onClick={() => patch({ keinLogo: true, logoUrl: null, logoName: null })}
        className="text-sm text-muted-foreground underline underline-offset-4 mt-4 block mx-auto"
      >
        {state.keinLogo ? "✓ Kein Logo — überspringen aktiv" : "Ich habe (noch) kein Logo"}
      </button>

      <div className="md:static fixed bottom-0 left-0 right-0 p-4 md:p-0 md:mt-10 bg-background/95 md:bg-transparent backdrop-blur md:backdrop-blur-none border-t md:border-0 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={back}>
          ← Zurück
        </Button>
        <Button variant="gradient" onClick={next} disabled={!canContinue || uploading} className="min-h-12 flex-1 md:flex-none">
          Weiter →
        </Button>
      </div>
    </motion.div>
  );
}
