import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, GripVertical } from "lucide-react";

interface ProductImage {
  id?: string;
  image_url: string;
  sort_order: number;
  file?: File;
}

interface MultiImageUploadProps {
  productId?: string;
  existingImages: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
}

export function MultiImageUpload({ productId, existingImages, onImagesChange }: MultiImageUploadProps) {
  const [images, setImages] = useState<{ id?: string; image_url: string; sort_order: number; file?: File }[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const validFiles = files.filter(file => {
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Invalid file",
          description: `${file.name} is not an image`,
        });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: `${file.name} exceeds 5MB limit`,
        });
        return false;
      }
      return true;
    });

    const newImages = validFiles.map((file, index) => ({
      image_url: URL.createObjectURL(file),
      sort_order: images.length + index,
      file,
    }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange(updatedImages);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index).map((img, i) => ({
      ...img,
      sort_order: i,
    }));
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    
    const updatedImages = [...images];
    const [moved] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, moved);
    
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      sort_order: i,
    }));
    
    setImages(reorderedImages);
    onImagesChange(reorderedImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Product Images</span>
        <span className="text-xs text-muted-foreground">{images.length} image(s)</span>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesSelect}
        className="hidden"
      />
      
      <div className="grid grid-cols-3 gap-2">
        {images.map((image, index) => (
          <div 
            key={image.id || index} 
            className="relative group aspect-square bg-muted rounded-md overflow-hidden"
          >
            <img
              src={image.image_url}
              alt={`Product image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={() => moveImage(index, index - 1)}
                disabled={index === 0}
              >
                ↑
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={() => moveImage(index, index + 1)}
                disabled={index === images.length - 1}
              >
                ↓
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {index === 0 && (
              <span className="absolute top-1 left-1 text-[10px] bg-primary text-primary-foreground px-1 rounded">
                Main
              </span>
            )}
          </div>
        ))}
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
        >
          <Upload className="h-6 w-6 text-muted-foreground mb-1" />
          <span className="text-xs text-muted-foreground">Add</span>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground">
        First image will be the main product image. Drag to reorder.
      </p>
    </div>
  );
}
