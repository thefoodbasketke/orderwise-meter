-- Add sort_order column to hero_banners for drag-and-drop reordering
ALTER TABLE public.hero_banners 
ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;