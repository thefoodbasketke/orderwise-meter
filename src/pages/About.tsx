import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { 
  Target, 
  Eye, 
  Heart, 
  Award, 
  Users, 
  CheckCircle2,
  Building2
} from "lucide-react";

const values = [
  { icon: Award, title: "Quality", description: "We provide only certified, high-quality metering solutions" },
  { icon: Heart, title: "Integrity", description: "Honest business practices and transparent pricing" },
  { icon: Users, title: "Customer Focus", description: "Your satisfaction is our top priority" },
  { icon: Target, title: "Innovation", description: "Embracing smart technology for better solutions" },
];

const certifications = [
  "ISO 9001:2015 Quality Management",
  "Kenya Bureau of Standards (KEBS) Certified",
  "Energy Regulatory Commission Approved",
  "Water Services Regulatory Board Compliant",
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            About UMS Kenya
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Kenya's trusted partner in utility metering solutions since establishment
          </p>
        </div>
      </section>

      {/* Company Background */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                UMS Kenya is a leading provider of utility metering solutions, specializing in prepaid 
                electricity, water, and gas meters. Based in Nairobi, we serve customers across Kenya 
                with quality products and exceptional service.
              </p>
              <p className="text-muted-foreground mb-4">
                Our journey began with a simple mission: to make utility management more efficient and 
                accessible for both landlords and tenants. Today, we have grown to become one of the 
                most trusted names in the metering industry.
              </p>
              <p className="text-muted-foreground">
                We work directly with manufacturers to ensure our products meet the highest quality 
                standards while remaining affordable for our customers.
              </p>
            </div>
            <div className="bg-muted/30 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <Building2 className="h-12 w-12 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">Our Location</h3>
                  <p className="text-muted-foreground">Capital One Plaza, Eastern Bypass Off Thika Road</p>
                </div>
              </div>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To provide innovative and reliable utility metering solutions that empower property 
                  owners and tenants to efficiently manage their utility consumption while ensuring 
                  fair billing and transparent transactions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-accent/20">
              <CardContent className="p-8">
                <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                  <Eye className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To be the leading provider of smart metering solutions in East Africa, setting the 
                  standard for quality, innovation, and customer service in the utility metering industry.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These values guide everything we do at UMS Kenya
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-hover transition-shadow">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
