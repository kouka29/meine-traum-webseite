-- Add short_id to angebote for short links
ALTER TABLE public.angebote ADD COLUMN short_id TEXT UNIQUE;
CREATE INDEX idx_angebote_short_id ON public.angebote(short_id);

-- Add short_id to the types (this will be auto-generated but we need the column)