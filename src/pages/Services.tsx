import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Wrench, 
  HeadphonesIcon, 
  Settings, 
  ClipboardCheck, 
  Gauge,
  ArrowRight,
  Phone,
  CheckCircle2,
  Zap,
  Droplets,
  Flame,
  Shield,
  Cpu
} from "lucide-react";
import { FadeIn, SlideIn, StaggerContainer, GridItem, SectionHeading, CardHover } from "@/components/AnimatedPage";

interface Service {
  id: string;
  title: string;
  description: string | null;
  icon_name: string | null;
  features: string[] | null;
  is_active: boolean;
}

const defaultServices = [
  {
    icon: Wrench,
    title: "Submetering Services",
    description: "Complete submetering solutions for properties and estates. We handle everything from assessment to installation.",
    features: [
      "Property assessment & planning",
      "Professional meter installation",
      "System configuration & setup",
      "Tenant onboarding support"
    ]
  },
  {
    icon: Cpu,
    title: "Smart Metering Solutions",
    description: "Intelligent metering systems with real-time monitoring and advanced analytics for efficient utility management.",
    features: [
      "Real-time consumption tracking",
      "Mobile app integration",
      "Automated alerts & notifications",
      "Usage analytics dashboard"
    ]
  },
  {
    icon: Shield,
    title: "Secure Bill Collection",
    description: "Reliable and secure utility bill collection services with M-Pesa integration for seamless payments.",
    features: [
      "M-Pesa STK Push payments",
      "Automated token delivery",
      "Revenue reconciliation",
      "Transparent reporting"
    ]
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Customer Support",
    description: "Round-the-clock technical assistance for all your meter-related queries and issues.",
    features: [
      "24/7 helpline availability",
      "Remote troubleshooting",
      "Quick response time",
      "Expert technical guidance"
    ]
  },
  {
    icon: Settings,
    title: "Maintenance Services",
    description: "Regular maintenance and servicing to ensure your meters function optimally.",
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
    features: [
      "System design",
      "Capacity assessment",
      "Cost optimization",
      "Compliance guidance"
    ]
  }
];

const iconMap: Record<string, any> = {
  Wrench, HeadphonesIcon, Settings, ClipboardCheck, Gauge, Zap, Droplets, Flame, Shield, Cpu
};

const processSteps = [
  { step: "01", title: "Contact Us", description: "Reach out via phone, email, or request form" },
  { step: "02", title: "Site Assessment", description: "Our team evaluates your requirements" },
  { step: "03", title: "Custom Quote", description: "Receive a tailored proposal and pricing" },
  { step: "04", title: "Implementation", description: "Professional installation and setup" },
  { step: "05", title: "Support", description: "Ongoing maintenance and technical support" },
];

export default function Services() {
  const [dbServices, setDbServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await supabase.from("services").select("*").order("sort_order");
        if (data) setDbServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const services = dbServices.length > 0 
    ? dbServices.map(s => ({
        icon: iconMap[s.icon_name || ""] || Wrench,
        title: s.title,
        description: s.description || "",
        features: s.features || []
      }))
    : defaultServices;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Services
            </motion.h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Comprehensive metering solutions from installation to maintenance
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <GridItem key={index} index={index}>
                <CardHover>
                  <Card className="border-2 hover:border-primary/20 flex flex-col h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <motion.div 
                          className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <service.icon className="h-7 w-7 text-primary" />
                        </motion.div>
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-muted-foreground mb-4">{service.description}</p>
                      <ul className="space-y-2 flex-1">
                        {service.features.map((feature, idx) => (
                          <motion.li 
                            key={idx} 
                            className="flex items-center gap-2 text-sm"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                          >
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            </motion.div>
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                      <Link to="/quotation" className="mt-4">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button variant="outline" className="w-full group">
                            Get Quote
                            <motion.span
                              className="ml-2"
                              initial={{ x: 0 }}
                              whileHover={{ x: 3 }}
                            >
                              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.span>
                          </Button>
                        </motion.div>
                      </Link>
                    </CardContent>
                  </Card>
                </CardHover>
              </GridItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <SectionHeading className="justify-center">How It Works</SectionHeading>
            <FadeIn delay={0.1}>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Our streamlined process ensures a smooth experience from inquiry to implementation
              </p>
            </FadeIn>
          </div>
          <div className="grid md:grid-cols-5 gap-6">
            {processSteps.map((item, index) => (
              <motion.div 
                key={index} 
                className="text-center relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold"
                  whileHover={{ scale: 1.1, boxShadow: "0 0 20px hsl(var(--primary) / 0.4)" }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {item.step}
                </motion.div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {index < processSteps.length - 1 && (
                  <motion.div 
                    className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
                    viewport={{ once: true }}
                    style={{ originX: 0 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <SlideIn direction="up">
            <h2 className="text-3xl font-bold mb-4">Need Our Services?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Contact us today to discuss your metering needs and get a custom quote
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/quotation">
                  <Button size="lg" className="group">
                    Request a Quote
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a href="tel:0700444448">
                  <Button size="lg" variant="outline" className="group">
                    <Phone className="mr-2 h-4 w-4" />
                    Call: 0700 444 448
                  </Button>
                </a>
              </motion.div>
            </div>
          </SlideIn>
        </div>
      </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
