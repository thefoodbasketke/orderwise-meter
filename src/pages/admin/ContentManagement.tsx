import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ArrowLeft, FileText, Briefcase, Star, FolderOpen, Settings, Image, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import HeroBannerManager from "@/components/admin/HeroBannerManager";

// Types
interface SiteContent {
  id: string;
  section_key: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  client_name: string | null;
  location: string | null;
  completion_date: string | null;
  image_url: string | null;
  category: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

interface Service {
  id: string;
  title: string;
  description: string | null;
  icon_name: string | null;
  image_url: string | null;
  features: string[] | null;
  is_active: boolean;
  sort_order: number;
}

interface Testimonial {
  id: string;
  client_name: string;
  company: string | null;
  role: string | null;
  content: string;
  rating: number;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

interface Career {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  employment_type: string;
  description: string | null;
  requirements: string[] | null;
  benefits: string[] | null;
  salary_range: string | null;
  is_active: boolean;
  application_deadline: string | null;
}

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: boolean;
  description: string | null;
}

export default function ContentManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("hero");
  
  // State for each content type
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [editingContent, setEditingContent] = useState<SiteContent | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      const [contentRes, projectsRes, servicesRes, testimonialsRes, careersRes, settingsRes] = await Promise.all([
        supabase.from("site_content").select("*").order("sort_order"),
        supabase.from("projects").select("*").order("sort_order"),
        supabase.from("services").select("*").order("sort_order"),
        supabase.from("testimonials").select("*").order("sort_order"),
        supabase.from("careers").select("*").order("created_at", { ascending: false }),
        supabase.from("site_settings").select("*"),
      ]);

