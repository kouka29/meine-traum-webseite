import { supabase } from "@/integrations/supabase/client";

export type PortfolioRow = {
  id: string;
  title: string;
  category: string;
  description: string;
  result: string;
  image_url: string;
  screenshot_url: string;
  external_url: string;
  mockup_desktop_url: string;
  mockup_mobile_url: string;
  sort_order?: number;
};

const STORAGE_KEY = "portfolio_projects_v3";
const TTL_MS = 5 * 60 * 1000; // 5 Minuten

let memoryCache: PortfolioRow[] | null = null;
let inflight: Promise<PortfolioRow[] | null> | null = null;

export function getCachedPortfolio(): PortfolioRow[] | null {
  if (memoryCache) return memoryCache;
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { t: number; data: PortfolioRow[] };
    if (!parsed?.data || Date.now() - parsed.t > TTL_MS) return null;
    memoryCache = parsed.data;
    return memoryCache;
  } catch {
    return null;
  }
}

export function fetchPortfolio(): Promise<PortfolioRow[] | null> {
  if (inflight) return inflight;
  inflight = (async () => {
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select(
        "id, title, category, description, result, image_url, screenshot_url, external_url, mockup_desktop_url, mockup_mobile_url, sort_order"
      )
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });
    if (error || !data) {
      inflight = null;
      return null;
    }
    const rows = data as PortfolioRow[];
    memoryCache = rows;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ t: Date.now(), data: rows }));
    } catch {
      /* ignore quota errors */
    }
    inflight = null;
    return rows;
  })();
  return inflight;
}