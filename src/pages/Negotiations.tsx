import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, ShoppingCart } from "lucide-react";

interface Negotiation {
  id: string;
  product_id: string;
  order_id: string | null;
  offer_price: number;
  customer_message: string;
  admin_message: string | null;
  counter_offer: number | null;
  status: string;
  created_at: string;
  products: {
    name: string;
    base_price: number;
    stock: number;
  };
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  accepted: "outline",
  rejected: "destructive",
  counter: "default",
};

export default function Negotiations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedNegotiation, setSelectedNegotiation] = useState<Negotiation | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchNegotiations();
    }
  }, [user]);

  const fetchNegotiations = async () => {
    try {
      const { data, error } = await supabase
        .from("negotiations")
        .select("*, products(name, base_price, stock)")
        .eq("customer_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNegotiations(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load negotiations",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !selectedNegotiation) return;

    setOrderLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const customerName = formData.get("customerName") as string;
      const phoneNumber = formData.get("phoneNumber") as string;
      const email = formData.get("email") as string || "";
      const alternativePhone = formData.get("alternativePhone") as string || "";
      const county = formData.get("county") as string;
      const town = formData.get("town") as string;
      const buildingName = formData.get("buildingName") as string || "";
      const floorUnit = formData.get("floorUnit") as string || "";
      const addressText = formData.get("addressText") as string;
      const locationNotes = formData.get("locationNotes") as string || "";

      if (!customerName || customerName.length < 2) {
        throw new Error("Please enter your full name");
      }
      if (!phoneNumber || phoneNumber.length < 10) {
        throw new Error("Please enter a valid phone number");
      }
      if (addressText.length < 10) {
        throw new Error("Please provide a detailed delivery address");
      }

      // Use the negotiated price (counter_offer if exists, else offer_price for accepted)
      const agreedPrice = selectedNegotiation.counter_offer || selectedNegotiation.offer_price;
      const totalPrice = agreedPrice * quantity;

      // Create order with negotiated price
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_id: user.id,
          product_id: selectedNegotiation.product_id,
          quantity: quantity,
          unit_price: agreedPrice,
          total_price: totalPrice,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Link negotiation to order
      await supabase
        .from("negotiations")
        .update({ order_id: order.id })
        .eq("id", selectedNegotiation.id);

      // Create delivery location with all customer details
      const { error: locationError } = await supabase
        .from("delivery_locations")
        .insert({
          order_id: order.id,
          address_text: addressText,
          location_notes: locationNotes,
          customer_name: customerName,
          phone_number: phoneNumber,
          email: email || null,
          alternative_phone: alternativePhone || null,
          county: county,
          town: town,
          building_name: buildingName || null,
          floor_unit: floorUnit || null,
        });

      if (locationError) throw locationError;

      toast({
        title: "Success",
        description: "Order placed with negotiated price!",
      });

      setOrderDialogOpen(false);
      setSelectedNegotiation(null);
      navigate("/orders");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to place order",
      });
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Price Negotiations</h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading negotiations...</p>
            </div>
          ) : negotiations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Negotiations Yet</h3>
                <p className="text-muted-foreground">
                  Start negotiating on product pages to get better prices
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {negotiations.map((negotiation) => (
                <Card key={negotiation.id} className="hover:shadow-hover transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{negotiation.products.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Base Price: KSh {negotiation.products.base_price.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={statusColors[negotiation.status] || "default"}>
                        {negotiation.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Your Offer</p>
                        <p className="font-semibold text-accent">
                          KSh {negotiation.offer_price.toLocaleString()}
                        </p>
                      </div>
                      {negotiation.counter_offer && (
                        <div>
                          <p className="text-sm text-muted-foreground">Counter Offer</p>
                          <p className="font-semibold text-primary">
                            KSh {negotiation.counter_offer.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Your Message</p>
                      <p className="text-sm bg-muted p-3 rounded">{negotiation.customer_message}</p>
                    </div>

                    {negotiation.admin_message && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Admin Response</p>
                        <p className="text-sm bg-primary/5 p-3 rounded border border-primary/20">
                          {negotiation.admin_message}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs text-muted-foreground">
                        Submitted: {new Date(negotiation.created_at).toLocaleString()}
                      </p>
                      {negotiation.status === "accepted" && !negotiation.order_id && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedNegotiation(negotiation);
                            setQuantity(1);
                            setOrderDialogOpen(true);
                          }}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Place Order
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Order Dialog for Accepted Negotiations */}
          <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Place Order with Negotiated Price</DialogTitle>
              </DialogHeader>
              {selectedNegotiation && (
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <p className="font-medium">{selectedNegotiation.products.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Original Price: KSh {selectedNegotiation.products.base_price.toLocaleString()}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      Negotiated Price: KSh {(selectedNegotiation.counter_offer || selectedNegotiation.offer_price).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={selectedNegotiation.products.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      required
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Total: KSh {((selectedNegotiation.counter_offer || selectedNegotiation.offer_price) * quantity).toLocaleString()}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3 text-sm">Customer Details</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="customerName" className="text-xs">Full Name *</Label>
                        <Input id="customerName" name="customerName" placeholder="Your full name" required />
                      </div>
                      <div>
                        <Label htmlFor="phoneNumber" className="text-xs">Phone Number *</Label>
                        <Input id="phoneNumber" name="phoneNumber" type="tel" placeholder="0712345678" required />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-xs">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="your@email.com" />
                      </div>
                      <div>
                        <Label htmlFor="alternativePhone" className="text-xs">Alt. Phone</Label>
                        <Input id="alternativePhone" name="alternativePhone" type="tel" placeholder="Optional" />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3 text-sm">Delivery Location</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="county" className="text-xs">County *</Label>
                        <Input id="county" name="county" placeholder="e.g., Nairobi" required />
                      </div>
                      <div>
                        <Label htmlFor="town" className="text-xs">Town/Area *</Label>
                        <Input id="town" name="town" placeholder="e.g., Westlands" required />
                      </div>
                      <div>
                        <Label htmlFor="buildingName" className="text-xs">Building/Estate</Label>
                        <Input id="buildingName" name="buildingName" placeholder="Building name" />
                      </div>
                      <div>
                        <Label htmlFor="floorUnit" className="text-xs">Floor/Unit</Label>
                        <Input id="floorUnit" name="floorUnit" placeholder="e.g., 3rd Floor" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <Label htmlFor="addressText" className="text-xs">Full Address *</Label>
                      <Textarea
                        id="addressText"
                        name="addressText"
                        placeholder="Enter detailed delivery address..."
                        rows={2}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="locationNotes" className="text-xs">Special Instructions</Label>
                    <Textarea
                      id="locationNotes"
                      name="locationNotes"
                      placeholder="Any special delivery instructions..."
                      rows={2}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={orderLoading}>
                    {orderLoading ? "Placing Order..." : "Confirm Order"}
                  </Button>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ProtectedRoute>
  );
}
