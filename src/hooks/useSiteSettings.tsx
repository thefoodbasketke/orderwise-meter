import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  hide_pricing: boolean;
  hide_stock: boolean;
  hero_overlay_opacity: number;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    hide_pricing: false,
    hide_stock: false,
    hero_overlay_opacity: 0.4,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("setting_key, setting_value, setting_value_text");

        if (data) {
          const next: SiteSettings = {
            hide_pricing: false,
            hide_stock: false,
            hero_overlay_opacity: 0.4,
          };
          for (const item of data as any[]) {
            if (item.setting_key === "hide_pricing") next.hide_pricing = !!item.setting_value;
            else if (item.setting_key === "hide_stock") next.hide_stock = !!item.setting_value;
            else if (item.setting_key === "hero_overlay_opacity") {
              const parsed = parseFloat(item.setting_value_text ?? "");
              if (!isNaN(parsed)) next.hero_overlay_opacity = Math.min(1, Math.max(0, parsed));
            }
          }
          setSettings(next);
        }
      } catch (error) {
        console.error("Failed to fetch site settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
}
