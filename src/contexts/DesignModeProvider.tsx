import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DesignModeContextValue {
  appleDesign: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

const DesignModeContext = createContext<DesignModeContextValue>({
  appleDesign: false,
  loading: true,
  refresh: async () => {},
});

export const useDesignMode = () => useContext(DesignModeContext);

export const DesignModeProvider = ({ children }: { children: ReactNode }) => {
  const [appleDesign, setAppleDesign] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSetting = async () => {
    const { data, error } = await supabase
      .from("design_settings")
      .select("apple_design_enabled")
      .eq("id", 1)
      .maybeSingle();
    if (!error && data) {
      setAppleDesign(!!data.apple_design_enabled);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSetting();

    const channel = supabase
      .channel("design_settings_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "design_settings" },
        (payload) => {
          const next = (payload.new as { apple_design_enabled?: boolean } | null)
            ?.apple_design_enabled;
          if (typeof next === "boolean") setAppleDesign(next);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (appleDesign) {
      root.classList.add("apple-mode");
      body.classList.add("apple-mode");
    } else {
      root.classList.remove("apple-mode");
      body.classList.remove("apple-mode");
    }
  }, [appleDesign]);

  return (
    <DesignModeContext.Provider value={{ appleDesign, loading, refresh: fetchSetting }}>
      {children}
    </DesignModeContext.Provider>
  );
};