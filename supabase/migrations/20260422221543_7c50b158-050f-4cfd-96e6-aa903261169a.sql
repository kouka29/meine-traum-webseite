-- Optional: Verknüpfe einen Demo-Eintrag mit einem Portfolio-Projekt
ALTER TABLE public.vorschau_demos
  ADD COLUMN IF NOT EXISTS portfolio_project_id UUID REFERENCES public.portfolio_projects(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_vorschau_demos_portfolio_project_id
  ON public.vorschau_demos(portfolio_project_id);