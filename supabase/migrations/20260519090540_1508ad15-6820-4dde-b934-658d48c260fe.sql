
-- Private bucket for uploaded Angebot PDFs/images
INSERT INTO storage.buckets (id, name, public)
VALUES ('angebot-uploads', 'angebot-uploads', false)
ON CONFLICT (id) DO NOTHING;

-- Only service role can read/write
CREATE POLICY "Service role can manage angebot uploads"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'angebot-uploads' AND auth.role() = 'service_role')
WITH CHECK (bucket_id = 'angebot-uploads' AND auth.role() = 'service_role');

-- Add pdf_path column for direct lookup on the angebote table
ALTER TABLE public.angebote ADD COLUMN IF NOT EXISTS pdf_path text;
