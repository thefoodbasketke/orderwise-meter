import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AnimatedPage, FadeIn } from "@/components/AnimatedPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Download, Search, Eye, FileText, Gauge } from "lucide-react";
import { format } from "date-fns";

interface MeterRegistration {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  meter_numbers: string[];
  purchase_date: string | null;
  purchase_location: string | null;
  receipt_number: string | null;
  warranty_extended: boolean;
  notes: string | null;
  created_at: string;
}

export default function AdminMeterRegistrations() {
  const [registrations, setRegistrations] = useState<MeterRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState<MeterRegistration | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from("meter_registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load meter registrations.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.phone.includes(searchTerm) ||
      reg.meter_numbers.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const downloadPDF = (registration: MeterRegistration) => {
    const content = `
METER REGISTRATION CERTIFICATE
==============================

Registration ID: ${registration.id}
Date: ${format(new Date(registration.created_at), "PPP")}

CUSTOMER INFORMATION
--------------------
Name: ${registration.customer_name}
Email: ${registration.email}
Phone: ${registration.phone}
Address: ${registration.address}

REGISTERED METERS
-----------------
${registration.meter_numbers.map((m, i) => `${i + 1}. ${m}`).join("\n")}

PURCHASE INFORMATION
--------------------
Purchase Date: ${registration.purchase_date ? format(new Date(registration.purchase_date), "PPP") : "Not provided"}
Purchase Location: ${registration.purchase_location || "Not provided"}
Receipt Number: ${registration.receipt_number || "Not provided"}

WARRANTY
--------
Standard Warranty: Active
Extended Warranty Interest: ${registration.warranty_extended ? "Yes" : "No"}

ADDITIONAL NOTES
----------------
${registration.notes || "None"}

==============================
UMS Kenya - Smart Metering Solutions
www.umskenya.com | 0700 444 448
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meter-registration-${registration.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Registration certificate downloaded successfully.",
    });
  };

  return (
    <ProtectedRoute requireAdmin>
      <AnimatedPage>
        <div className="min-h-screen bg-background">
          <Navbar />
          
          <div className="container mx-auto px-4 py-8">
            <FadeIn>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Meter Registrations</h1>
                  <p className="text-muted-foreground">View all customer meter registrations</p>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">{registrations.length} Total</span>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle>All Registrations</CardTitle>
                    <div className="relative w-full md:w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, email, phone, or meter..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading registrations...</p>
                    </div>
                  ) : filteredRegistrations.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No registrations found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Meters</TableHead>
                            <TableHead>Extended Warranty</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRegistrations.map((reg) => (
                            <TableRow key={reg.id}>
                              <TableCell className="whitespace-nowrap">
                                {format(new Date(reg.created_at), "dd MMM yyyy")}
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{reg.customer_name}</div>
                                <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                  {reg.address}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">{reg.email}</div>
                                <div className="text-sm text-muted-foreground">{reg.phone}</div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {reg.meter_numbers.length} meter{reg.meter_numbers.length !== 1 ? "s" : ""}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {reg.warranty_extended ? (
                                  <Badge className="bg-primary/10 text-primary">Interested</Badge>
                                ) : (
                                  <Badge variant="outline">No</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedRegistration(reg)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => downloadPDF(reg)}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          {/* Detail Dialog */}
          <Dialog open={!!selectedRegistration} onOpenChange={() => setSelectedRegistration(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registration Details</DialogTitle>
              </DialogHeader>
              {selectedRegistration && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Customer Name</h4>
                      <p>{selectedRegistration.customer_name}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Email</h4>
                      <p>{selectedRegistration.email}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Phone</h4>
                      <p>{selectedRegistration.phone}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Registration Date</h4>
                      <p>{format(new Date(selectedRegistration.created_at), "PPP")}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">Address</h4>
                    <p>{selectedRegistration.address}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Registered Meters</h4>
                    <div className="space-y-2">
                      {selectedRegistration.meter_numbers.map((meter, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                          <Gauge className="h-4 w-4 text-primary" />
                          <span className="font-mono">{meter}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Purchase Date</h4>
                      <p>{selectedRegistration.purchase_date ? format(new Date(selectedRegistration.purchase_date), "PPP") : "Not provided"}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Purchase Location</h4>
                      <p>{selectedRegistration.purchase_location || "Not provided"}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Receipt Number</h4>
                      <p>{selectedRegistration.receipt_number || "Not provided"}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Extended Warranty</h4>
                      <p>{selectedRegistration.warranty_extended ? "Interested" : "No"}</p>
                    </div>
                  </div>

                  {selectedRegistration.notes && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Notes</h4>
                      <p className="text-sm">{selectedRegistration.notes}</p>
                    </div>
                  )}

                  <Button onClick={() => downloadPDF(selectedRegistration)} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Certificate
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </AnimatedPage>
    </ProtectedRoute>
  );
}
