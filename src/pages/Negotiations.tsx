import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare } from "lucide-react";

interface Negotiation {
  id: string;
  offer_price: number;
  customer_message: string;
  admin_message: string | null;
  counter_offer: number | null;
  status: string;
  created_at: string;
  products: {
    name: string;
    base_price: number;
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
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(true);
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
        .select("*, products(name, base_price)")
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

                    <p className="text-xs text-muted-foreground">
                      Submitted: {new Date(negotiation.created_at).toLocaleString()}
                    </p>
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
