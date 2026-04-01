import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const CONSENT_KEY = "mtw_cookie_consent";

const getDeviceType = (width: number): string => {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
};

const hasAnalyticsConsent = (): boolean => {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return false;
    const consent = JSON.parse(stored);
    return consent?.analytics === true;
  } catch {
    return false;
  }
};

const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Don't track admin page
    if (location.pathname.startsWith("/admin")) return;

    // Only track if user gave analytics consent (DSGVO)
    if (!hasAnalyticsConsent()) return;

    const screenWidth = window.innerWidth;
    const deviceType = getDeviceType(screenWidth);
    const referrer = document.referrer || "";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";

    // Actually execute the insert (supabase-js query builder is lazy)
    supabase.from("page_views").insert({
      page_path: location.pathname,
      referrer,
      user_agent: navigator.userAgent,
      screen_width: screenWidth,
      device_type: deviceType,
      timezone,
    }).then(({ error }) => {
      if (error) console.error("PageTracker insert failed:", error.message);
    });
  }, [location.pathname]);

  return null;
};

export default PageTracker;
