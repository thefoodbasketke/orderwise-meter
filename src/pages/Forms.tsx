import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedPage, FadeIn, StaggerContainer, StaggerItem } from "@/components/AnimatedPage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Download, FileText, Search } from "lucide-react";

interface SiteForm {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  file_url: string;
  file_name: string | null;
  file_size: number | null;
}

const formatBytes = (bytes: number | null) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function Forms() {
  const [forms, setForms] = useState<SiteForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "Downloads & Forms | UMS Kenya";
    (async () => {
      const { data } = await supabase
        .from("site_forms")
        .select("id,title,description,category,file_url,file_name,file_size")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      setForms(data || []);
      setLoading(false);
    })();
  }, []);

  const filtered = forms.filter(
    (f) =>
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      (f.description || "").toLowerCase().includes(search.toLowerCase()) ||
      (f.category || "").toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, SiteForm[]>>((acc, f) => {
    const key = f.category || "Other";
    (acc[key] = acc[key] || []).push(f);
    return acc;
  }, {});

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background">
        <Navbar />

        <section className="bg-gradient-hero py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <FadeIn>
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                Downloads &amp; Forms
              </h1>
              <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                Download official UMS Kenya forms, agreements and request documents.
              </p>
            </FadeIn>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <FadeIn>
              <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search forms..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </FadeIn>

            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading forms...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No forms found{search ? ` matching "${search}"` : ""}.
              </div>
            ) : (
              Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mb-10">
                  <h2 className="text-2xl font-bold mb-4">{category}</h2>
                  <StaggerContainer>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {items.map((form) => (
                        <StaggerItem key={form.id}>
                          <Card className="h-full hover:shadow-hover transition-all">
                            <CardHeader>
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-lg leading-tight">
                                    {form.title}
                                  </CardTitle>
                                  {form.file_size && (
                                    <Badge variant="secondary" className="mt-2 text-xs">
                                      PDF · {formatBytes(form.file_size)}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {form.description && (
                                <CardDescription className="mb-4">
                                  {form.description}
                                </CardDescription>
                              )}
                              <div className="flex gap-2">
                                <Button asChild className="flex-1">
                                  <a
                                    href={form.file_url}
                                    download={form.file_name || undefined}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </a>
                                </Button>
                                <Button asChild variant="outline">
                                  <a href={form.file_url} target="_blank" rel="noopener noreferrer">
                                    View
                                  </a>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </StaggerItem>
                      ))}
                    </div>
                  </StaggerContainer>
                </div>
              ))
            )}
          </div>
        </section>

        <Footer />
      </div>
    </AnimatedPage>
  );
}
