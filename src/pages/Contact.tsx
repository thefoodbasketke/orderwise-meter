import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { z } from "zod";
import { FadeIn, SlideIn, StaggerContainer, GridItem, SectionHeading } from "@/components/AnimatedPage";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(10, "Phone number required").max(15),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});

const contactInfo = [
  { icon: Phone, label: "WhatsApp/Call/SMS", value: "0700 444 448", href: "tel:0700444448" },
  { icon: Phone, label: "Calls Only", value: "0709 155 585", href: "tel:0709155585" },
  { icon: Mail, label: "Email", value: "inquiries@umskenya.com", href: "mailto:inquiries@umskenya.com" },
  { icon: MapPin, label: "Address", value: "Capital One Plaza, Eastern Bypass, Off Thika Road", href: null },
  { icon: Clock, label: "Hours", value: "Mon - Fri: 8:00 AM - 5:00 PM", href: null },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      contactSchema.parse(formData);
      setLoading(true);
      
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setShowSuccessOverlay(true);
      
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      
      // Reset success state after animation
      setTimeout(() => {
        setSuccess(false);
        setShowSuccessOverlay(false);
      }, 4000);
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

  const SuccessOverlay = () => (
    <AnimatePresence>
      {showSuccessOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-card border border-border rounded-2xl p-8 shadow-2xl max-w-md mx-4 text-center relative overflow-hidden"
          >
            {/* Sparkle decorations */}
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute top-4 right-4"
            >
              <Sparkles className="h-6 w-6 text-primary/40" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-4 left-4"
            >
              <Sparkles className="h-5 w-5 text-primary/30" />
            </motion.div>

            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
              className="mx-auto mb-6 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.2 }}
              >
                <CheckCircle2 className="h-12 w-12 text-primary" />
              </motion.div>
            </motion.div>

            {/* Success text */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-foreground mb-2"
            >
              Message Sent!
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground mb-6"
            >
              Thank you for reaching out. Our team will get back to you within 24 hours.
            </motion.p>

            {/* Progress bar */}
            <motion.div
              className="h-1 bg-muted rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3.5, ease: "linear", delay: 0.5 }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <SuccessOverlay />
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
              Contact Us
            </motion.h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Have any pressing issues? Get in touch with our team
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <SlideIn direction="left">
              <div>
                <SectionHeading>Get In Touch</SectionHeading>
                <FadeIn delay={0.1}>
                  <p className="text-muted-foreground mb-8">
                    We're here to help with all your metering needs. Reach out to us 
                    through any of the following channels.
                  </p>
                </FadeIn>
                
                <StaggerContainer className="space-y-4" staggerDelay={0.1}>
                  {contactInfo.map((item, index) => (
                    <GridItem key={index} index={index}>
                      <motion.div
                        whileHover={{ x: 8, transition: { duration: 0.2 } }}
                      >
                        <Card className="hover:shadow-hover transition-shadow">
                          <CardContent className="flex items-center gap-4 p-4">
                            <motion.div 
                              className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <item.icon className="h-6 w-6 text-primary" />
                            </motion.div>
                            <div>
                              <p className="text-sm text-muted-foreground">{item.label}</p>
                              {item.href ? (
                                <a href={item.href} className="font-medium hover:text-primary transition-colors">
                                  {item.value}
                                </a>
                              ) : (
                                <p className="font-medium">{item.value}</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </GridItem>
                  ))}
                </StaggerContainer>
                
                {/* Map */}
<FadeIn delay={0.5}>
  <motion.div 
    className="mt-8 rounded-xl overflow-hidden border"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
  >
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8176!2d36.9!3d-1.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTInMDAuMCJTIDM2wrA1NCcwMC4wIkU!5e0!3m2!1sen!2ske!4v1234567890"
      width="100%"
      height="250"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="UMS Kenya Location"
    ></iframe>
  </motion.div>
</FadeIn>

              </div>
            </SlideIn>

            {/* Contact Form */}
            <SlideIn direction="right">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="hover:shadow-hover transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-6">Send us a Message</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <motion.div 
                          className="space-y-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Your name"
                            required
                            className="transition-all focus:scale-[1.02]"
                          />
                        </motion.div>
                        <motion.div 
                          className="space-y-2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.45 }}
                        >
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="your@email.com"
                            required
                            className="transition-all focus:scale-[1.02]"
                          />
                        </motion.div>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <motion.div 
                          className="space-y-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Label htmlFor="phone">Phone *</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="0700 000 000"
                            required
                            className="transition-all focus:scale-[1.02]"
                          />
                        </motion.div>
                        <motion.div 
                          className="space-y-2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.55 }}
                        >
                          <Label htmlFor="subject">Subject *</Label>
                          <Input
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="How can we help?"
                            required
                            className="transition-all focus:scale-[1.02]"
                          />
                        </motion.div>
                      </div>
                      
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell us more about your inquiry..."
                          rows={5}
                          required
                          className="transition-all focus:scale-[1.01]"
                        />
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65 }}
                      >
                        <AnimatedButton 
                          type="submit" 
                          className="w-full" 
                          isLoading={loading}
                          isSuccess={success}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </AnimatedButton>
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </SlideIn>
          </div>
        </div>
      </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
