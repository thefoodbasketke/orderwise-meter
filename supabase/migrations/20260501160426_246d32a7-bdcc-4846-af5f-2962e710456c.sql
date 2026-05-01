
-- Create site_forms table for downloadable forms library
CREATE TABLE public.site_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT,
  file_size INTEGER,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active forms"
  ON public.site_forms FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all forms"
  ON public.site_forms FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage forms"
  ON public.site_forms FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_site_forms_updated_at
  BEFORE UPDATE ON public.site_forms
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Public storage bucket for form PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-forms', 'site-forms', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read site-forms"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-forms');

CREATE POLICY "Admins can upload site-forms"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site-forms' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update site-forms"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'site-forms' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete site-forms"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'site-forms' AND has_role(auth.uid(), 'admin'::app_role));
