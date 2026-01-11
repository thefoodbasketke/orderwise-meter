import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash, Upload, Video, Eye, EyeOff, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VideoShowcase {
  id: string;
  title: string | null;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export default function AdminVideoShowcase() {
  const [videos, setVideos] = useState<VideoShowcase[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoShowcase | null>(null);
  const [uploading, setUploading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (editingVideo) {
      setThumbnailPreview(editingVideo.thumbnail_url || null);
    } else {
      setThumbnailPreview(null);
    }
    setVideoFile(null);
    setThumbnailFile(null);
  }, [editingVideo, dialogOpen]);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("video_showcases")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setVideos(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load videos",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast({
        variant: "destructive",
        title: "Invalid file",
        description: "Please select a video file",
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Video must be less than 100MB",
      });
      return;
    }

    setVideoFile(file);
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const uploadFile = async (file: File, bucket: string, folder: string): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error("Failed to upload file");
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!editingVideo && !videoFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a video to upload",
      });
      return;
    }

    try {
      setUploading(true);

      let videoUrl = editingVideo?.video_url || "";
      let thumbnailUrl = editingVideo?.thumbnail_url || null;
      
      if (videoFile) {
        videoUrl = await uploadFile(videoFile, "hero-videos", "showcase");
      }
      
      if (thumbnailFile) {
        thumbnailUrl = await uploadFile(thumbnailFile, "gallery-images", "thumbnails");
      }

      const isActive = formData.get("is_active") === "on";

      const videoData = {
        title: formData.get("title") as string || null,
        description: formData.get("description") as string || null,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        is_active: isActive,
        sort_order: parseInt(formData.get("sort_order") as string) || 0,
      };

      if (editingVideo) {
        const { error } = await supabase
          .from("video_showcases")
          .update(videoData)
          .eq("id", editingVideo.id);

        if (error) throw error;
        toast({ title: "Success", description: "Video updated successfully" });
      } else {
        const { error } = await supabase
          .from("video_showcases")
          .insert(videoData);

        if (error) throw error;
        toast({ title: "Success", description: "Video added successfully" });
      }

      setDialogOpen(false);
      setEditingVideo(null);
      setVideoFile(null);
      setThumbnailFile(null);
      setThumbnailPreview(null);
      fetchVideos();
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
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const { error } = await supabase
        .from("video_showcases")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Video deleted successfully" });
      fetchVideos();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const toggleActive = async (video: VideoShowcase) => {
    try {
      const { error } = await supabase
        .from("video_showcases")
        .update({ is_active: !video.is_active })
        .eq("id", video.id);

      if (error) throw error;
      toast({
        title: "Success",
        description: video.is_active ? "Video hidden" : "Video visible",
      });
      fetchVideos();
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
            <h1 className="text-3xl font-bold">Video Showcase Management</h1>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                setEditingVideo(null);
                setVideoFile(null);
                setThumbnailFile(null);
                setThumbnailPreview(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingVideo(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Video
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingVideo ? "Edit Video" : "Add New Video"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title (Optional)</Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={editingVideo?.title || ""}
                      placeholder="Video title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={editingVideo?.description || ""}
                      rows={2}
                      placeholder="Brief description..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      name="sort_order"
                      type="number"
                      defaultValue={editingVideo?.sort_order || 0}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_active">Show on Homepage</Label>
                    <Switch
                      id="is_active"
                      name="is_active"
                      defaultChecked={editingVideo?.is_active ?? true}
                    />
                  </div>
                  <div>
                    <Label>Video {!editingVideo && "(Required)"}</Label>
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoSelect}
                      className="hidden"
                    />
                    <div 
                      onClick={() => videoInputRef.current?.click()}
                      className="mt-2 border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                    >
                      {videoFile ? (
                        <div className="flex items-center gap-3 text-primary">
                          <Video className="h-6 w-6" />
                          <span className="text-sm">{videoFile.name}</span>
                        </div>
                      ) : editingVideo?.video_url ? (
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Video className="h-6 w-6" />
                          <span className="text-sm">Click to change video</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
                          <Upload className="h-8 w-8 mb-2" />
                          <p className="text-sm">Click to upload video</p>
                          <p className="text-xs">MP4, WebM up to 100MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Thumbnail (Optional)</Label>
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailSelect}
                      className="hidden"
                    />
                    <div 
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="mt-2 border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                    >
                      {thumbnailPreview ? (
                        <div className="relative">
                          <img 
                            src={thumbnailPreview} 
                            alt="Thumbnail Preview" 
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <p className="text-xs text-muted-foreground mt-2 text-center">
                            Click to change thumbnail
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
                          <Upload className="h-6 w-6 mb-2" />
                          <p className="text-sm">Click to upload thumbnail</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={uploading}>
                    {uploading ? "Uploading..." : editingVideo ? "Update Video" : "Add Video"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading videos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No videos yet. Add your first video!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="aspect-video overflow-hidden bg-muted relative">
                    {video.thumbnail_url ? (
                      <img 
                        src={video.thumbnail_url} 
                        alt={video.title || "Video thumbnail"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video 
                        src={video.video_url}
                        className="w-full h-full object-cover"
                        muted
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                    <Badge 
                      className="absolute top-2 right-2"
                      variant={video.is_active ? "default" : "secondary"}
                    >
                      {video.is_active ? "Active" : "Hidden"}
                    </Badge>
                  </div>
                  <CardContent className="p-4 space-y-2">
                    {video.title && (
                      <h3 className="font-semibold line-clamp-1">{video.title}</h3>
                    )}
                    {video.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleActive(video)}
                      >
                        {video.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setEditingVideo(video);
                          setDialogOpen(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(video.id)}
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
