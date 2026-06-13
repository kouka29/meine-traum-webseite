import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type VorschauSettings = {
  id: number;
  page_key: string;
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
  page_key?: string;
  trade: string;
  company: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_visible: boolean;
  portfolio_project_id?: string | null;
};

export type VorschauFaq = {
  id: string;
  page_key?: string;
  question: string;
  answer: string;
  sort_order: number;
  is_visible: boolean;
};

export type VorschauPortfolioProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  mockup_desktop_url: string;
  mockup_mobile_url: string;
  external_url: string;
  result: string;
};

export type VorschauTestimonial = {
  id: string;
  name: string;
  role: string;
  text: string;
  result: string;
};

export type VorschauData = {
  settings: VorschauSettings | null;
  demos: VorschauDemo[];
  faqs: VorschauFaq[];
  portfolio: VorschauPortfolioProject[];
  testimonials: VorschauTestimonial[];
  loading: boolean;
};

export function useVorschauSettings(pageKey: string = "v1"): VorschauData {
  const [data, setData] = useState<VorschauData>({
    settings: null,
    demos: [],
    faqs: [],
    portfolio: [],
    testimonials: [],
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [settingsRes, globalRes, demosRes, faqsRes, portfolioRes, testimonialsRes] = await Promise.all([
        supabase.from("vorschau_settings").select("*").eq("page_key", pageKey).maybeSingle(),
        supabase.from("vorschau_settings").select("total_slots,taken_slots").eq("page_key", "global").maybeSingle(),
        supabase.from("vorschau_demos").select("*").eq("page_key", pageKey).eq("is_visible", true).order("sort_order", { ascending: true }),
        supabase.from("vorschau_faqs").select("*").eq("page_key", pageKey).eq("is_visible", true).order("sort_order", { ascending: true }),
        supabase.from("portfolio_projects").select("id,title,category,description,image_url,mockup_desktop_url,mockup_mobile_url,external_url,result").eq("is_visible", true).order("sort_order", { ascending: true }),
        supabase.from("testimonials").select("id,name,role,text,result").eq("is_visible", true).order("sort_order", { ascending: true }),
      ]);
      if (cancelled) return;
      const pageSettings = (settingsRes.data as VorschauSettings | null) ?? null;
      const globalSlots = (globalRes.data as { total_slots: number; taken_slots: number } | null) ?? null;
      // Slots werden global verwaltet: total_slots/taken_slots aus der "global"-Zeile
      // überschreiben die seiten-spezifischen Werte, damit alle Seiten dieselben
      // Platz-Zahlen anzeigen. show_slots bleibt pro Seite konfigurierbar.
      const mergedSettings = pageSettings && globalSlots
        ? { ...pageSettings, total_slots: globalSlots.total_slots, taken_slots: Math.min(globalSlots.taken_slots, globalSlots.total_slots) }
        : pageSettings;
      setData({
        settings: mergedSettings,
        demos: (demosRes.data as VorschauDemo[] | null) ?? [],
        faqs: (faqsRes.data as VorschauFaq[] | null) ?? [],
        portfolio: (portfolioRes.data as VorschauPortfolioProject[] | null) ?? [],
        testimonials: (testimonialsRes.data as VorschauTestimonial[] | null) ?? [],
        loading: false,
      });
    };
    load();

    // Realtime updates
    const ch = supabase
      .channel(`vorschau-live-${pageKey}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "vorschau_settings" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "vorschau_demos" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "vorschau_faqs" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "portfolio_projects" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "testimonials" }, load)
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
    };
  }, [pageKey]);

  return data;
}