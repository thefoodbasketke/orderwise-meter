-- Add specifications and catalogue PDF fields to products
ALTER TABLE public.products
ADD COLUMN specifications text,
ADD COLUMN catalogue_pdf_url text;