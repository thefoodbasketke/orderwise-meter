import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Negotiation {
  id: string;
  offer_price: number;
  customer_message: string;
  status: string;
  products: { name: string; base_price: number };
  profiles: { full_name: string };
}

export default function AdminNegotiations() {
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchNegotiations();
  }, []);

  const fetchNegotiations = async () => {
    const { data } = await supabase
      .from("negotiations")
      .select("*, products(name, base_price)")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    
    const negsWithProfiles = await Promise.all(
      (data || []).map(async (neg) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", neg.customer_id)
          .single();
        return { ...neg, profiles: profile || { full_name: "N/A" } };
      })
    );
    
    setNegotiations(negsWithProfiles as any);
  };

  const respond = async (id: string, status: string, counterOffer?: number, message?: string) => {
    try {
      const { error } = await supabase
        .from("negotiations")
        .update({ status, counter_offer: counterOffer, admin_message: message })
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Response sent" });
      fetchNegotiations();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Negotiations</h1>
          <div className="space-y-4">
            {negotiations.map((neg) => (
              <Card key={neg.id}>
                <CardHeader>
                  <CardTitle>{neg.products.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Customer</p>
                      <p className="font-semibold">{neg.profiles.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Base Price</p>
                      <p className="font-semibold">KSh {neg.products.base_price.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Offer</p>
                      <p className="font-semibold text-accent">KSh {neg.offer_price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <Label>Customer Message</Label>
                    <p className="p-3 bg-muted rounded text-sm">{neg.customer_message}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => respond(neg.id, "accepted")}>Accept</Button>
                    <Button size="sm" variant="destructive" onClick={() => respond(neg.id, "rejected", undefined, "Sorry, we cannot accept this offer")}>Reject</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
