import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type VorschauSettings = {
  id: number;
  total_slots: number;
  taken_slots: number;
  countdown_target: string | null;
  countdown_mode: string;
  hero_badge_text: string;
  hero_h1_line1: string;
  hero_h1_line2: string;
  hero_h1_line3: string;
  hero_subheadline: string;
  hero_cta_label: string;
  countdown_label: string;
  final_cta_headline: string;
  final_cta_subtext: string;
  final_cta_button: string;
  phone_number: string;
  show_countdown: boolean;
  show_slots: boolean;
  show_testimonials: boolean;
  show_demos: boolean;
  show_faq: boolean;
  show_pain_points: boolean;
  show_process: boolean;
  updated_at: string;
};

export type VorschauDemo = {
  id: string;
  trade: string;
  company: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_visible: boolean;
};

export type VorschauFaq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_visible: boolean;
};

export type VorschauData = {
  settings: VorschauSettings | null;
  demos: VorschauDemo[];
  faqs: VorschauFaq[];
  loading: boolean;
};

export function useVorschauSettings(): VorschauData {
  const [data, setData] = useState<VorschauData>({
    settings: null,
    demos: [],
    faqs: [],
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [settingsRes, demosRes, faqsRes] = await Promise.all([
        supabase.from("vorschau_settings").select("*").eq("id", 1).maybeSingle(),
        supabase.from("vorschau_demos").select("*").eq("is_visible", true).order("sort_order", { ascending: true }),
        supabase.from("vorschau_faqs").select("*").eq("is_visible", true).order("sort_order", { ascending: true }),
      ]);
      if (cancelled) return;
      setData({
        settings: (settingsRes.data as VorschauSettings | null) ?? null,
        demos: (demosRes.data as VorschauDemo[] | null) ?? [],
        faqs: (faqsRes.data as VorschauFaq[] | null) ?? [],
        loading: false,
      });
    };
    load();

    // Realtime updates
    const ch = supabase
      .channel("vorschau-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "vorschau_settings" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "vorschau_demos" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "vorschau_faqs" }, load)
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
    };
  }, []);

  return data;
}