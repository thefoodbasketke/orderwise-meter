import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash, FileText, ImageIcon, Images, Tag } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MultiImageUpload } from "@/components/admin/MultiImageUpload";
import { z } from "zod";

interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  image_url: string;
  stock: number;
  category: string;
  specifications: string | null;
  catalogue_pdf_url: string | null;
  label: string | null;
}

interface ProductImage {
  id?: string;
  image_url: string;
  sort_order: number;
  file?: File;
}

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  description: z.string().max(500),
  basePrice: z.number().min(0.01, "Price must be greater than 0"),
  stock: z.number().min(0, "Stock cannot be negative"),
  category: z.string().max(50),
  specifications: z.string().max(2000).optional(),
  label: z.string().optional(),
});

const PRODUCT_LABELS = [
  { value: "", label: "No Label" },
  { value: "On Offer", label: "On Offer" },
  { value: "New", label: "New" },
  { value: "Best Seller", label: "Best Seller" },
  { value: "Limited Stock", label: "Limited Stock" },
  { value: "Clearance", label: "Clearance" },
];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      fetchProductImages(editingProduct.id);
      setPdfName(editingProduct.catalogue_pdf_url ? "Current PDF" : null);
      setSelectedLabel(editingProduct.label || "");
    } else {
      setProductImages([]);
      setPdfName(null);
      setSelectedLabel("");
    }
    setPdfFile(null);
  }, [editingProduct, dialogOpen]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load products",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProductImages = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", productId)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setProductImages(data || []);
    } catch (error) {
      console.error("Error fetching product images:", error);
    }
  };

  const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        variant: "destructive",
        title: "Invalid file",
        description: "Please select a PDF file",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "PDF must be less than 10MB",
      });
      return;
    }

    setPdfFile(file);
    setPdfName(file.name);
  };

  const uploadPdf = async (file: File): Promise<string | null> => {
    const fileName = `${crypto.randomUUID()}.pdf`;
    const filePath = `catalogues/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("PDF upload error:", uploadError);
      throw new Error("Failed to upload PDF");
    }

    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error("Failed to upload image");
    }

    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      setUploading(true);

      const data = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        basePrice: parseFloat(formData.get("basePrice") as string),
        stock: parseInt(formData.get("stock") as string),
        category: formData.get("category") as string,
        specifications: formData.get("specifications") as string || "",
        label: selectedLabel || undefined,
      };

      productSchema.parse(data);

      // Upload new images and get URLs
      const uploadedImages: { image_url: string; sort_order: number }[] = [];
      for (const img of productImages) {
        if (img.file) {
          const url = await uploadImage(img.file);
          uploadedImages.push({ image_url: url, sort_order: img.sort_order });
        } else if (img.id) {
          uploadedImages.push({ image_url: img.image_url, sort_order: img.sort_order });
        }
      }

      // Main image is the first one
      const mainImageUrl = uploadedImages[0]?.image_url || editingProduct?.image_url || null;

      let pdfUrl = editingProduct?.catalogue_pdf_url || null;
      if (pdfFile) {
        pdfUrl = await uploadPdf(pdfFile);
      }

      const productData = {
        name: data.name,
        description: data.description,
        base_price: data.basePrice,
        image_url: mainImageUrl,
        stock: data.stock,
        category: data.category,
        specifications: data.specifications || null,
        catalogue_pdf_url: pdfUrl,
        label: selectedLabel || null,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;

        // Delete old images and insert new ones
        await supabase
          .from("product_images")
          .delete()
          .eq("product_id", editingProduct.id);

        if (uploadedImages.length > 0) {
          const { error: imgError } = await supabase
            .from("product_images")
            .insert(uploadedImages.map(img => ({
              product_id: editingProduct.id,
              image_url: img.image_url,
              sort_order: img.sort_order,
            })));

          if (imgError) console.error("Error saving images:", imgError);
        }

        toast({ title: "Success", description: "Product updated successfully" });
      } else {
        const { data: newProduct, error } = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single();

        if (error) throw error;

        // Insert product images
        if (uploadedImages.length > 0 && newProduct) {
          const { error: imgError } = await supabase
            .from("product_images")
            .insert(uploadedImages.map(img => ({
              product_id: newProduct.id,
              image_url: img.image_url,
              sort_order: img.sort_order,
            })));

          if (imgError) console.error("Error saving images:", imgError);
        }

        toast({ title: "Success", description: "Product created successfully" });
      }

      setDialogOpen(false);
      setEditingProduct(null);
      setProductImages([]);
      setPdfFile(null);
      setPdfName(null);
      setSelectedLabel("");
      fetchProducts();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.errors[0].message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      // Delete images first
      await supabase
        .from("product_images")
        .delete()
        .eq("product_id", id);

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Product deleted successfully" });
      fetchProducts();
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
            <h1 className="text-3xl font-bold">Products Management</h1>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                setEditingProduct(null);
                setProductImages([]);
                setPdfFile(null);
                setPdfName(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingProduct(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={editingProduct?.name}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={editingProduct?.description}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="basePrice">Base Price (KSh)</Label>
                      <Input
                        id="basePrice"
                        name="basePrice"
                        type="number"
                        step="0.01"
                        defaultValue={editingProduct?.base_price}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        defaultValue={editingProduct?.stock}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        name="category"
                        defaultValue={editingProduct?.category}
                      />
                    </div>
                    <div>
                      <Label htmlFor="label">Product Label</Label>
                      <Select value={selectedLabel} onValueChange={setSelectedLabel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select label" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRODUCT_LABELS.map((label) => (
                            <SelectItem key={label.value} value={label.value || "none"}>
                              <span className="flex items-center gap-2">
                                {label.value && <Tag className="h-3 w-3" />}
                                {label.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="specifications">Specifications</Label>
                    <Textarea
                      id="specifications"
                      name="specifications"
                      defaultValue={editingProduct?.specifications || ""}
                      rows={4}
                      placeholder="Enter product specifications..."
                    />
                  </div>
                  
                  {/* Multiple Image Upload */}
                  <MultiImageUpload
                    productId={editingProduct?.id}
                    existingImages={productImages}
                    onImagesChange={setProductImages}
                  />

                  <div>
                    <Label>Product Catalogue (PDF)</Label>
                    <input
                      ref={pdfInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfSelect}
                      className="hidden"
                    />
                    <div 
                      onClick={() => pdfInputRef.current?.click()}
                      className="mt-2 border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                    >
                      {pdfName ? (
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-5 w-5 text-primary" />
                          <span className="truncate">{pdfName}</span>
                          <span className="text-xs text-muted-foreground">(Click to change)</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-2 text-muted-foreground">
                          <FileText className="h-6 w-6 mb-1" />
                          <p className="text-sm">Click to upload PDF</p>
                          <p className="text-xs">Max 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={uploading}>
                    {uploading ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  {product.image_url ? (
                    <div className="h-48 overflow-hidden bg-muted relative">
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        {product.label && (
                          <Badge className="text-xs bg-accent text-accent-foreground">
                            <Tag className="h-3 w-3 mr-1" />
                            {product.label}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          <Images className="h-3 w-3 mr-1" />
                          Gallery
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-muted flex items-center justify-center relative">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      {product.label && (
                        <div className="absolute top-2 right-2">
                          <Badge className="text-xs bg-accent text-accent-foreground">
                            <Tag className="h-3 w-3 mr-1" />
                            {product.label}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-start justify-between">
                      <span className="line-clamp-1">{product.name}</span>
                      <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                        {product.stock}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">
                        KSh {product.base_price.toLocaleString()}
                      </span>
                      {product.category && (
                        <Badge variant="secondary">{product.category}</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setEditingProduct(product);
                          setDialogOpen(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(product.id)}
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
