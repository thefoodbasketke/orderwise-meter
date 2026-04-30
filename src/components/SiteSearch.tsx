import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface ProductHit {
  id: string;
  name: string;
  category: string | null;
}
interface BlogHit {
  id: string;
  title: string;
  slug: string;
}

const pages = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Request a Quote", href: "/quotation" },
  { label: "Register Meter", href: "/register-meter" },
  { label: "Blog", href: "/blog" },
  { label: "FAQs", href: "/faq" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Careers", href: "/careers" },
];

export function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<ProductHit[]>([]);
  const [blogs, setBlogs] = useState<BlogHit[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!query || query.length < 2) {
      setProducts([]);
      setBlogs([]);
      return;
    }
    const t = setTimeout(async () => {
      const [{ data: prods }, { data: bs }] = await Promise.all([
        supabase
          .from("products")
          .select("id, name, category")
          .ilike("name", `%${query}%`)
          .limit(6),
        supabase
          .from("blogs")
          .select("id, title, slug")
          .eq("is_published", true)
          .ilike("title", `%${query}%`)
          .limit(5),
      ]);
      setProducts(prods || []);
      setBlogs(bs || []);
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    navigate(href);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="hidden md:inline-flex items-center gap-2 text-muted-foreground w-48 justify-start"
        aria-label="Search the site"
      >
        <Search className="h-4 w-4" />
        <span className="text-xs">Search...</span>
        <kbd className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="md:hidden"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search products, blogs and pages..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {products.length > 0 && (
            <CommandGroup heading="Products">
              {products.map((p) => (
                <CommandItem key={p.id} onSelect={() => go(`/products/${p.id}`)}>
                  {p.name}
                  {p.category && (
                    <span className="ml-auto text-xs text-muted-foreground">{p.category}</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {blogs.length > 0 && (
            <CommandGroup heading="Blog">
              {blogs.map((b) => (
                <CommandItem key={b.id} onSelect={() => go(`/blog/${b.slug}`)}>
                  {b.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandGroup heading="Pages">
            {pages.map((p) => (
              <CommandItem key={p.href} onSelect={() => go(p.href)}>
                {p.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
