-- Performance indexes for hot public read paths.
CREATE INDEX IF NOT EXISTS idx_testimonials_visible_sort
  ON public.testimonials (sort_order) WHERE is_visible = true;

CREATE INDEX IF NOT EXISTS idx_portfolio_visible_sort
  ON public.portfolio_projects (sort_order) WHERE is_visible = true;

CREATE INDEX IF NOT EXISTS idx_vorschau_demos_page_visible_sort
  ON public.vorschau_demos (page_key, sort_order) WHERE is_visible = true;

CREATE INDEX IF NOT EXISTS idx_vorschau_faqs_page_visible_sort
  ON public.vorschau_faqs (page_key, sort_order) WHERE is_visible = true;
