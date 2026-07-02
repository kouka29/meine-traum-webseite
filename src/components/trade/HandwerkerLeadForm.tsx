import { useState, FormEvent } from "react";
import { Check, Phone } from "lucide-react";
import { z } from "zod";
import { submitLead } from "@/lib/submitLead";
import { toast } from "sonner";

interface Props {
  branche?: string;
  withMessage?: boolean;
}

const BRANCHEN = [
  "Elektriker",
  "Maler",
  "Sanitär & Heizung",
  "Dachdecker",
  "Schreiner",
  "Fliesenleger",
  "Garten & Landschaft",
  "KFZ-Betrieb",
  "Sonstiges",
];

const schema = z.object({
  vorname: z.string().trim().min(1, "Bitte Vornamen angeben").max(80),
  telefon: z.string().trim().min(5, "Bitte Telefonnummer angeben").max(30),
  branche: z.string().min(1, "Bitte Branche wählen"),
  ort: z.string().trim().min(1, "Bitte Ort angeben").max(80),
  email: z.union([z.string().trim().email("Ungültige E-Mail").max(160), z.literal("")]).optional(),
});

const HandwerkerLeadForm = ({ branche = "", withMessage = false }: Props) => {
  const [form, setForm] = useState({ vorname: "", telefon: "", branche, ort: "", email: "", nachricht: "", company: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    const ok = await submitLead({
      name: form.vorname,
      phone: form.telefon,
      email: form.email,
      branche: form.branche,
      ort: form.ort,
      message: form.nachricht,
      company: form.company,
      source_cta: withMessage ? "kontakt_hauptformular" : "hero_vorschau",
    });
    setLoading(false);
    if (ok) {
      setSubmitted(true);
    } else {
      toast.error("Bitte ruf kurz an: 06131 3076498");
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center flex flex-col items-center gap-4 shadow-card">
        <Check size={24} style={{ color: "#10B981" }} aria-hidden={true} focusable={false} />
        <p className="text-base font-semibold text-foreground">
          ✅ Super! Ich melde mich innerhalb von 2 Stunden bei Dir. Schau kurz auf Dein Handy!
        </p>
        <a
          href="tel:+4961313076498"
          className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
          style={{ color: "#5B5FEF" }}
        >
          <Phone size={16} aria-hidden={true} focusable={false} /> Lieber direkt anrufen? 06131 3076498
        </a>
      </div>
    );
  }

  const inputCls = (field: string) =>
    `w-full rounded-xl border px-4 py-3 text-sm bg-background outline-none focus:ring-2 focus:ring-[#5B5FEF]/30 transition ${
      errors[field] ? "border-red-500" : "border-border"
    }`;

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col gap-4 shadow-card">
      <div>
        <input
          type="text"
          placeholder="Dein Vorname"
          value={form.vorname}
          onChange={(e) => setForm({ ...form, vorname: e.target.value })}
          className={inputCls("vorname")}
        />
        {errors.vorname && <p className="text-xs text-red-500 mt-1">{errors.vorname}</p>}
      </div>
      <div>
        <input
          type="tel"
          placeholder="0151 234 56789"
          value={form.telefon}
          onChange={(e) => setForm({ ...form, telefon: e.target.value })}
          className={inputCls("telefon")}
        />
        {errors.telefon && <p className="text-xs text-red-500 mt-1">{errors.telefon}</p>}
      </div>
      <div>
        <select
          value={form.branche}
          onChange={(e) => setForm({ ...form, branche: e.target.value })}
          className={inputCls("branche")}
        >
          <option value="">Bitte wählen</option>
          {BRANCHEN.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        {errors.branche && <p className="text-xs text-red-500 mt-1">{errors.branche}</p>}
      </div>
      <div>
        <input
          type="text"
          placeholder="z.B. Mainz"
          value={form.ort}
          onChange={(e) => setForm({ ...form, ort: e.target.value })}
          className={inputCls("ort")}
        />
        {errors.ort && <p className="text-xs text-red-500 mt-1">{errors.ort}</p>}
      </div>
      {withMessage && (
        <div>
          <textarea
            placeholder="Z.B.: Ich bin Elektriker in Mainz und brauche eine neue Website..."
            value={form.nachricht}
            onChange={(e) => setForm({ ...form, nachricht: e.target.value })}
            rows={3}
            className={inputCls("nachricht") + " resize-none"}
          />
        </div>
      )}
      <div>
        <input
          type="email"
          placeholder="email@beispiel.de (optional)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputCls("email")}
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>
      {/* Honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={form.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
        style={{ background: "#5B5FEF" }}
      >
        {loading ? "Wird gesendet…" : "Kostenlose Vorschau anfordern →"}
      </button>
      <p className="text-xs text-center text-muted-foreground">
        ⏱ Meldung innerhalb 2 Stunden · 🔒 Keine Datenweitergabe · Kein Spam
      </p>
    </form>
  );
};

export default HandwerkerLeadForm;
