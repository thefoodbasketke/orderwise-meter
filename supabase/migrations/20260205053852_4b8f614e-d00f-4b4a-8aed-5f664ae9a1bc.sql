-- Create storage bucket for charter documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('charter-documents', 'charter-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for public read access
CREATE POLICY "Charter documents are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'charter-documents');

-- Create policy for admin uploads
CREATE POLICY "Admins can upload charter documents" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'charter-documents' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Create policy for admin updates
CREATE POLICY "Admins can update charter documents" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'charter-documents' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Create policy for admin deletes
CREATE POLICY "Admins can delete charter documents" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'charter-documents' AND public.has_role(auth.uid(), 'admin'::app_role));