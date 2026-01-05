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

const termsAndConditions = [
  "This is a secondary meter and not a replacement for the main utility meter hence must be supplied from the main meter.",
  "The customer shall engage a qualified licensed technician to install the UMS meters and is fully responsible for the installation of these meters. A list of licensed electricians can be found on the EPRA website on www.epra.go.ke",
  "UMS provides a two-year (2-yr) warranty on all meters effective from the date of installation. During this period, the Customer must report any meter malfunctions promptly to UMS for troubleshooting or free replacement. However, if a fault is determined to be caused by customer mishandling or tampering, the Customer shall assume full responsibility for all associated repair or replacement costs.",
  "For KPLC postpaid accounts, the Customer shall share a digital photo of the current meter readings to ensure the accurate capture of the mother meter's consumption data. Additionally, the Customer agrees to provide a clear digital photo of the installed meters to UMS prior to the commissioning of the system.",
  "The customer is responsible for any unbilled units registered by the main meter which could arise from connecting directly from main meter bypassing the sub meters.",
  "Tokens shall be charged at the prevailing tariff approved by EPRA, check www.stimatracker.com",
  "UMS shall charge a service fee of 10% for token generation and administration on the total tokens unless advised otherwise by the landlord it shall be deducted to customers as meter vends.",
  "Depending on the agreement with the Landlord for the postpaid account, UMS shall ensure all funds received are paid to the utility provider twice monthly, specifically on the 15th and the last day of every month. Evidence of these payments shall be shared with the Landlord following each transaction.",
  "For the prepaid account, the Landlord shall provide a one-time initial deposit of KSh 1,500 into their KPLC account to ensure uninterrupted utility service. Thereafter, UMS shall monitor the account and remit collected funds to purchase subsequent tokens once the collected balance reaches a minimum threshold of KSh 1,000. All purchased tokens will be delivered via SMS to the Landlord's registered phone number or their authorized representatives.",
  "UMS is not liable for any loss, damage, or inconvenience caused by factors beyond its control, including but not limited to natural disasters, power outages/surge, or M-pesa outage.",
  "Upon meter registration, UMS shall provide the Landlord with access to a dedicated customer portal via https://customer.umskenya.com. Through this portal, the Landlord may view and download all transaction records, including daily, weekly, and monthly statements. Additionally, UMS shall deliver a monthly summary statement via SMS to the Landlord's registered phone number.",
  "UMS offer metering solution and hence is not a utility provider.",
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
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="extendedWarranty"
                            checked={formData.extendedWarranty}
                            onCheckedChange={(checked) => 
                              setFormData({ ...formData, extendedWarranty: checked as boolean })
                            }
                          />
                          <Label htmlFor="extendedWarranty" className="text-sm cursor-pointer">
                            I'm interested in extended warranty options (our team will contact you)
                          </Label>
                        </div>
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
