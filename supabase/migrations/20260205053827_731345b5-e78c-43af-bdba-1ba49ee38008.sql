-- Add pdf_url column to site_content table for customer service charter
ALTER TABLE public.site_content ADD COLUMN IF NOT EXISTS pdf_url text;