-- Add label column to products table for promotional labels like "On Offer", "New", "Best Seller"
ALTER TABLE public.products
ADD COLUMN label text DEFAULT NULL;

-- Add a comment for documentation
COMMENT ON COLUMN public.products.label IS 'Promotional label for the product (e.g., On Offer, New, Best Seller)';