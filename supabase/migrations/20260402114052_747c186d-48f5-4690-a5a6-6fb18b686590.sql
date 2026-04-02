
-- Add validation constraints on leads table
ALTER TABLE public.leads
  ADD CONSTRAINT leads_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  ADD CONSTRAINT leads_email_length CHECK (char_length(email) <= 255),
  ADD CONSTRAINT leads_first_name_length CHECK (char_length(first_name) <= 100),
  ADD CONSTRAINT leads_company_name_length CHECK (char_length(company_name) <= 200),
  ADD CONSTRAINT leads_phone_length CHECK (char_length(phone) BETWEEN 6 AND 30);
