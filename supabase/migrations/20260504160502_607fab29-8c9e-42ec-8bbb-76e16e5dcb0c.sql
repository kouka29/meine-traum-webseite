
ALTER TABLE public.vorschau_settings DROP CONSTRAINT IF EXISTS vorschau_settings_singleton;

ALTER TABLE public.vorschau_settings ADD COLUMN IF NOT EXISTS page_key text NOT NULL DEFAULT 'v1';
ALTER TABLE public.vorschau_demos    ADD COLUMN IF NOT EXISTS page_key text NOT NULL DEFAULT 'v1';
ALTER TABLE public.vorschau_faqs     ADD COLUMN IF NOT EXISTS page_key text NOT NULL DEFAULT 'v1';

CREATE UNIQUE INDEX IF NOT EXISTS vorschau_settings_page_key_uniq ON public.vorschau_settings(page_key);

INSERT INTO public.vorschau_settings (
  id, page_key, total_slots, taken_slots, countdown_target, countdown_mode,
  hero_badge_text, hero_h1_line1, hero_h1_line2, hero_h1_line3,
  hero_subheadline, hero_cta_label, countdown_label,
  final_cta_headline, final_cta_subtext, final_cta_button,
  phone_number, show_countdown, show_slots, show_testimonials,
  show_demos, show_faq, show_pain_points, show_process
)
SELECT 2, 'v2', total_slots, 0, countdown_target, countdown_mode,
  hero_badge_text, hero_h1_line1, hero_h1_line2, hero_h1_line3,
  hero_subheadline, hero_cta_label, countdown_label,
  final_cta_headline, final_cta_subtext, final_cta_button,
  phone_number, show_countdown, show_slots, show_testimonials,
  show_demos, show_faq, show_pain_points, show_process
FROM public.vorschau_settings WHERE page_key = 'v1'
ON CONFLICT (page_key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.increment_taken_slot(p_page_key text DEFAULT 'v1')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.vorschau_settings
  SET taken_slots = LEAST(taken_slots + 1, total_slots),
      updated_at = now()
  WHERE page_key = p_page_key;
END;
$function$;

CREATE OR REPLACE FUNCTION public.decrement_taken_slot(p_page_key text DEFAULT 'v1')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.vorschau_settings
  SET taken_slots = GREATEST(taken_slots - 1, 0),
      updated_at = now()
  WHERE page_key = p_page_key;
END;
$function$;
