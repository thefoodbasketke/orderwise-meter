import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedPage, FadeIn } from "@/components/AnimatedPage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, 
  Gauge,
  ShoppingBag,
  Shield,
  Send,
  CheckCircle2,
  Plus,
  Trash2,
  FileText,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { z } from "zod";

const CUSTOMER_AGREEMENT_PDF_URL =
  "https://txwlugpjzcloqvwuvhwd.supabase.co/storage/v1/object/public/site-forms/customer-agreement-prepaid-metering.pdf";

const registerSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100),
  phone: z.string().trim().min(10, "Valid phone number required").max(15),
  email: z.string().trim().email("Invalid email").max(255),
  address: z.string().trim().min(5, "Address is required").max(300),
  meterNumbers: z.array(z.string().trim().min(3, "Meter number required")).min(1, "At least one meter number required"),
  purchaseDate: z.string().optional(),
  purchaseLocation: z.string().optional(),
  receiptNumber: z.string().optional(),
  extendedWarranty: z.boolean(),
  notes: z.string().optional(),
  termsAccepted: z.literal(true, { errorMap: () => ({ message: "You must accept the terms and conditions" }) }),
});

const agreementSections: { heading: string; body: string | string[] }[] = [
  {
    heading: "Parties",
    body:
      "This Agreement is between UMS Kenya Ltd and the undersigned Client (owner/manager of the premises).",
  },
  {
    heading: "1. Purpose of Agreement",
    body:
      "UMS Kenya agrees to provide prepaid metering services for electricity, water, and/or gas, and associated services including token vending, collections, reporting, and optional arrears recovery.",
  },
  {
    heading: "2. Definitions",
    body: [
      "Client: The person or entity contracting UMS Kenya.",
      "Occupant: The tenant or end user.",
      "Meters: Electricity, water, or gas meters supplied/registered by UMS.",
      "Token: Unique recharge code for utility units.",
    ],
  },
  {
    heading: "3. Fees & Token Distribution",
    body: [
      "Service Fee: A 10% fee is deducted from token purchases to cover admin, SMS, and bank charges. This is charged to the occupant by default unless the Client chooses to bear it.",
      "Vending: Tokens are purchased via M-PESA Paybill 4130421 using the meter number as the account.",
      "Remittance: UMS Kenya remits net proceeds to the Client or KPLC monthly.",
    ],
  },
  {
    heading: "4. Mutual Obligations",
    body: [
      "Client: Must bill all utility usage through UMS meters and disclose all fees to tenants/occupants.",
      "UMS Kenya: Provides secure meters and real-time usage data. A 2-year warranty is provided, excluding damage from mishandling, power surges, or Acts of God.",
    ],
  },
  {
    heading: "5. Data Protection",
    body:
      "UMS Kenya shall protect and secure all personal data submitted by the Client or Occupants. Data will be handled in compliance with the Data Protection Act of Kenya and used solely for providing the services outlined in this agreement.",
  },
  {
    heading: "6. Termination & Disputes",
    body:
      "Either party may terminate this agreement with thirty (30) days written notice. Disputes will be resolved through negotiation; if unsuccessful, they will be referred to the Energy and Petroleum Regulatory Authority (EPRA). This agreement is governed by Kenyan law.",
  },
];

const benefits = [
  "Activate your manufacturer warranty",
  "Access priority customer support",
  "Receive maintenance reminders",
  "Track your meter's service history"
];

