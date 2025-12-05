import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Home, 
  Factory, 
  Users, 
  CheckCircle2,
  ArrowRight,
  MapPin,
  Zap,
  Droplets
} from "lucide-react";

const stats = [
  { value: "500+", label: "Projects Completed" },
  { value: "10,000+", label: "Meters Installed" },
  { value: "47", label: "Counties Served" },
  { value: "99%", label: "Client Satisfaction" },
];

const projects = [
  {
    title: "Greenfield Estate",
    location: "Kiambu County",
    type: "Residential",
    meters: 250,
    meterType: "Electricity",
    description: "Complete prepaid electricity metering solution for 250-unit residential estate with central management system.",
    icon: Home,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
  },
  {
    title: "Mombasa Industrial Park",
    location: "Mombasa County",
    type: "Industrial",
    meters: 45,
    meterType: "Electricity & Water",
    description: "Industrial-grade smart metering for manufacturing facilities with real-time monitoring.",
    icon: Factory,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600",
  },
  {
    title: "Sunrise Apartments",
    location: "Nairobi County",
    type: "Commercial",
    meters: 180,
    meterType: "Water",
    description: "Water sub-metering solution enabling fair billing and leak detection for apartment complex.",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600",
  },
  {
    title: "Nakuru Town Council",
    location: "Nakuru County",
    type: "Municipal",
    meters: 1200,
    meterType: "Water",
    description: "Large-scale municipal water metering project for improved revenue collection.",
    icon: Users,
    image: "https://images.unsplash.com/photo-1464938050520-ef2571a2b3e7?w=600",
  },
  {
    title: "Safari Gardens",
    location: "Kisumu County",
    type: "Residential",
    meters: 120,
    meterType: "Electricity",
    description: "Gated community prepaid electricity solution with mobile app integration.",
    icon: Home,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600",
  },
  {
    title: "CBD Commercial Complex",
    location: "Nairobi County",
    type: "Commercial",
    meters: 75,
    meterType: "Electricity & Water",
    description: "Multi-tenant commercial building with integrated utility management platform.",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600",
  },
];

const clients = [
  "Kenya Power", "Nairobi Water", "County Governments", "Real Estate Developers",
  "Property Management Firms", "Industrial Parks", "Shopping Malls", "Hotels"
];

export default function Projects() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Our Projects
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Delivering smart metering solutions across Kenya
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Case Studies</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore how we've helped organizations across various sectors implement efficient metering solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-hover transition-all duration-300 group">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-background/90">
                      {project.type}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <project.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{project.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {project.location}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {project.meterType.includes("Electricity") && (
                        <Badge variant="outline" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          Electricity
                        </Badge>
                      )}
                      {project.meterType.includes("Water") && (
                        <Badge variant="outline" className="text-xs">
                          <Droplets className="h-3 w-3 mr-1" />
                          Water
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-medium text-primary">{project.meters} meters</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">Trusted By</h2>
            <p className="text-muted-foreground">Leading organizations across Kenya</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {clients.map((client, index) => (
              <div 
                key={index} 
                className="px-6 py-3 bg-background rounded-full border text-sm font-medium text-muted-foreground"
              >
                {client}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Project</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Ready to implement smart metering for your property? Let's discuss your requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quotation">
              <Button size="lg">
                Request a Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
