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
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash, Upload, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  title: string;
  description: string | null;
  client_name: string | null;
  location: string | null;
  image_url: string | null;
  category: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (editingProject) {
      setImagePreview(editingProject.image_url || null);
    } else {
      setImagePreview(null);
    }
    setImageFile(null);
  }, [editingProject, dialogOpen]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load projects",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file",
        description: "Please select an image file",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Image must be less than 5MB",
      });
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error("Failed to upload image");
    }

    const { data: { publicUrl } } = supabase.storage
      .from("project-images")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      setUploading(true);

      let imageUrl = editingProject?.image_url || null;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const projectData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string || null,
        client_name: formData.get("client_name") as string || null,
        location: formData.get("location") as string || null,
        category: formData.get("category") as string || null,
        image_url: imageUrl,
        is_featured: formData.get("is_featured") === "on",
        is_active: formData.get("is_active") === "on",
        sort_order: parseInt(formData.get("sort_order") as string) || 0,
      };

      if (editingProject) {
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", editingProject.id);

        if (error) throw error;
        toast({ title: "Success", description: "Project updated successfully" });
      } else {
        const { error } = await supabase
          .from("projects")
          .insert(projectData);

        if (error) throw error;
        toast({ title: "Success", description: "Project created successfully" });
      }

      setDialogOpen(false);
      setEditingProject(null);
      setImageFile(null);
      setImagePreview(null);
      fetchProjects();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Project deleted successfully" });
      fetchProjects();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Projects Management</h1>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                setEditingProject(null);
                setImageFile(null);
                setImagePreview(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingProject(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProject ? "Edit Project" : "Add New Project"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={editingProject?.title}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={editingProject?.description || ""}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="client_name">Client Name</Label>
                    <Input
                      id="client_name"
                      name="client_name"
                      defaultValue={editingProject?.client_name || ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      defaultValue={editingProject?.location || ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      defaultValue={editingProject?.category || ""}
                      placeholder="e.g., Residential, Commercial"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      name="sort_order"
                      type="number"
                      defaultValue={editingProject?.sort_order || 0}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_featured">Featured</Label>
                    <Switch
                      id="is_featured"
                      name="is_featured"
                      defaultChecked={editingProject?.is_featured}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_active">Active</Label>
                    <Switch
                      id="is_active"
                      name="is_active"
                      defaultChecked={editingProject?.is_active ?? true}
                    />
                  </div>
                  <div>
                    <Label>Project Image</Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                    >
                      {imagePreview ? (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-40 object-cover rounded-md"
                          />
                          <p className="text-xs text-muted-foreground mt-2 text-center">
                            Click to change image
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
                          <Upload className="h-8 w-8 mb-2" />
                          <p className="text-sm">Click to upload image</p>
                          <p className="text-xs">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={uploading}>
                    {uploading ? "Saving..." : editingProject ? "Update Project" : "Create Project"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  {project.image_url ? (
                    <div className="h-48 overflow-hidden bg-muted">
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-muted flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-start justify-between">
                      <span className="line-clamp-1">{project.title}</span>
                      <div className="flex gap-1">
                        {project.is_featured && <Badge>Featured</Badge>}
                        {!project.is_active && <Badge variant="secondary">Inactive</Badge>}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                    {project.location && (
                      <p className="text-xs text-muted-foreground">📍 {project.location}</p>
                    )}
                    {project.category && (
                      <Badge variant="outline">{project.category}</Badge>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setEditingProject(project);
                          setDialogOpen(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