      if (contentRes.data) setSiteContent(contentRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
      if (testimonialsRes.data) setTestimonials(testimonialsRes.data);
      if (careersRes.data) setCareers(careersRes.data);
      if (settingsRes.data) setSiteSettings(settingsRes.data);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load content" });
    } finally {
      setLoading(false);
    }
  };

  // About/Site Content handlers
  const handleSaveContent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      section_key: formData.get("section_key") as string,
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      image_url: formData.get("image_url") as string || null,
      is_active: editingContent?.is_active ?? true,
    };

    try {
      if (editingContent?.id) {
        await supabase.from("site_content").update(data).eq("id", editingContent.id);
      } else {
        await supabase.from("site_content").insert(data);
      }
      toast({ title: "Success", description: "Content saved" });
      setDialogOpen(false);
      setEditingContent(null);
      fetchAllContent();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  // Projects handlers
  const handleSaveProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      client_name: formData.get("client_name") as string || null,
      location: formData.get("location") as string || null,
      completion_date: formData.get("completion_date") as string || null,
      image_url: formData.get("image_url") as string || null,
      category: formData.get("category") as string || null,
      is_featured: editingProject?.is_featured ?? false,
      is_active: editingProject?.is_active ?? true,
    };

    try {
      if (editingProject?.id) {
        await supabase.from("projects").update(data).eq("id", editingProject.id);
      } else {
        await supabase.from("projects").insert(data);
      }
      toast({ title: "Success", description: "Project saved" });
      setDialogOpen(false);
      setEditingProject(null);
      fetchAllContent();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  // Services handlers
  const handleSaveService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const featuresText = formData.get("features") as string;
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      icon_name: formData.get("icon_name") as string || null,
      image_url: formData.get("image_url") as string || null,
      features: featuresText ? featuresText.split("\n").filter(f => f.trim()) : null,
      is_active: editingService?.is_active ?? true,
    };

    try {
      if (editingService?.id) {
        await supabase.from("services").update(data).eq("id", editingService.id);
      } else {
        await supabase.from("services").insert(data);
      }
      toast({ title: "Success", description: "Service saved" });
      setDialogOpen(false);
      setEditingService(null);
      fetchAllContent();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  // Testimonials handlers
  const handleSaveTestimonial = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      client_name: formData.get("client_name") as string,
      company: formData.get("company") as string || null,
      role: formData.get("role") as string || null,
      content: formData.get("content") as string,
      rating: parseInt(formData.get("rating") as string) || 5,
      image_url: formData.get("image_url") as string || null,
      is_featured: editingTestimonial?.is_featured ?? false,
      is_active: editingTestimonial?.is_active ?? true,
    };

    try {
      if (editingTestimonial?.id) {
        await supabase.from("testimonials").update(data).eq("id", editingTestimonial.id);
      } else {
        await supabase.from("testimonials").insert(data);
      }
      toast({ title: "Success", description: "Testimonial saved" });
      setDialogOpen(false);
      setEditingTestimonial(null);
      fetchAllContent();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  // Careers handlers
  const handleSaveCareer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const requirementsText = formData.get("requirements") as string;
    const benefitsText = formData.get("benefits") as string;
    const data = {
      title: formData.get("title") as string,
      department: formData.get("department") as string || null,
      location: formData.get("location") as string || null,
      employment_type: formData.get("employment_type") as string || "Full-time",
      description: formData.get("description") as string,
      requirements: requirementsText ? requirementsText.split("\n").filter(r => r.trim()) : null,
      benefits: benefitsText ? benefitsText.split("\n").filter(b => b.trim()) : null,
      salary_range: formData.get("salary_range") as string || null,
      application_deadline: formData.get("application_deadline") as string || null,
      is_active: editingCareer?.is_active ?? true,
    };

    try {
      if (editingCareer?.id) {
        await supabase.from("careers").update(data).eq("id", editingCareer.id);
      } else {
        await supabase.from("careers").insert(data);
      }
      toast({ title: "Success", description: "Career saved" });
      setDialogOpen(false);
      setEditingCareer(null);
      fetchAllContent();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  // Delete handlers
  const handleDelete = async (table: "site_content" | "projects" | "services" | "testimonials" | "careers", id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await supabase.from(table).delete().eq("id", id);
      toast({ title: "Deleted", description: "Item removed" });
      fetchAllContent();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  // Toggle settings
  const toggleSetting = async (settingKey: string, currentValue: boolean) => {
    try {
      await supabase.from("site_settings").update({ setting_value: !currentValue }).eq("setting_key", settingKey);
      toast({ title: "Success", description: "Setting updated" });
      fetchAllContent();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  // Toggle active status
  const toggleActive = async (table: "site_content" | "projects" | "services" | "testimonials" | "careers", id: string, currentStatus: boolean) => {
    try {
      await supabase.from(table).update({ is_active: !currentStatus }).eq("id", id);
      fetchAllContent();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Content Management</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="hero"><Image className="h-4 w-4 mr-1" />Hero Banner</TabsTrigger>
            <TabsTrigger value="about"><Settings className="h-4 w-4 mr-1" />About</TabsTrigger>
            <TabsTrigger value="projects"><FolderOpen className="h-4 w-4 mr-1" />Projects</TabsTrigger>
            <TabsTrigger value="services"><FileText className="h-4 w-4 mr-1" />Services</TabsTrigger>
            <TabsTrigger value="testimonials"><Star className="h-4 w-4 mr-1" />Testimonials</TabsTrigger>
            <TabsTrigger value="careers"><Briefcase className="h-4 w-4 mr-1" />Careers</TabsTrigger>
            <TabsTrigger value="visibility"><Eye className="h-4 w-4 mr-1" />Visibility</TabsTrigger>
          </TabsList>


          {/* Hero Banner Tab */}
          <TabsContent value="hero">
            <HeroBannerManager />
          </TabsContent>


          {/* About/Site Content Tab */}
          <TabsContent value="about">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>About Page Sections</CardTitle>
                <Dialog open={dialogOpen && activeTab === "about"} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingContent(null); }}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => { setEditingContent(null); setDialogOpen(true); }}>
                      <Plus className="h-4 w-4 mr-1" />Add Section
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingContent ? "Edit Section" : "Add Section"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveContent} className="space-y-4">
                      <div>
                        <Label>Section Key</Label>
                        <Input name="section_key" defaultValue={editingContent?.section_key} required placeholder="e.g., customer_charter" />
                      </div>
                      <div>
                        <Label>Title</Label>
                        <Input name="title" defaultValue={editingContent?.title || ""} />
                      </div>
                      <div>
                        <Label>Content</Label>
                        <Textarea name="content" defaultValue={editingContent?.content || ""} rows={5} />
                      </div>
                      <div>
                        <Label>Image URL</Label>
                        <Input name="image_url" defaultValue={editingContent?.image_url || ""} />
                      </div>
                      <Button type="submit" className="w-full">Save</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Section Key</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {siteContent.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">{item.section_key}</TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>
                          <Switch checked={item.is_active} onCheckedChange={() => toggleActive("site_content", item.id, item.is_active)} />
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setEditingContent(item); setDialogOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete("site_content", item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Projects/Portfolio</CardTitle>
                <Dialog open={dialogOpen && activeTab === "projects"} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingProject(null); }}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => { setEditingProject(null); setDialogOpen(true); }}>
                      <Plus className="h-4 w-4 mr-1" />Add Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>{editingProject ? "Edit Project" : "Add Project"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveProject} className="space-y-4 max-h-[70vh] overflow-y-auto">
                      <div>
                        <Label>Title *</Label>
                        <Input name="title" defaultValue={editingProject?.title} required />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea name="description" defaultValue={editingProject?.description || ""} rows={3} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Client Name</Label>
                          <Input name="client_name" defaultValue={editingProject?.client_name || ""} />
                        </div>
                        <div>
                          <Label>Location</Label>
                          <Input name="location" defaultValue={editingProject?.location || ""} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Completion Date</Label>
                          <Input name="completion_date" type="date" defaultValue={editingProject?.completion_date || ""} />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Input name="category" defaultValue={editingProject?.category || ""} placeholder="e.g., Residential" />
                        </div>
                      </div>
                      <div>
                        <Label>Image URL</Label>
                        <Input name="image_url" defaultValue={editingProject?.image_url || ""} />
                      </div>
                      <Button type="submit" className="w-full">Save</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{item.client_name}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.is_featured && <Badge>Featured</Badge>}</TableCell>
                        <TableCell>
                          <Switch checked={item.is_active} onCheckedChange={() => toggleActive("projects", item.id, item.is_active)} />
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setEditingProject(item); setDialogOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete("projects", item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Services</CardTitle>
                <Dialog open={dialogOpen && activeTab === "services"} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingService(null); }}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => { setEditingService(null); setDialogOpen(true); }}>
                      <Plus className="h-4 w-4 mr-1" />Add Service
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingService ? "Edit Service" : "Add Service"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveService} className="space-y-4">
                      <div>
                        <Label>Title *</Label>
                        <Input name="title" defaultValue={editingService?.title} required />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea name="description" defaultValue={editingService?.description || ""} rows={3} />
                      </div>
                      <div>
                        <Label>Icon Name (Lucide)</Label>
                        <Input name="icon_name" defaultValue={editingService?.icon_name || ""} placeholder="e.g., Zap, Droplets" />
                      </div>
                      <div>
                        <Label>Image URL</Label>
                        <Input name="image_url" defaultValue={editingService?.image_url || ""} />
                      </div>
                      <div>
                        <Label>Features (one per line)</Label>
                        <Textarea name="features" defaultValue={editingService?.features?.join("\n") || ""} rows={4} placeholder="Feature 1&#10;Feature 2" />
                      </div>
                      <Button type="submit" className="w-full">Save</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                        <TableCell>
                          <Switch checked={item.is_active} onCheckedChange={() => toggleActive("services", item.id, item.is_active)} />
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setEditingService(item); setDialogOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete("services", item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Testimonials</CardTitle>
                <Dialog open={dialogOpen && activeTab === "testimonials"} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingTestimonial(null); }}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => { setEditingTestimonial(null); setDialogOpen(true); }}>
                      <Plus className="h-4 w-4 mr-1" />Add Testimonial
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveTestimonial} className="space-y-4">
                      <div>
                        <Label>Client Name *</Label>
                        <Input name="client_name" defaultValue={editingTestimonial?.client_name} required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Company</Label>
                          <Input name="company" defaultValue={editingTestimonial?.company || ""} />
                        </div>
                        <div>
                          <Label>Role</Label>
                          <Input name="role" defaultValue={editingTestimonial?.role || ""} />
                        </div>
                      </div>
                      <div>
                        <Label>Testimonial *</Label>
                        <Textarea name="content" defaultValue={editingTestimonial?.content} rows={4} required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Rating (1-5)</Label>
                          <Input name="rating" type="number" min="1" max="5" defaultValue={editingTestimonial?.rating || 5} />
                        </div>
                        <div>
                          <Label>Image URL</Label>
                          <Input name="image_url" defaultValue={editingTestimonial?.image_url || ""} />
                        </div>
                      </div>
                      <Button type="submit" className="w-full">Save</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testimonials.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.client_name}</TableCell>
                        <TableCell>{item.company}</TableCell>
                        <TableCell>{"★".repeat(item.rating)}</TableCell>
                        <TableCell>{item.is_featured && <Badge>Featured</Badge>}</TableCell>
                        <TableCell>
                          <Switch checked={item.is_active} onCheckedChange={() => toggleActive("testimonials", item.id, item.is_active)} />
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setEditingTestimonial(item); setDialogOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete("testimonials", item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Careers Tab */}
          <TabsContent value="careers">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Career Listings</CardTitle>
                <Dialog open={dialogOpen && activeTab === "careers"} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingCareer(null); }}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => { setEditingCareer(null); setDialogOpen(true); }}>
                      <Plus className="h-4 w-4 mr-1" />Add Job
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>{editingCareer ? "Edit Job" : "Add Job"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveCareer} className="space-y-4 max-h-[70vh] overflow-y-auto">
                      <div>
                        <Label>Job Title *</Label>
                        <Input name="title" defaultValue={editingCareer?.title} required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Department</Label>
                          <Input name="department" defaultValue={editingCareer?.department || ""} />
                        </div>
                        <div>
                          <Label>Location</Label>
                          <Input name="location" defaultValue={editingCareer?.location || ""} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Employment Type</Label>
                          <Input name="employment_type" defaultValue={editingCareer?.employment_type || "Full-time"} />
                        </div>
                        <div>
                          <Label>Salary Range</Label>
                          <Input name="salary_range" defaultValue={editingCareer?.salary_range || ""} placeholder="e.g., KSh 50,000 - 80,000" />
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea name="description" defaultValue={editingCareer?.description || ""} rows={3} />
                      </div>
                      <div>
                        <Label>Requirements (one per line)</Label>
                        <Textarea name="requirements" defaultValue={editingCareer?.requirements?.join("\n") || ""} rows={4} />
                      </div>
                      <div>
                        <Label>Benefits (one per line)</Label>
                        <Textarea name="benefits" defaultValue={editingCareer?.benefits?.join("\n") || ""} rows={3} />
                      </div>
                      <div>
                        <Label>Application Deadline</Label>
                        <Input name="application_deadline" type="date" defaultValue={editingCareer?.application_deadline || ""} />
                      </div>
                      <Button type="submit" className="w-full">Save</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {careers.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{item.department}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell><Badge variant="secondary">{item.employment_type}</Badge></TableCell>
                        <TableCell>
                          <Switch checked={item.is_active} onCheckedChange={() => toggleActive("careers", item.id, item.is_active)} />
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setEditingCareer(item); setDialogOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete("careers", item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visibility Settings Tab */}
          <TabsContent value="visibility">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Product Visibility Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Control what information is visible to customers on product pages.
                </p>
                
                {siteSettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {setting.setting_value ? (
                          <EyeOff className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Eye className="h-5 w-5 text-primary" />
                        )}
                        <h4 className="font-medium capitalize">
                          {setting.setting_key.replace(/_/g, ' ')}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {setting.description || `Toggle to ${setting.setting_value ? 'show' : 'hide'} this information`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {setting.setting_value ? 'Hidden' : 'Visible'}
                      </span>
                      <Switch
                        checked={setting.setting_value}
                        onCheckedChange={() => toggleSetting(setting.setting_key, setting.setting_value)}
                      />
                    </div>
                  </div>
                ))}
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">How it works</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li><strong>Hide Pricing:</strong> Removes price displays from product cards, detail pages, and quick view modals</li>
                    <li><strong>Hide Stock:</strong> Removes stock quantity badges from all product displays</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
