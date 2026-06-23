import { supabase } from "@/integrations/supabase/client";

export interface LeadPayload {
  name?: string;
  phone?: string;
  email?: string;
  branche?: string;
  ort?: string;
  message?: string;
  source_cta: string;
  /** Honeypot value from hidden `company` field — leave undefined if no honeypot */
  company?: string;
}

/**
 * Zentrale Lead-Submission. Ruft die `notify-lead` Edge Function auf,
 * hängt automatisch `source_page = window.location.pathname` an.
 * Gibt true zurück, wenn der Lead erfolgreich übergeben wurde.
 */
export async function submitLead(payload: LeadPayload): Promise<boolean> {
  try {
    const body = {
      ...payload,
      source_page:
        typeof window !== "undefined" ? window.location.pathname : "",
    };
    const { data, error } = await supabase.functions.invoke("notify-lead", {
      body,
    });
    if (error) {
      console.error("submitLead error", error);
      return false;
    }
    return Boolean((data as { ok?: boolean } | null)?.ok);
  } catch (e) {
    console.error("submitLead exception", e);
    return false;
  }
}

/** Versteckte Honeypot-Feld-Props (für jedes Formular einbinden). */
export const honeypotFieldProps = {
  type: "text" as const,
  name: "company",
  tabIndex: -1,
  autoComplete: "off",
  "aria-hidden": true,
  style: {
    position: "absolute" as const,
    left: "-9999px",
    width: "1px",
    height: "1px",
    opacity: 0,
    pointerEvents: "none" as const,
  },
};
