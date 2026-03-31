import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const getDeviceType = (width: number): string => {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
};

const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Don't track admin page
    if (location.pathname.startsWith("/admin")) return;

    const screenWidth = window.innerWidth;
    const deviceType = getDeviceType(screenWidth);
    const referrer = document.referrer || "";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";

    supabase.from("page_views").insert({
      page_path: location.pathname,
      referrer,
      user_agent: navigator.userAgent,
      screen_width: screenWidth,
      device_type: deviceType,
      timezone,
    });
  }, [location.pathname]);

  return null;
};

export default PageTracker;
