import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash, Upload, FileText, Eye, EyeOff, Download } from "lucide-react";

interface SiteForm {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  file_url: string;
  file_name: string | null;
  file_size: number | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

const formatBytes = (bytes: number | null) => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function AdminForms() {
  const [forms, setForms] = useState<SiteForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SiteForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title,
        description: editing.description || "",
        category: editing.category || "",
        sort_order: editing.sort_order,
        is_active: editing.is_active,
      });
    } else {
      setForm({ title: "", description: "", category: "", sort_order: 0, is_active: true });
    }
    setFile(null);
  }, [editing, dialogOpen]);

  const fetchForms = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_forms")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setForms(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast({ variant: "destructive", title: "Title required" });
      return;
    }
    if (!editing && !file) {
      toast({ variant: "destructive", title: "Please choose a PDF file" });
      return;
    }
    setSaving(true);
    try {
      let file_url = editing?.file_url || "";
      let file_name = editing?.file_name || null;
      let file_size = editing?.file_size || null;

      if (file) {
        const ext = file.name.split(".").pop() || "pdf";
        const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const { error: upErr } = await supabase.storage
          .from("site-forms")
          .upload(path, file, { contentType: file.type || "application/pdf", upsert: false });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("site-forms").getPublicUrl(path);
        file_url = pub.publicUrl;
        file_name = file.name;
        file_size = file.size;
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        category: form.category.trim() || null,
        sort_order: Number(form.sort_order) || 0,
        is_active: form.is_active,
        file_url,
        file_name,
        file_size,
      };

      if (editing) {
        const { error } = await supabase.from("site_forms").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast({ title: "Form updated" });
      } else {
        const { error } = await supabase.from("site_forms").insert(payload);
        if (error) throw error;
        toast({ title: "Form added" });
      }

      setDialogOpen(false);
      setEditing(null);
      fetchForms();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this form? This cannot be undone.")) return;
    const { error } = await supabase.from("site_forms").delete().eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Form deleted" });
      fetchForms();
    }
  };

  const toggleActive = async (f: SiteForm) => {
    const { error } = await supabase
      .from("site_forms")
      .update({ is_active: !f.is_active })
      .eq("id", f.id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      fetchForms();
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold">Forms &amp; Downloads</h1>
              <p className="text-muted-foreground">
                Manage downloadable PDFs shown on the public Forms page.
              </p>
            </div>
            <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" /> Add Form
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : forms.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No forms yet. Click "Add Form" to upload your first PDF.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {forms.map((f) => (
                <Card key={f.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-lg flex items-center gap-2 flex-wrap">
                            {f.title}
                            {!f.is_active && <Badge variant="secondary">Hidden</Badge>}
                            {f.category && <Badge variant="outline">{f.category}</Badge>}
                          </CardTitle>
                          {f.description && (
                            <p className="text-sm text-muted-foreground mt-1">{f.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {f.file_name || "file"} · {formatBytes(f.file_size)} · sort {f.sort_order}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button asChild size="icon" variant="ghost" title="Download">
                          <a href={f.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleActive(f)}
                          title={f.is_active ? "Hide" : "Show"}
                        >
                          {f.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => { setEditing(f); setDialogOpen(true); }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(f.id)}>
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditing(null); }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Form" : "Add Form"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g. Applications"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sort">Sort Order</Label>
                  <Input
                    id="sort"
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>PDF File {editing ? "(leave empty to keep current)" : "*"}</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {file ? file.name : editing?.file_name || "Choose PDF"}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Active (visible to public)</Label>
                <Switch
                  id="active"
                  checked={form.is_active}
                  onCheckedChange={(c) => setForm({ ...form, is_active: c })}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : editing ? "Update Form" : "Add Form"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
