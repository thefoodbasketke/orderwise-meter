import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, MapPin, Phone, Mail, Building, User, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DeliveryLocation {
  customer_name: string | null;
  phone_number: string | null;
  email: string | null;
  alternative_phone: string | null;
  county: string | null;
  town: string | null;
  building_name: string | null;
  floor_unit: string | null;
  address_text: string;
  location_notes: string | null;
  screenshot_url: string | null;
}

interface Order {
  id: string;
  customer_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  status: string;
  created_at: string;
  products: { name: string } | null;
  profiles: { full_name: string; phone_number: string } | null;
  payments?: Array<{
    status: string;
    mpesa_receipt_number: string | null;
  }>;
  delivery_locations?: DeliveryLocation[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
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
          payments(status, mpesa_receipt_number),
          delivery_locations(*)
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
      
      setOrders(ordersWithProfiles as Order[]);
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

  const toggleOrderExpanded = (orderId: string) => {
    setExpandedOrders(prev => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const exportToCSV = () => {
    if (orders.length === 0) {
      toast({ variant: "destructive", title: "No data", description: "No orders to export" });
      return;
    }

    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Phone Number",
      "Email",
      "Alt Phone",
      "Product",
      "Quantity",
      "Unit Price (KSh)",
      "Total Price (KSh)",
      "Order Status",
      "Payment Status",
      "M-Pesa Receipt",
      "County",
      "Town",
      "Building",
      "Floor/Unit",
      "Address",
      "Location Notes"
    ];

    const rows = orders.map(order => {
      const delivery = order.delivery_locations?.[0];
      return [
        order.id,
        format(new Date(order.created_at), "yyyy-MM-dd HH:mm"),
        delivery?.customer_name || order.profiles?.full_name || "N/A",
        delivery?.phone_number || order.profiles?.phone_number || "N/A",
        delivery?.email || "",
        delivery?.alternative_phone || "",
        order.products?.name || "N/A",
        order.quantity,
        order.unit_price?.toFixed(2) || (order.total_price / order.quantity).toFixed(2),
        order.total_price.toFixed(2),
        order.status,
        order.payments?.[0]?.status || "unpaid",
        order.payments?.[0]?.mpesa_receipt_number || "",
        delivery?.county || "",
        delivery?.town || "",
        delivery?.building_name || "",
        delivery?.floor_unit || "",
        delivery?.address_text || "",
        delivery?.location_notes || ""
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `orders-${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: "Success", description: "Orders exported successfully" });
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Orders Management</h1>
            <Button onClick={exportToCSV} variant="outline" disabled={orders.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const delivery = order.delivery_locations?.[0];
                const isExpanded = expandedOrders.has(order.id);
                
                return (
                  <Card key={order.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{order.products?.name || "Unknown Product"}</CardTitle>
                        <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Order ID: {order.id.slice(0, 8)}... | {format(new Date(order.created_at), "MMM dd, yyyy HH:mm")}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Customer</p>
                          <p className="font-semibold">{delivery?.customer_name || order.profiles?.full_name || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Phone</p>
                          <p className="font-semibold">{delivery?.phone_number || order.profiles?.phone_number || "N/A"}</p>
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

                      {/* Delivery Details Section */}
                      {delivery && (
                        <Collapsible open={isExpanded} onOpenChange={() => toggleOrderExpanded(order.id)}>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between border-t pt-3 mt-2 rounded-none">
                              <span className="flex items-center gap-2 text-sm font-medium">
                                <MapPin className="h-4 w-4" />
                                Delivery Details
                              </span>
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pt-3">
                            <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                              {/* Contact Information */}
                              <div>
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  Contact Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    <User className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">Name:</span>
                                    <span>{delivery.customer_name || "N/A"}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">Phone:</span>
                                    <span>{delivery.phone_number || "N/A"}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">Email:</span>
                                    <span>{delivery.email || "N/A"}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">Alt Phone:</span>
                                    <span>{delivery.alternative_phone || "N/A"}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Location Information */}
                              <div>
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  Location Details
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">County:</span>
                                    <span className="ml-2">{delivery.county || "N/A"}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Town:</span>
                                    <span className="ml-2">{delivery.town || "N/A"}</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <Building className="h-3 w-3 text-muted-foreground mt-1" />
                                    <span className="text-muted-foreground">Building:</span>
                                    <span>{delivery.building_name || "N/A"}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Floor/Unit:</span>
                                    <span className="ml-2">{delivery.floor_unit || "N/A"}</span>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <span className="text-muted-foreground text-sm">Full Address:</span>
                                  <p className="text-sm mt-1 bg-background p-2 rounded">{delivery.address_text}</p>
                                </div>
                                {delivery.location_notes && (
                                  <div className="mt-2">
                                    <span className="text-muted-foreground text-sm">Location Notes:</span>
                                    <p className="text-sm mt-1 bg-background p-2 rounded">{delivery.location_notes}</p>
                                  </div>
                                )}
                                {delivery.screenshot_url && (
                                  <div className="mt-2">
                                    <span className="text-muted-foreground text-sm">Location Screenshot:</span>
                                    <a 
                                      href={delivery.screenshot_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline text-sm ml-2"
                                    >
                                      View Image
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      )}

                      <div className="flex items-center gap-4 border-t pt-3">
                        <span className="text-sm text-muted-foreground">Update Status:</span>
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
                );
              })}
              {orders.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No orders found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
