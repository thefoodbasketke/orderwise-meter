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
import { Plus, Edit, Trash, Upload, ImageIcon, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  author: string | null;
  category: string | null;
  tags: string[] | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (editingBlog) {
      setImagePreview(editingBlog.image_url || null);
    } else {
      setImagePreview(null);
    }
    setImageFile(null);
  }, [editingBlog, dialogOpen]);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load blogs",
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
    const filePath = `blogs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error("Failed to upload image");
    }

    const { data: { publicUrl } } = supabase.storage
      .from("blog-images")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      setUploading(true);

      let imageUrl = editingBlog?.image_url || null;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const title = formData.get("title") as string;
      const isPublished = formData.get("is_published") === "on";
      const tagsString = formData.get("tags") as string;
      const tags = tagsString ? tagsString.split(",").map(t => t.trim()).filter(Boolean) : null;

      const blogData = {
        title,
        slug: editingBlog?.slug || generateSlug(title),
        excerpt: formData.get("excerpt") as string || null,
        content: formData.get("content") as string,
        image_url: imageUrl,
        author: formData.get("author") as string || null,
        category: formData.get("category") as string || null,
        tags,
        is_published: isPublished,
        published_at: isPublished && !editingBlog?.published_at ? new Date().toISOString() : editingBlog?.published_at || null,
      };

      if (editingBlog) {
        const { error } = await supabase
          .from("blogs")
          .update(blogData)
          .eq("id", editingBlog.id);

        if (error) throw error;
        toast({ title: "Success", description: "Blog updated successfully" });
      } else {
        const { error } = await supabase
          .from("blogs")
          .insert(blogData);

        if (error) throw error;
        toast({ title: "Success", description: "Blog created successfully" });
      }

      setDialogOpen(false);
      setEditingBlog(null);
      setImageFile(null);
      setImagePreview(null);
      fetchBlogs();
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
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Blog deleted successfully" });
      fetchBlogs();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const togglePublish = async (blog: Blog) => {
    try {
      const { error } = await supabase
        .from("blogs")
        .update({
          is_published: !blog.is_published,
          published_at: !blog.is_published ? new Date().toISOString() : blog.published_at,
        })
        .eq("id", blog.id);

      if (error) throw error;
      toast({
        title: "Success",
        description: blog.is_published ? "Blog unpublished" : "Blog published",
      });
      fetchBlogs();
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
            <h1 className="text-3xl font-bold">Blog Management</h1>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                setEditingBlog(null);
                setImageFile(null);
                setImagePreview(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingBlog(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Blog Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={editingBlog?.title}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      defaultValue={editingBlog?.excerpt || ""}
                      rows={2}
                      placeholder="Brief summary of the blog post..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      name="content"
                      defaultValue={editingBlog?.content}
                      rows={10}
                      required
                      placeholder="Write your blog content here..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="author">Author</Label>
                      <Input
                        id="author"
                        name="author"
                        defaultValue={editingBlog?.author || ""}
                        placeholder="Author name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        name="category"
                        defaultValue={editingBlog?.category || ""}
                        placeholder="e.g., Guide, News, Tips"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      name="tags"
                      defaultValue={editingBlog?.tags?.join(", ") || ""}
                      placeholder="e.g., meters, electricity, tips"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_published">Publish immediately</Label>
                    <Switch
                      id="is_published"
                      name="is_published"
                      defaultChecked={editingBlog?.is_published}
                    />
                  </div>
                  <div>
                    <Label>Featured Image</Label>
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
                    {uploading ? "Saving..." : editingBlog ? "Update Blog" : "Create Blog"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading blogs...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Card key={blog.id} className="overflow-hidden">
                  {blog.image_url ? (
                    <div className="h-48 overflow-hidden bg-muted">
                      <img 
                        src={blog.image_url} 
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-muted flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-start justify-between gap-2">
                      <span className="line-clamp-2">{blog.title}</span>
                      <Badge variant={blog.is_published ? "default" : "secondary"}>
                        {blog.is_published ? "Published" : "Draft"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {blog.excerpt || blog.content.substring(0, 100)}...
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {blog.author && <span>By {blog.author}</span>}
                      {blog.category && <Badge variant="outline" className="text-xs">{blog.category}</Badge>}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePublish(blog)}
                      >
                        {blog.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setEditingBlog(blog);
                          setDialogOpen(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(blog.id)}
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
