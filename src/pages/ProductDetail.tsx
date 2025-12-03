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
import { Package, MessageSquare, ShoppingCart, ArrowLeft, FileText, Download } from "lucide-react";
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
}

const orderSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
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
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProduct(data);
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

      // Create delivery location
      const { error: locationError } = await supabase
        .from("delivery_locations")
        .insert({
          order_id: order.id,
          address_text: data.addressText,
          location_notes: data.locationNotes,
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
          {/* Product Image */}
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Product Info & Order Form */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-primary">
                KSh {product.base_price.toLocaleString()}
              </span>
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

                    <div>
                      <Label htmlFor="addressText">Delivery Address</Label>
                      <Textarea
                        id="addressText"
                        name="addressText"
                        placeholder="Enter full delivery address..."
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="locationNotes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="locationNotes"
                        name="locationNotes"
                        placeholder="Any special instructions..."
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
