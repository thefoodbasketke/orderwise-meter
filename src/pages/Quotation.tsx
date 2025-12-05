import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  Phone
} from "lucide-react";

const meterTypes = [
  { value: "electricity", label: "Prepaid Electricity Meters" },
  { value: "water", label: "Smart Water Meters" },
  { value: "gas", label: "Smart Gas Meters" },
  { value: "mixed", label: "Mixed / Multiple Types" },
];

const projectTypes = [
  { value: "residential", label: "Residential Estate" },
  { value: "commercial", label: "Commercial Building" },
  { value: "industrial", label: "Industrial Facility" },
  { value: "municipal", label: "Municipal / Government" },
  { value: "other", label: "Other" },
];

const quantities = [
  { value: "1-10", label: "1 - 10 units" },
  { value: "11-50", label: "11 - 50 units" },
  { value: "51-100", label: "51 - 100 units" },
  { value: "101-500", label: "101 - 500 units" },
  { value: "500+", label: "500+ units" },
];

const steps = [
  { icon: FileText, title: "Submit Request", description: "Fill out the quotation form with your requirements" },
  { icon: Clock, title: "Review", description: "Our team reviews your requirements within 24 hours" },
  { icon: MessageSquare, title: "Custom Quote", description: "Receive a detailed quotation tailored to your needs" },
  { icon: CheckCircle2, title: "Proceed", description: "Accept the quote and we'll get started" },
];

export default function Quotation() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [includeInstallation, setIncludeInstallation] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    projectType: "",
    meterType: "",
    quantity: "",
    location: "",
    projectDescription: "",
    timeline: "",
    additionalServices: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Quotation Request Submitted",
      description: "We'll review your requirements and get back to you within 24 hours.",
    });

    setFormData({
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      projectType: "",
      meterType: "",
      quantity: "",
      location: "",
      projectDescription: "",
      timeline: "",
      additionalServices: "",
    });
    setIncludeInstallation(false);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Request a Quotation
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Get a customized quote for your metering project
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1 text-sm">{step.title}</h3>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quotation Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Project Details</CardTitle>
                <p className="text-muted-foreground">
                  Please provide as much detail as possible to help us prepare an accurate quote
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Contact Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company / Organization Name</Label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          placeholder="Your company name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactName">Contact Person *</Label>
                        <Input
                          id="contactName"
                          required
                          value={formData.contactName}
                          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                          placeholder="Full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="07XX XXX XXX"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Project Requirements */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Project Requirements</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="projectType">Project Type *</Label>
                        <Select 
                          value={formData.projectType} 
                          onValueChange={(value) => setFormData({ ...formData, projectType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                          <SelectContent>
                            {projectTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
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
                            {meterTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Estimated Quantity *</Label>
                        <Select 
                          value={formData.quantity} 
                          onValueChange={(value) => setFormData({ ...formData, quantity: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select quantity range" />
                          </SelectTrigger>
                          <SelectContent>
                            {quantities.map((qty) => (
                              <SelectItem key={qty.value} value={qty.value}>
                                {qty.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Project Location *</Label>
                        <Input
                          id="location"
                          required
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="County / Town"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectDescription">Project Description *</Label>
                      <Textarea
                        id="projectDescription"
                        required
                        rows={4}
                        value={formData.projectDescription}
                        onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                        placeholder="Describe your project requirements, specific features needed, existing infrastructure, etc."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeline">Expected Timeline</Label>
                      <Input
                        id="timeline"
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        placeholder="e.g., Within 2 months, Q1 2025"
                      />
                    </div>
                  </div>

                  {/* Additional Services */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Additional Services</h3>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="installation" 
                        checked={includeInstallation}
                        onCheckedChange={(checked) => setIncludeInstallation(checked as boolean)}
                      />
                      <Label htmlFor="installation" className="cursor-pointer">
                        Include installation services in quote
                      </Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="additionalServices">Other Requirements</Label>
                      <Textarea
                        id="additionalServices"
                        rows={3}
                        value={formData.additionalServices}
                        onChange={(e) => setFormData({ ...formData, additionalServices: e.target.value })}
                        placeholder="Training, maintenance contracts, extended warranty, etc."
                      />
                    </div>
                  </div>

                  {/* File Upload (Visual only) */}
                  <div className="space-y-2">
                    <Label>Upload Documents (Optional)</Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Drop files here or click to upload
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Purchase orders, specifications, drawings (PDF, DOC, XLS - Max 10MB)
                      </p>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Quotation Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-2">Need immediate assistance?</p>
              <a href="tel:0700444448" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
                <Phone className="h-4 w-4" />
                Call: 0700 444 448
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
