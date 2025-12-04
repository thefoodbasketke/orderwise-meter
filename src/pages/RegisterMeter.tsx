import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  MapPin, 
  Gauge,
  ShoppingBag,
  Shield,
  Send,
  CheckCircle2
} from "lucide-react";
import { z } from "zod";

const registerSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100),
  phone: z.string().trim().min(10, "Valid phone number required").max(15),
  email: z.string().trim().email("Invalid email").max(255),
  address: z.string().trim().min(5, "Address is required").max(300),
  estateBuilding: z.string().trim().max(200),
  meterType: z.string().min(1, "Select meter type"),
  brand: z.string().trim().min(1, "Brand is required").max(100),
  serialNumber: z.string().trim().min(5, "Serial number required").max(50),
  installationDate: z.string().min(1, "Installation date required"),
  installerName: z.string().trim().max(100),
  purchaseLocation: z.string().min(1, "Select purchase location"),
  extendedWarranty: z.boolean(),
});

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
    estateBuilding: "",
    meterType: "",
    brand: "",
    serialNumber: "",
    installationDate: "",
    installerName: "",
    purchaseLocation: "",
    extendedWarranty: false,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      registerSchema.parse(formData);
      setLoading(true);
      
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Meter Registered Successfully!",
        description: "Your meter has been registered. You'll receive a confirmation email shortly.",
      });
      
      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        estateBuilding: "",
        meterType: "",
        brand: "",
        serialNumber: "",
        installationDate: "",
        installerName: "",
        purchaseLocation: "",
        extendedWarranty: false,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.errors[0].message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Register Your Meter
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Activate your warranty and unlock premium support by registering your UMS meter
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Meter Registration Form</CardTitle>
                <CardDescription>
                  Fill in all required fields to complete your meter registration
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
                      <div className="space-y-2">
                        <Label htmlFor="estateBuilding">Estate / Building / Plot</Label>
                        <Input
                          id="estateBuilding"
                          value={formData.estateBuilding}
                          onChange={(e) => setFormData({ ...formData, estateBuilding: e.target.value })}
                          placeholder="Building name or plot number"
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

                  {/* Meter Details */}
                  <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <Gauge className="h-5 w-5 text-primary" />
                      Meter Details
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="meterType">Meter Type *</Label>
                        <Select 
                          value={formData.meterType} 
                          onValueChange={(value) => setFormData({ ...formData, meterType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select meter type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electricity">Electricity Meter</SelectItem>
                            <SelectItem value="water">Water Meter</SelectItem>
                            <SelectItem value="gas">Gas Meter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="brand">Brand / Model *</Label>
                        <Input
                          id="brand"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          placeholder="e.g., UMS Pro 2000"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="serialNumber">Meter Serial Number *</Label>
                        <Input
                          id="serialNumber"
                          value={formData.serialNumber}
                          onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                          placeholder="Found on the meter front"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="installationDate">Installation Date *</Label>
                        <Input
                          id="installationDate"
                          type="date"
                          value={formData.installationDate}
                          onChange={(e) => setFormData({ ...formData, installationDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="installerName">Installer Name (if known)</Label>
                      <Input
                        id="installerName"
                        value={formData.installerName}
                        onChange={(e) => setFormData({ ...formData, installerName: e.target.value })}
                        placeholder="Name of the person who installed the meter"
                      />
                    </div>
                  </div>

                  {/* Purchase Information */}
                  <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      Purchase Information
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="purchaseLocation">Where did you purchase the meter? *</Label>
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
                  </div>

                  {/* Warranty */}
                  <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <Shield className="h-5 w-5 text-primary" />
                      Warranty Registration
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your standard 1-year warranty will be automatically activated upon registration.
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

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Register My Meter
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
