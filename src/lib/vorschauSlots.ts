import { supabase } from "@/integrations/supabase/client";

export const VORSCHAU_TOTAL_SLOTS = 10;

export type Availability = {
  available: number;
  total: number;
  isFull: boolean;
  monthKey: string;
};

export function currentMonthKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export async function checkVorschauAvailability(): Promise<Availability | null> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "check-vorschau-availability",
      { body: {} },
    );
    if (error || !data) return null;
    return data as Availability;
  } catch {
    return null;
  }
}

export type VorschauPayload = {
  name: string;
  email: string;
  company?: string | null;
  website_url?: string | null;
  phone?: string | null;
  source_page: string;
};

export type SubmitResult =
  | { ok: true; status: "slot_assigned" | "waitlist" }
  | { ok: false; error: string };

/**
 * Inserts a row into vorschau_anfragen. Decides slot vs. waitlist based on
 * the availability returned by the edge function. Fails gracefully — if the
 * availability check fails we still try to insert as a normal slot so the
 * form never breaks for the user.
 */
export async function submitVorschauAnfrage(
  payload: VorschauPayload,
): Promise<SubmitResult> {
  const availability = await checkVorschauAvailability();
  const status: "slot_assigned" | "waitlist" =
    availability && availability.isFull ? "waitlist" : "slot_assigned";

  const { error } = await supabase.from("vorschau_anfragen").insert({
    name: payload.name,
    email: payload.email,
    company: payload.company ?? null,
    website_url: payload.website_url ?? null,
    phone: payload.phone ?? null,
    source_page: payload.source_page,
    month_key: currentMonthKey(),
    status,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, status };
}