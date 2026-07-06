import { supabase } from "@/integrations/supabase/client";

export const BUCKET = "funnel-uploads";

/** Add N business days (Mon–Fri) to a date. */
export function addBusinessDays(from: Date, n: number): Date {
  const d = new Date(from);
  let added = 0;
  while (added < n) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) added += 1;
  }
  return d;
}

/** YYYY-MM-DD, local timezone. */
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function currentMonthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function currentMonthLabel(): string {
  return new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric" }).format(new Date());
}

export function formatDateLong(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(y, m - 1, d));
}

const DE_PHONE_RE = /^(\+49|0)[1-9][\d\s\-/()]{7,20}$/;
export function isValidDePhone(v: string): boolean {
  return DE_PHONE_RE.test(v.trim());
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export function isValidEmail(v: string): boolean {
  return EMAIL_RE.test(v.trim());
}

function sanitizeName(name: string): string {
  return name.replace(/[^\w.\-]+/g, "_").slice(0, 80);
}

export async function uploadFile(
  funnelUuid: string,
  kind: "logo" | "fotos",
  file: File,
): Promise<{ url: string; path: string }> {
  const ts = Date.now();
  const safe = sanitizeName(file.name || `${kind}-${ts}`);
  const path = `${funnelUuid}/${kind}/${ts}-${safe}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  // Signed URL good for ~1 year, so admin/Telegram links stay valid.
  const { data: signed, error: signErr } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 365);
  if (signErr) throw signErr;
  return { url: signed.signedUrl, path };
}

export interface Availability {
  available: number;
  total: number;
  isFull: boolean;
}

/** Read `vorschau-funnel` slots directly (public SELECT policy on vorschau_settings). */
export async function fetchFunnelAvailability(): Promise<Availability | null> {
  const { data, error } = await supabase
    .from("vorschau_settings")
    .select("total_slots, taken_slots")
    .eq("page_key", "vorschau-funnel")
    .maybeSingle();
  if (error || !data) return null;
  const total = data.total_slots ?? 5;
  const taken = Math.min(data.taken_slots ?? 0, total);
  const available = Math.max(total - taken, 0);
  return { total, available, isFull: available === 0 };
}

export const WHATSAPP_NUMBER_INT = "4961313076500";
export const WHATSAPP_NUMBER_DISPLAY = "06131 30 765 00";
export function whatsappLink(text = "Hi, ich habe eine Frage zu meiner Vorschau."): string {
  return `https://wa.me/${WHATSAPP_NUMBER_INT}?text=${encodeURIComponent(text)}`;
}

export const STIL_LABEL: Record<string, string> = {
  "hell-modern": "Hell & modern",
  "dunkel-edel": "Dunkel & edel",
  "logo-angepasst": "An mein Logo angepasst",
  "ueberrascht": "Überrascht mich — ihr seid die Profis",
};

export const ZIEL_LABEL: Record<string, string> = {
  "mehr-anfragen": "Mehr Anfragen & Aufträge",
  "professioneller": "Professioneller auftreten",
  "mitarbeiter": "Mitarbeiter finden",
  "google": "Bei Google gefunden werden",
};

export const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
