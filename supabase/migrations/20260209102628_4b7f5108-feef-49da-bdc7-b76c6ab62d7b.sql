-- Add video_url column to blogs table
ALTER TABLE public.blogs ADD COLUMN video_url TEXT DEFAULT NULL;