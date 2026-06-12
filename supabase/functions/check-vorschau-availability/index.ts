import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function currentMonthKey(): string {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const monthKey = currentMonthKey();

    // Read total_slots from global settings (page_key = 'global')
    const { data: settingsData, error: settingsError } = await supabase
      .from("vorschau_settings")
      .select("total_slots")
      .eq("page_key", "global")
      .maybeSingle();

    if (settingsError) {
      return new Response(JSON.stringify({ error: settingsError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const TOTAL_SLOTS = settingsData?.total_slots ?? 10;

    const { count, error } = await supabase
      .from("vorschau_anfragen")
      .select("id", { count: "exact", head: true })
      .eq("month_key", monthKey)
      .eq("status", "slot_assigned");

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const used = count ?? 0;
    const available = Math.max(TOTAL_SLOTS - used, 0);

    return new Response(
      JSON.stringify({
        available,
        total: TOTAL_SLOTS,
        isFull: available === 0,
        monthKey,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});