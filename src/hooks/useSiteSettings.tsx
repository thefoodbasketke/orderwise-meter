import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  hide_pricing: boolean;
  hide_stock: boolean;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    hide_pricing: false,
    hide_stock: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("setting_key, setting_value");
        
        if (data) {
          const settingsMap = data.reduce((acc, item) => {
            acc[item.setting_key as keyof SiteSettings] = item.setting_value;
            return acc;
          }, {} as SiteSettings);
          
          setSettings({
            hide_pricing: settingsMap.hide_pricing ?? false,
            hide_stock: settingsMap.hide_stock ?? false,
          });
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
