import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { Package, MessageSquare, ShoppingCart, ArrowLeft, FileText, Download, MessageCircle, Tag } from "lucide-react";
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
  id: string;
  image_url: string;
  sort_order: number | null;
}

const orderSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
  customerName: z.string().min(2, "Please enter your full name"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email().optional().or(z.literal("")),
  alternativePhone: z.string().optional(),
  county: z.string().min(2, "Please enter your county"),
  town: z.string().min(2, "Please enter your town/area"),
  buildingName: z.string().optional(),
  floorUnit: z.string().optional(),
  addressText: z.string().min(10, "Please provide a detailed delivery address"),
  locationNotes: z.string().max(500).optional(),
});

const negotiationSchema = z.object({
  offerPrice: z.number().min(1, "Offer price must be greater than 0"),
  message: z.string().min(10, "Please provide a message").max(500),
});

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [negotiationLoading, setNegotiationLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showNegotiation, setShowNegotiation] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const [productResult, imagesResult] = await Promise.all([
        supabase.from("products").select("*").eq("id", id).single(),
        supabase.from("product_images").select("*").eq("product_id", id).order("sort_order", { ascending: true })
      ]);

      if (productResult.error) throw productResult.error;
      setProduct(productResult.data);

      // Combine main image with additional images
      const additionalImages = (imagesResult.data as ProductImage[] || []).map(img => img.image_url);
      const allImages = productResult.data.image_url 
        ? [productResult.data.image_url, ...additionalImages]
        : additionalImages;
      setProductImages(allImages);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load product",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !product) return;

    setOrderLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const data = {
        quantity: parseInt(formData.get("quantity") as string),
        addressText: formData.get("addressText") as string,
        locationNotes: formData.get("locationNotes") as string || "",
        customerName: formData.get("customerName") as string,
        phoneNumber: formData.get("phoneNumber") as string,
        email: formData.get("email") as string || "",
        alternativePhone: formData.get("alternativePhone") as string || "",
        county: formData.get("county") as string,
        town: formData.get("town") as string,
        buildingName: formData.get("buildingName") as string || "",
        floorUnit: formData.get("floorUnit") as string || "",
      };

      orderSchema.parse(data);

      const totalPrice = product.base_price * data.quantity;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_id: user.id,
          product_id: product.id,
          quantity: data.quantity,
          unit_price: product.base_price,
          total_price: totalPrice,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create delivery location with all customer details
      const { error: locationError } = await supabase
        .from("delivery_locations")
        .insert({
          order_id: order.id,
          address_text: data.addressText,
          location_notes: data.locationNotes,
          customer_name: data.customerName,
          phone_number: data.phoneNumber,
          email: data.email || null,
          alternative_phone: data.alternativePhone || null,
          county: data.county,
          town: data.town,
          building_name: data.buildingName || null,
          floor_unit: data.floorUnit || null,
        });

      if (locationError) throw locationError;

      toast({
        title: "Success",
        description: "Order placed successfully!",
      });

      navigate("/orders");
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
          description: error.message || "Failed to place order",
        });
      }
    } finally {
      setOrderLoading(false);
    }
  };

  const handleNegotiation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !product) return;

    setNegotiationLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const data = {
        offerPrice: parseFloat(formData.get("offerPrice") as string),
        message: formData.get("message") as string,
      };

      negotiationSchema.parse(data);

      const { error } = await supabase
        .from("negotiations")
        .insert({
          customer_id: user.id,
          product_id: product.id,
          offer_price: data.offerPrice,
          customer_message: data.message,
          status: "pending",
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Negotiation request sent!",
      });

      setShowNegotiation(false);
      navigate("/negotiations");
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
          description: error.message || "Failed to submit negotiation",
        });
      }
    } finally {
      setNegotiationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/products">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image Gallery */}
          <ProductImageGallery 
            images={productImages} 
            productName={product.name} 
          />

          {/* Product Info & Order Form */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-3xl font-bold text-primary">
                KSh {product.base_price.toLocaleString()}
              </span>
              {product.label && (
                <Badge className="bg-accent text-accent-foreground">
                  <Tag className="h-3 w-3 mr-1" />
                  {product.label}
                </Badge>
              )}
              <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </Badge>
              {product.category && (
                <Badge variant="secondary">{product.category}</Badge>
              )}
            </div>
            <p className="text-muted-foreground mb-6">{product.description}</p>

            {product.specifications && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Specifications
                </h3>
                <div className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap">
                  {product.specifications}
                </div>
              </div>
            )}

            {product.catalogue_pdf_url && (
              <div className="mb-6">
                <a
                  href={product.catalogue_pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <Download className="h-4 w-4" />
                  Download Product Catalogue (PDF)
                </a>
              </div>
            )}

            {/* WhatsApp Buttons */}
            <div className="flex gap-3 mb-6">
              <a
                href={`https://wa.me/254700444448?text=${encodeURIComponent(`Hi, I'd like to order: ${product.name} (KSh ${product.base_price.toLocaleString()})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Order via WhatsApp
                </Button>
              </a>
              <a
                href={`https://wa.me/254700444448?text=${encodeURIComponent(`Hi, I'd like to enquire about: ${product.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enquire via WhatsApp
                </Button>
              </a>
            </div>

            {!user ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="mb-4">Please sign in to place an order</p>
                  <Link to="/auth">
                    <Button>Sign In</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : showNegotiation ? (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Negotiate Price</h3>
                  <form onSubmit={handleNegotiation} className="space-y-4">
                    <div>
                      <Label htmlFor="offerPrice">Your Offer (KSh)</Label>
                      <Input
                        id="offerPrice"
                        name="offerPrice"
                        type="number"
                        step="0.01"
                        placeholder="Enter your offer"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Explain your offer..."
                        rows={4}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={negotiationLoading} className="flex-1">
                        {negotiationLoading ? "Submitting..." : "Submit Offer"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNegotiation(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleOrder} className="space-y-4">
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        required
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Total: KSh {(product.base_price * quantity).toLocaleString()}
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Customer Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="customerName">Full Name *</Label>
                          <Input
                            id="customerName"
                            name="customerName"
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phoneNumber">Phone Number *</Label>
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            placeholder="0712345678"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="alternativePhone">Alternative Phone</Label>
                          <Input
                            id="alternativePhone"
                            name="alternativePhone"
                            type="tel"
                            placeholder="Optional backup number"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Delivery Location</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="county">County *</Label>
                          <Input
                            id="county"
                            name="county"
                            placeholder="e.g., Nairobi"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="town">Town/Area *</Label>
                          <Input
                            id="town"
                            name="town"
                            placeholder="e.g., Westlands"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="buildingName">Building/Estate Name</Label>
                          <Input
                            id="buildingName"
                            name="buildingName"
                            placeholder="Building or estate name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="floorUnit">Floor/Unit Number</Label>
                          <Input
                            id="floorUnit"
                            name="floorUnit"
                            placeholder="e.g., 3rd Floor, Unit 5"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label htmlFor="addressText">Full Address/Directions *</Label>
                        <Textarea
                          id="addressText"
                          name="addressText"
                          placeholder="Enter detailed delivery address and directions..."
                          rows={3}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="locationNotes">Special Instructions (Optional)</Label>
                      <Textarea
                        id="locationNotes"
                        name="locationNotes"
                        placeholder="Any special delivery instructions, landmarks, or notes..."
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={orderLoading || product.stock === 0}
                        className="flex-1"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {orderLoading ? "Placing Order..." : "Place Order"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNegotiation(true)}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Negotiate
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
