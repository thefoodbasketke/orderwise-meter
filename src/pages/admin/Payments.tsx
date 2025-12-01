import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Payment {
  id: string;
  amount: number;
  phone_number: string;
  mpesa_receipt_number: string;
  status: string;
  created_at: string;
  transaction_id: string | null;
  orders?: {
    id: string;
    status: string;
    products: {
      name: string;
    } | null;
  };
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const { data } = await supabase
      .from("payments")
      .select(`
        *,
        orders(id, status, products(name))
      `)
      .order("created_at", { ascending: false });
    setPayments(data || []);
    setLoading(false);
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Payments</h1>
          {loading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <Card key={payment.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center flex-wrap gap-2">
                      <span>KSh {payment.amount.toLocaleString()}</span>
                      <Badge variant={payment.status === "success" ? "default" : payment.status === "pending" ? "secondary" : "destructive"}>
                        {payment.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-semibold">{payment.phone_number}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">M-Pesa Receipt</p>
                        <p className="font-semibold">{payment.mpesa_receipt_number || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Transaction ID</p>
                        <p className="font-semibold text-xs">{payment.transaction_id || "N/A"}</p>
                      </div>
                    </div>
                    
                    {payment.orders && (
                      <div className="border-t pt-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Order ID</p>
                            <p className="font-semibold text-xs">{payment.orders.id.slice(0, 8)}...</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Product</p>
                            <p className="font-semibold">{payment.orders.products?.name || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground border-t pt-2">
                      {new Date(payment.created_at).toLocaleString()}
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
