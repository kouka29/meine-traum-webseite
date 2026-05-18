import { useState, FormEvent } from "react";
import { CheckCircle2, Phone } from "lucide-react";
import { z } from "zod";

interface Props {
  branche?: string;
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

const HandwerkerLeadForm = ({ branche = "" }: Props) => {
  const [form, setForm] = useState({ vorname: "", telefon: "", branche, ort: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
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
    // TODO: backend lead submission wired up in Part 2
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 400);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center flex flex-col items-center gap-4 shadow-card">
        <CheckCircle2 size={48} style={{ color: "#10B981" }} />
        <p className="text-base font-semibold text-foreground">
          ✅ Super! Ich melde mich innerhalb von 2 Stunden bei Dir. Schau kurz auf Dein Handy!
        </p>
        <a
          href="tel:+4961313076498"
          className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
          style={{ color: "#5B5FEF" }}
        >
          <Phone size={16} /> Lieber direkt anrufen? 06131 30 764 98
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
