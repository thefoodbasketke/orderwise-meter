import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, GripVertical, Upload, Video, Image } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface HeroBanner {
  id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  is_active: boolean;
  sort_order: number;
}

interface SortableBannerItemProps {
  banner: HeroBanner;
  onEdit: (banner: HeroBanner) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

function SortableBannerItem({ banner, onEdit, onDelete, onToggleActive }: SortableBannerItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-4 bg-card border rounded-lg mb-3"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:bg-muted p-2 rounded"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="flex-shrink-0 w-24 h-16 rounded overflow-hidden bg-muted">
        {banner.video_url ? (
          <video src={banner.video_url} className="w-full h-full object-cover" muted />
        ) : banner.image_url ? (
          <img src={banner.image_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{banner.title || "Untitled Banner"}</p>
        <p className="text-sm text-muted-foreground truncate">{banner.subtitle || "No subtitle"}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Switch
            checked={banner.is_active}
            onCheckedChange={() => onToggleActive(banner.id, banner.is_active)}
          />
          <span className="text-sm text-muted-foreground">{banner.is_active ? "Active" : "Inactive"}</span>
        </div>
        
        <Button variant="ghost" size="icon" onClick={() => onEdit(banner)}>
          <Edit className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="icon" onClick={() => onDelete(banner.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}

export default function HeroBannerManager() {
  const { toast } = useToast();
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image_url: "",
    video_url: "",
    is_active: true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from("hero_banners")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = banners.findIndex((b) => b.id === active.id);
      const newIndex = banners.findIndex((b) => b.id === over.id);
      
      const newBanners = arrayMove(banners, oldIndex, newIndex);
      setBanners(newBanners);

      // Update sort_order in database
      try {
        await Promise.all(
          newBanners.map((banner, index) =>
            supabase
              .from("hero_banners")
              .update({ sort_order: index })
              .eq("id", banner.id)
          )
        );
        toast({ title: "Success", description: "Banner order updated" });
      } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message });
        fetchBanners(); // Revert on error
      }
    }
  };

  const handleOpenDialog = (banner?: HeroBanner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title || "",
        subtitle: banner.subtitle || "",
        description: banner.description || "",
        image_url: banner.image_url || "",
        video_url: banner.video_url || "",
        is_active: banner.is_active,
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        image_url: "",
        video_url: "",
        is_active: true,
      });
    }
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("hero-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("hero-images")
        .getPublicUrl(fileName);

      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
      toast({ title: "Success", description: "Image uploaded" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `hero-video-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("hero-videos")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("hero-videos")
        .getPublicUrl(fileName);

      setFormData((prev) => ({ ...prev, video_url: publicUrl }));
      toast({ title: "Success", description: "Video uploaded" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSave = async () => {
    try {
      const data = {
        title: formData.title || null,
        subtitle: formData.subtitle || null,
        description: formData.description || null,
        image_url: formData.image_url || null,
        video_url: formData.video_url || null,
        is_active: formData.is_active,
      };

      if (editingBanner) {
        await supabase.from("hero_banners").update(data).eq("id", editingBanner.id);
      } else {
        const maxOrder = Math.max(...banners.map((b) => b.sort_order), -1);
        await supabase.from("hero_banners").insert({ ...data, sort_order: maxOrder + 1 });
      }

      toast({ title: "Success", description: `Banner ${editingBanner ? "updated" : "created"}` });
      setDialogOpen(false);
      fetchBanners();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await supabase.from("hero_banners").delete().eq("id", id);
      toast({ title: "Deleted", description: "Banner removed" });
      fetchBanners();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await supabase.from("hero_banners").update({ is_active: !currentStatus }).eq("id", id);
      fetchBanners();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Hero Banners</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBanner ? "Edit Banner" : "Add New Banner"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Image Upload */}
              <div className="space-y-3">
                <Label className="font-semibold">Background Image</Label>
                {formData.image_url ? (
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
                    <img src={formData.image_url} alt="" className="w-full h-full object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData((prev) => ({ ...prev, image_url: "" }))}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50">
                    <p className="text-muted-foreground">No image uploaded</p>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <Label
                    htmlFor="banner-image-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                  </Label>
                  <input
                    id="banner-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                  <span className="text-sm text-muted-foreground">Recommended: 1920x1080</span>
                </div>
              </div>

              {/* Video Upload */}
              <div className="space-y-3 pt-4 border-t">
                <Label className="font-semibold">Background Video (Optional)</Label>
                <p className="text-sm text-muted-foreground">Video takes priority over image if both are set.</p>
                {formData.video_url ? (
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-black">
                    <video src={formData.video_url} controls className="w-full h-full object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData((prev) => ({ ...prev, video_url: "" }))}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded-lg border-2 border-dashed flex flex-col items-center justify-center bg-muted/50 gap-2">
                    <Video className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No video uploaded</p>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <Label
                    htmlFor="banner-video-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    {uploadingVideo ? "Uploading..." : "Upload Video"}
                  </Label>
                  <input
                    id="banner-video-upload"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoUpload}
                    disabled={uploadingVideo}
                  />
                  <span className="text-sm text-muted-foreground">Recommended: MP4, 1920x1080</span>
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-4 pt-4 border-t">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Main Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Utility Metering Solutions"
                    />
                  </div>
                  <div>
                    <Label>Subtitle / Badge Text</Label>
                    <Input
                      value={formData.subtitle}
                      onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="Kenya's Trusted Meter Supplier"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    placeholder="Premium prepaid electricity, water, and gas meters..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                  />
                  <Label>Active</Label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingBanner ? "Update Banner" : "Create Banner"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop to reorder banners. Active banners will rotate on the homepage carousel.
        </p>
        
        {banners.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Image className="h-12 w-12 mx-auto mb-4" />
            <p>No banners created yet. Click "Add Banner" to get started.</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={banners.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              {banners.map((banner) => (
                <SortableBannerItem
                  key={banner.id}
                  banner={banner}
                  onEdit={handleOpenDialog}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
}
