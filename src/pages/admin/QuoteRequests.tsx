import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AnimatedPage, FadeIn } from "@/components/AnimatedPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Search, Eye, FileText, Building2 } from "lucide-react";
import { format } from "date-fns";

interface QuoteRequest {
  id: string;
  company_name: string | null;
  contact_name: string;
  email: string;
  phone: string;
  project_type: string;
  meter_type: string;
  quantity: number;
  location: string;
  timeline: string | null;
  budget: string | null;
  requirements: string | null;
  file_url: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600",
  reviewed: "bg-blue-500/10 text-blue-600",
  quoted: "bg-green-500/10 text-green-600",
  rejected: "bg-red-500/10 text-red-600",
};

const projectTypeLabels: Record<string, string> = {
  residential: "Residential Estate",
  commercial: "Commercial Building",
  industrial: "Industrial Facility",
  municipal: "Municipal / Government",
  other: "Other",
};

const meterTypeLabels: Record<string, string> = {
  electricity: "Prepaid Electricity",
  water: "Smart Water",
  gas: "Smart Gas",
  mixed: "Mixed Types",
};

export default function AdminQuoteRequests() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load quote requests.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.phone.includes(searchTerm) ||
      (quote.company_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const openQuoteDetail = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
    setAdminNotes(quote.admin_notes || "");
    setNewStatus(quote.status);
  };

  const updateQuote = async () => {
    if (!selectedQuote) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from("quote_requests")
        .update({
          status: newStatus,
          admin_notes: adminNotes,
        })
        .eq("id", selectedQuote.id);

      if (error) throw error;

      toast({
        title: "Quote Updated",
        description: "Quote request has been updated successfully.",
      });

      fetchQuotes();
      setSelectedQuote(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update quote request.",
      });
    } finally {
      setUpdating(false);
    }
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
                  <h1 className="text-3xl font-bold">Quote Requests</h1>
                  <p className="text-muted-foreground">Manage customer quotation requests</p>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">{quotes.length} Total</span>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle>All Quote Requests</CardTitle>
                    <div className="relative w-full md:w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, email, phone, or company..."
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
                      <p className="text-muted-foreground">Loading quote requests...</p>
                    </div>
                  ) : filteredQuotes.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No quote requests found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Meter Type</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredQuotes.map((quote) => (
                            <TableRow key={quote.id}>
                              <TableCell className="whitespace-nowrap">
                                {format(new Date(quote.created_at), "dd MMM yyyy")}
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{quote.contact_name}</div>
                                {quote.company_name && (
                                  <div className="text-sm text-muted-foreground">{quote.company_name}</div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">{projectTypeLabels[quote.project_type] || quote.project_type}</div>
                                <div className="text-xs text-muted-foreground">{quote.location}</div>
                              </TableCell>
                              <TableCell>
                                {meterTypeLabels[quote.meter_type] || quote.meter_type}
                              </TableCell>
                              <TableCell>{quote.quantity} units</TableCell>
                              <TableCell>
                                <Badge className={statusColors[quote.status] || ""}>
                                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openQuoteDetail(quote)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
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
          <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Quote Request Details</DialogTitle>
              </DialogHeader>
              {selectedQuote && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Contact Name</h4>
                      <p>{selectedQuote.contact_name}</p>
                    </div>
                    {selectedQuote.company_name && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">Company</h4>
                        <p>{selectedQuote.company_name}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Email</h4>
                      <p>{selectedQuote.email}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Phone</h4>
                      <p>{selectedQuote.phone}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Project Type</h4>
                      <p>{projectTypeLabels[selectedQuote.project_type] || selectedQuote.project_type}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Meter Type</h4>
                      <p>{meterTypeLabels[selectedQuote.meter_type] || selectedQuote.meter_type}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Quantity</h4>
                      <p>{selectedQuote.quantity} units</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Location</h4>
                      <p>{selectedQuote.location}</p>
                    </div>
                  </div>

                  {selectedQuote.timeline && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Timeline</h4>
                      <p>{selectedQuote.timeline}</p>
                    </div>
                  )}

                  {selectedQuote.budget && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Budget / Notes</h4>
                      <p>{selectedQuote.budget}</p>
                    </div>
                  )}

                  {selectedQuote.requirements && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Requirements</h4>
                      <p className="text-sm whitespace-pre-wrap">{selectedQuote.requirements}</p>
                    </div>
                  )}

                  <div className="border-t pt-4 space-y-4">
                    <h4 className="font-semibold">Admin Actions</h4>
                    
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="quoted">Quoted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Admin Notes</Label>
                      <Textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add internal notes about this quote request..."
                        rows={3}
                      />
                    </div>

                    <Button onClick={updateQuote} className="w-full" disabled={updating}>
                      {updating ? "Updating..." : "Update Quote Request"}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </AnimatedPage>
    </ProtectedRoute>
  );
}
