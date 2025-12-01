import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  customer_id: string;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
  products: { name: string };
  profiles: { full_name: string; phone_number: string };
  payments?: Array<{
    status: string;
    mpesa_receipt_number: string | null;
  }>;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          products(name),
          payments(status, mpesa_receipt_number)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Fetch profiles separately
      const ordersWithProfiles = await Promise.all(
        (data || []).map(async (order) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, phone_number")
            .eq("id", order.customer_id)
            .single();
          return { ...order, profiles: profile || { full_name: "N/A", phone_number: "N/A" } };
        })
      );
      
      setOrders(ordersWithProfiles as any);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load orders" });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
      toast({ title: "Success", description: "Order status updated" });
      fetchOrders();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Orders Management</h1>
          {loading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{order.products.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Customer</p>
                        <p className="font-semibold">{order.profiles?.full_name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-semibold">{order.profiles?.phone_number}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Quantity</p>
                        <p className="font-semibold">{order.quantity}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-semibold">KSh {order.total_price.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {order.payments && order.payments.length > 0 && (
                      <div className="border-t pt-3">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Payment Status:</span>
                          <Badge variant={order.payments[0].status === "success" ? "default" : "secondary"}>
                            {order.payments[0].status}
                          </Badge>
                          {order.payments[0].mpesa_receipt_number && (
                            <span className="text-xs text-muted-foreground ml-2">
                              Receipt: {order.payments[0].mpesa_receipt_number}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 border-t pt-3">
                      <span className="text-sm text-muted-foreground">Order Status:</span>
                      <Select value={order.status} onValueChange={(value) => updateStatus(order.id, value)}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="out for delivery">Out for Delivery</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
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
