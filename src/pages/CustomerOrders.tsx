import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Package, CreditCard } from "lucide-react";

interface Order {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  status: string;
  created_at: string;
  products: {
    name: string;
    image_url: string;
  };
  payments?: Array<{
    id: string;
    status: string;
    mpesa_receipt_number: string | null;
  }>;
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  processing: "default",
  "out for delivery": "default",
  delivered: "outline",
  cancelled: "destructive",
};

export default function CustomerOrders() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [phoneNumbers, setPhoneNumbers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          products(name, image_url),
          payments(id, status, mpesa_receipt_number)
        `)
        .eq("customer_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load orders",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (orderId: string, amount: number) => {
    const phone = phoneNumbers[orderId];
    if (!phone || phone.trim() === "") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your phone number",
      });
      return;
    }

    setPaymentLoading(orderId);
    try {
      // Get fresh session to ensure token is valid
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please log in again to continue",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke("initiate-payment", {
        body: {
          orderId,
          phone,
          amount,
        },
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Payment Initiated",
          description: data.message || "Check your phone to complete payment",
        });
        fetchOrders();
      } else {
        throw new Error(data.error || "Payment failed");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message || "Failed to initiate payment",
      });
    } finally {
      setPaymentLoading(null);
    }
  };

  const getPaymentStatus = (order: Order) => {
    if (!order.payments || order.payments.length === 0) {
      return { status: "unpaid", label: "Unpaid", variant: "destructive" as const };
    }
    const latestPayment = order.payments[0];
    if (latestPayment.status === "success") {
      return { status: "paid", label: "Paid", variant: "default" as const };
    } else if (latestPayment.status === "pending") {
      return { status: "pending", label: "Pending", variant: "secondary" as const };
    }
    return { status: "failed", label: "Failed", variant: "destructive" as const };
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">My Orders</h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                <p className="text-muted-foreground">Start shopping to see your orders here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const paymentStatus = getPaymentStatus(order);
                const needsPayment = paymentStatus.status === "unpaid" || paymentStatus.status === "failed";
                
                return (
                  <Card key={order.id} className="hover:shadow-hover transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <CardTitle className="text-lg">{order.products.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Order ID: {order.id.slice(0, 8)}...
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={statusColors[order.status] || "default"}>
                            {order.status}
                          </Badge>
                          <Badge variant={paymentStatus.variant}>
                            {paymentStatus.label}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Quantity</p>
                          <p className="font-semibold">{order.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Unit Price</p>
                          <p className="font-semibold">KSh {order.unit_price.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Price</p>
                          <p className="font-semibold text-primary">
                            KSh {order.total_price.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Order Date</p>
                          <p className="font-semibold">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {order.payments && order.payments[0]?.mpesa_receipt_number && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">
                            M-Pesa Receipt: {order.payments[0].mpesa_receipt_number}
                          </p>
                        </div>
                      )}

                      {needsPayment && (
                        <div className="border-t pt-4">
                          <Label htmlFor={`phone-${order.id}`} className="text-sm font-medium">
                            M-Pesa Phone Number
                          </Label>
                          <div className="flex gap-2 mt-2">
                            <Input
                              id={`phone-${order.id}`}
                              type="tel"
                              placeholder="0712345678 or +254712345678"
                              value={phoneNumbers[order.id] || ""}
                              onChange={(e) =>
                                setPhoneNumbers({
                                  ...phoneNumbers,
                                  [order.id]: e.target.value,
                                })
                              }
                              disabled={paymentLoading === order.id}
                            />
                            <Button
                              onClick={() => handlePayment(order.id, order.total_price)}
                              disabled={paymentLoading === order.id}
                              className="whitespace-nowrap"
                            >
                              <CreditCard className="mr-2 h-4 w-4" />
                              {paymentLoading === order.id ? "Processing..." : "Pay Now"}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Enter your Safaricom number to receive the STK push prompt
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
