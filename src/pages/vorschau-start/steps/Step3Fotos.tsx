import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { useFunnel } from "../state";
import { uploadFile } from "../utils";

const ACCEPT = "image/png,image/jpeg,image/webp,image/heic,image/heif";
const MAX_MB = 10;
const MAX_FILES = 3;

export default function Step3Fotos() {
  const { state, patch, next, back } = useFunnel();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const remaining = MAX_FILES - state.fotos.length;
    const toUpload = Array.from(files).slice(0, remaining);
    setUploading(true);
    try {
      for (const f of toUpload) {
        if (f.size > MAX_MB * 1024 * 1024) {
          toast.error(`${f.name}: zu groß (max. ${MAX_MB} MB)`);
          continue;
        }
        const { url } = await uploadFile(state.funnelUuid, "fotos", f);
        patch({ fotos: [...state.fotos, { url, name: f.name }] });
      }
    } catch (e) {
      console.error(e);
      toast.error("Upload fehlgeschlagen — versuch's nochmal.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const canAddMore = state.fotos.length < MAX_FILES;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto px-4 pt-6 pb-32 md:pb-12"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-3">
        Hast du Fotos von dir, deinem Team oder deiner Arbeit?
      </h2>
      <p className="text-muted-foreground mb-8">
        Bis zu 3 Fotos — echte Bilder machen deine Vorschau deutlich stärker. Keine? Kein Problem,
        wir nutzen erstmal passende Profi-Bilder.
      </p>

      {state.fotos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {state.fotos.map((f, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border bg-muted">
              <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => patch({ fotos: state.fotos.filter((_, j) => j !== i) })}
                className="absolute top-1 right-1 bg-background/90 rounded-full p-1 shadow"
                aria-label="Entfernen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {canAddMore && (
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
          className={`w-full rounded-2xl border-2 border-dashed p-8 md:p-10 text-center transition-colors ${
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
              <div className="font-medium">Fotos hier ablegen oder klicken</div>
              <div className="text-xs text-muted-foreground">
                JPG, PNG, WEBP, HEIC · max. {MAX_MB} MB · noch {MAX_FILES - state.fotos.length} möglich
              </div>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </button>
      )}

      <button
        type="button"
        onClick={next}
        className="text-sm text-muted-foreground underline underline-offset-4 mt-4 block mx-auto"
      >
        Überspringen
      </button>

      <div className="md:static fixed bottom-0 left-0 right-0 p-4 md:p-0 md:mt-10 bg-background/95 md:bg-transparent backdrop-blur md:backdrop-blur-none border-t md:border-0 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={back}>
          ← Zurück
        </Button>
        <Button onClick={next} disabled={uploading} className="min-h-12 flex-1 md:flex-none">
          Weiter →
        </Button>
      </div>
    </motion.div>
  );
}
