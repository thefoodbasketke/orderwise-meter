-- Add video_url column to hero_banners table
ALTER TABLE public.hero_banners ADD COLUMN IF NOT EXISTS video_url text;

-- Create hero-videos storage bucket for HD video uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('hero-videos', 'hero-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for hero-videos bucket (admin only upload, public read)
CREATE POLICY "Public can view hero videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'hero-videos');

CREATE POLICY "Admins can upload hero videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'hero-videos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update hero videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'hero-videos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete hero videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'hero-videos' AND has_role(auth.uid(), 'admin'::app_role));

-- Add terms_accepted column to meter_registrations table
ALTER TABLE public.meter_registrations ADD COLUMN IF NOT EXISTS terms_accepted boolean DEFAULT false;
ALTER TABLE public.meter_registrations ADD COLUMN IF NOT EXISTS terms_accepted_at timestamp with time zone;