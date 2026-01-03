-- Create storage bucket for hero banner images
INSERT INTO storage.buckets (id, name, public) VALUES ('hero-images', 'hero-images', true);

-- Allow public read access to hero images
CREATE POLICY "Hero images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'hero-images');

-- Allow authenticated admins to upload hero images
CREATE POLICY "Admins can upload hero images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'hero-images' AND public.has_role(auth.uid(), 'admin'));

-- Allow authenticated admins to update hero images
CREATE POLICY "Admins can update hero images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'hero-images' AND public.has_role(auth.uid(), 'admin'));

-- Allow authenticated admins to delete hero images
CREATE POLICY "Admins can delete hero images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'hero-images' AND public.has_role(auth.uid(), 'admin'));