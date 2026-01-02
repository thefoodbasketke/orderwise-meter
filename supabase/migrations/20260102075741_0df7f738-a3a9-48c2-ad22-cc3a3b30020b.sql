-- Site Content table for About page sections
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  title text,
  content text,
  image_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Projects/Portfolio table
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  client_name text,
  location text,
  completion_date date,
  image_url text,
  category text,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Services table
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon_name text,
  image_url text,
  features text[],
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Testimonials table
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  company text,
  role text,
  content text NOT NULL,
  rating integer DEFAULT 5,
  image_url text,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Careers/Jobs table
CREATE TABLE public.careers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text,
  location text,
  employment_type text DEFAULT 'Full-time',
  description text,
  requirements text[],
  benefits text[],
  salary_range text,
  is_active boolean DEFAULT true,
  application_deadline date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can view active site content" ON public.site_content FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active projects" ON public.projects FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active testimonials" ON public.testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active careers" ON public.careers FOR SELECT USING (is_active = true);

-- Admin management policies
CREATE POLICY "Admins can manage site content" ON public.site_content FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage projects" ON public.projects FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage careers" ON public.careers FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Updated_at triggers
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_careers_updated_at BEFORE UPDATE ON public.careers FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Insert default about content
INSERT INTO public.site_content (section_key, title, content) VALUES
('about_intro', 'About UMS Kenya', 'UMS Kenya is a leading provider of prepaid utility meters, offering innovative solutions for electricity, water, and gas metering across East Africa.'),
('customer_charter', 'Customer Service Charter', 'We are committed to providing excellent service to all our customers. Our charter outlines our promises to you regarding quality, timeliness, and support.'),
('mission', 'Our Mission', 'To revolutionize utility management through innovative prepaid metering solutions that empower consumers and utility providers alike.'),
('vision', 'Our Vision', 'To be the leading provider of smart metering solutions in Africa, driving sustainable resource management and customer empowerment.');