export default function RegisterMeter() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    meterNumbers: [""],
    purchaseDate: "",
    purchaseLocation: "",
    receiptNumber: "",
    extendedWarranty: false,
    notes: "",
    termsAccepted: false,
  });
  const [showTerms, setShowTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addMeterNumber = () => {
    setFormData({ ...formData, meterNumbers: [...formData.meterNumbers, ""] });
  };

  const removeMeterNumber = (index: number) => {
    if (formData.meterNumbers.length > 1) {
      const newMeterNumbers = formData.meterNumbers.filter((_, i) => i !== index);
      setFormData({ ...formData, meterNumbers: newMeterNumbers });
    }
  };

  const updateMeterNumber = (index: number, value: string) => {
    const newMeterNumbers = [...formData.meterNumbers];
    newMeterNumbers[index] = value;
    setFormData({ ...formData, meterNumbers: newMeterNumbers });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validMeterNumbers = formData.meterNumbers.filter(m => m.trim() !== "");
      registerSchema.parse({ ...formData, meterNumbers: validMeterNumbers });
      setLoading(true);
      
      const { error } = await supabase.from("meter_registrations").insert({
        customer_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        meter_numbers: validMeterNumbers,
        purchase_date: formData.purchaseDate || null,
        purchase_location: formData.purchaseLocation || null,
        receipt_number: formData.receiptNumber || null,
        warranty_extended: formData.extendedWarranty,
        notes: formData.notes || null,
        terms_accepted: formData.termsAccepted,
        terms_accepted_at: new Date().toISOString(),
      });

      if (error) throw error;
      
      toast({
        title: "Meter Registered Successfully!",
        description: "Your meter(s) have been registered. You'll receive a confirmation email shortly.",
      });
      
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        meterNumbers: [""],
        purchaseDate: "",
        purchaseLocation: "",
        receiptNumber: "",
        extendedWarranty: false,
        notes: "",
        termsAccepted: false,
      });
    } catch (error) {
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
          description: "Failed to register meter. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero Section */}
        <section className="bg-gradient-hero py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <FadeIn>
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                Register Your Meter
              </h1>
              <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                Activate your warranty and unlock premium support by registering your UMS meter
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {benefits.map((benefit, index) => (
                <FadeIn key={index} delay={index * 0.1}>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>{benefit}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <FadeIn>
                <Card>
                  <CardHeader>
                    <CardTitle>Meter Registration Form</CardTitle>
                    <CardDescription>
                      Fill in all required fields to complete your meter registration. You can register multiple meters at once.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Customer Information */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <User className="h-5 w-5 text-primary" />
                          Customer Information
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                              id="fullName"
                              value={formData.fullName}
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                              placeholder="Your full name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="0700 000 000"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="your@email.com"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Physical Address *</Label>
                          <Textarea
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Your full physical address"
                            rows={2}
                            required
                          />
                        </div>
                      </div>

                      {/* Meter Numbers */}
                      <div className="space-y-4 border-t pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-lg font-semibold">
                            <Gauge className="h-5 w-5 text-primary" />
                            UMS Meter Numbers
                          </div>
                          <Button type="button" variant="outline" size="sm" onClick={addMeterNumber}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Meter
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Enter all UMS meter numbers you want to register
                        </p>
                        <div className="space-y-3">
                          {formData.meterNumbers.map((meterNumber, index) => (
                            <div key={index} className="flex gap-2">
                              <div className="flex-1 space-y-1">
                                <Label className="text-xs text-muted-foreground">
                                  Meter #{index + 1}
                                </Label>
                                <Input
                                  value={meterNumber}
                                  onChange={(e) => updateMeterNumber(index, e.target.value)}
                                  placeholder="Enter meter serial number"
                                  required={index === 0}
                                />
                              </div>
                              {formData.meterNumbers.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="mt-5"
                                  onClick={() => removeMeterNumber(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Purchase Information */}
                      <div className="space-y-4 border-t pt-6">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <ShoppingBag className="h-5 w-5 text-primary" />
                          Purchase Information (Optional)
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="purchaseDate">Purchase Date</Label>
                            <Input
                              id="purchaseDate"
                              type="date"
                              value={formData.purchaseDate}
                              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="receiptNumber">Receipt Number</Label>
                            <Input
                              id="receiptNumber"
                              value={formData.receiptNumber}
                              onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                              placeholder="Receipt or invoice number"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="purchaseLocation">Where did you purchase?</Label>
                          <Select 
                            value={formData.purchaseLocation} 
                            onValueChange={(value) => setFormData({ ...formData, purchaseLocation: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select purchase location" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ums-shop">UMS Kenya Shop</SelectItem>
                              <SelectItem value="ums-online">UMS Kenya Online Store</SelectItem>
                              <SelectItem value="hardware">Hardware / Distributor</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notes">Additional Notes</Label>
                          <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Any additional information about your purchase or installation"
                            rows={2}
                          />
                        </div>
                      </div>

                      {/* Warranty */}
                      <div className="space-y-4 border-t pt-6">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <Shield className="h-5 w-5 text-primary" />
                          Warranty Registration
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Your standard 2-year warranty will be automatically activated upon registration.
                        </p>
                        
                      </div>

                      {/* Terms and Conditions */}
                      <div className="space-y-4 border-t pt-6">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <FileText className="h-5 w-5 text-primary" />
                          Terms and Conditions *
                        </div>
                        
                        <div className="border rounded-lg">
                          <button
                            type="button"
                            onClick={() => setShowTerms(!showTerms)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                          >
                            <span className="font-medium">View Terms and Conditions</span>
                            {showTerms ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                          </button>
                          
                          {showTerms && (
                            <div className="border-t">
                              <ScrollArea className="h-64 p-4">
                                <div className="space-y-4">
                                  <p className="text-sm font-medium">
                                    These terms and conditions ("Terms") outline the agreement between UMS and the property owner or occupant ("Customer") for the installation of submeters.
                                  </p>
                                  <ol className="list-decimal pl-5 space-y-3 text-sm text-muted-foreground">
                                    {termsAndConditions.map((term, index) => (
                                      <li key={index}>{term}</li>
                                    ))}
                                  </ol>
                                </div>
                              </ScrollArea>
                            </div>
                          )}
                        </div>

                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="termsAccepted"
                            checked={formData.termsAccepted}
                            onCheckedChange={(checked) => 
                              setFormData({ ...formData, termsAccepted: checked as boolean })
                            }
                            className="mt-0.5"
                          />
                          <Label htmlFor="termsAccepted" className="text-sm cursor-pointer leading-relaxed">
                            I have read and agree to the <button type="button" onClick={() => setShowTerms(true)} className="text-primary underline hover:text-primary/80">Terms and Conditions</button> for UMS meter registration and installation
                          </Label>
                        </div>
                      </div>

                      <Button type="submit" className="w-full" size="lg" disabled={loading}>
                        {loading ? (
                          "Submitting..."
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Register {formData.meterNumbers.filter(m => m.trim()).length > 1 ? `${formData.meterNumbers.filter(m => m.trim()).length} Meters` : "My Meter"}
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </AnimatedPage>
  );
}
