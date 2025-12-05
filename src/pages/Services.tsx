import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench, 
  HeadphonesIcon, 
  Settings, 
  ClipboardCheck, 
  Gauge,
  ArrowRight,
  Phone,
  CheckCircle2
} from "lucide-react";

const services = [
  {
    icon: Wrench,
    title: "Meter Installation",
    description: "Professional installation of prepaid electricity, water, and gas meters by certified technicians.",
    price: "From KSh 2,500",
    features: [
      "Certified installation team",
      "Same-day service available",
      "Post-installation support",
      "Warranty coverage"
    ]
  },
  {
    icon: HeadphonesIcon,
    title: "Technical Support",
    description: "24/7 technical assistance for all your meter-related queries and issues.",
    price: "Free with purchase",
    features: [
      "Round-the-clock support",
      "Remote troubleshooting",
      "Expert guidance",
      "Quick response time"
    ]
  },
  {
    icon: Settings,
    title: "Maintenance Services",
    description: "Regular maintenance and servicing to ensure your meters function optimally.",
    price: "From KSh 1,500",
    features: [
      "Scheduled maintenance",
      "Performance optimization",
      "Component replacement",
      "System updates"
    ]
  },
  {
    icon: ClipboardCheck,
    title: "Engineering Consultations",
    description: "Expert advice on metering systems, capacity planning, and utility management.",
    price: "From KSh 5,000",
    features: [
      "System design",
      "Capacity assessment",
      "Cost optimization",
      "Compliance guidance"
    ]
  },
  {
    icon: Gauge,
    title: "Calibration Services",
    description: "Precision calibration to ensure accurate readings and fair billing.",
    price: "From KSh 3,000",
    features: [
      "KEBS-certified calibration",
      "Accuracy verification",
      "Documentation provided",
      "Regular recalibration"
    ]
  }
];

const processSteps = [
  { step: "01", title: "Contact Us", description: "Reach out via phone, email, or request form" },
  { step: "02", title: "Site Assessment", description: "Our team evaluates your requirements" },
  { step: "03", title: "Custom Quote", description: "Receive a tailored proposal and pricing" },
  { step: "04", title: "Implementation", description: "Professional installation and setup" },
  { step: "05", title: "Support", description: "Ongoing maintenance and technical support" },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Our Services
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Comprehensive metering solutions from installation to maintenance
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-hover transition-all duration-300 border-2 hover:border-primary/20 flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <service.icon className="h-7 w-7 text-primary" />
                    </div>
                    <Badge variant="secondary" className="font-semibold">
                      {service.price}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2 flex-1">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/quotation" className="mt-4">
                    <Button variant="outline" className="w-full">
                      Get Quote
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our streamlined process ensures a smooth experience from inquiry to implementation
            </p>
          </div>
          <div className="grid md:grid-cols-5 gap-6">
            {processSteps.map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Our Services?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Contact us today to discuss your metering needs and get a custom quote
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quotation">
              <Button size="lg">
                Request a Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="tel:0700444448">
              <Button size="lg" variant="outline">
                <Phone className="mr-2 h-4 w-4" />
                Call: 0700 444 448
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
