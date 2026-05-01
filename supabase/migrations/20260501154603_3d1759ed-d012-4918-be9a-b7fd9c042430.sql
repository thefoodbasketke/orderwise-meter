ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS setting_value_text TEXT;
INSERT INTO public.site_settings (setting_key, setting_value, setting_value_text)
VALUES ('hero_overlay_opacity', false, '0.4')
ON CONFLICT (setting_key) DO NOTHING;