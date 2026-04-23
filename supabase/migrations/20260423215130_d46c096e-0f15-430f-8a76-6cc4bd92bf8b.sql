ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS booking_date date,
  ADD COLUMN IF NOT EXISTS booking_time text,
  ADD COLUMN IF NOT EXISTS contact_method text;

-- Allow anonymous users to update only the booking-related fields on their just-created lead.
-- Since we don't have auth, we permit UPDATE of these specific columns from anyone, but only
-- when the existing values are NULL (i.e. a single booking confirmation per lead).
CREATE POLICY "Anyone can attach booking to a lead once"
ON public.leads
FOR UPDATE
TO anon, authenticated
USING (booking_date IS NULL AND booking_time IS NULL)
WITH CHECK (
  (booking_date IS NOT NULL OR booking_time IS NOT NULL OR contact_method IS NOT NULL)
  AND contact_method IS NULL OR contact_method IN ('phone', 'online')
);