import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShoppingBag, 
  MessageSquare, 
  Truck, 
  Shield, 
  Zap, 
  Droplets, 
  Flame,
  Phone,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import umsLogo from "@/assets/ums-logo.png";

const meterCategories = [
  {
    icon: Zap,
    title: "Prepaid Electricity Meters",
    description: "Smart prepaid meters for residential and commercial electricity management",
    color: "bg-yellow-500/10 text-yellow-600",
  },
  {
    icon: Droplets,
    title: "Smart Water Meters",
    description: "Accurate water metering solutions for efficient consumption tracking",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Flame,
    title: "Smart Gas Meters",
    description: "Reliable gas meters with prepaid functionality and safety features",
    color: "bg-orange-500/10 text-orange-600",
  },
];

const features = [
  "Quality certified products",
  "Professional installation support",
  "24/7 customer service",
  "Warranty on all meters",
  "Bulk order discounts",
  "Fast delivery nationwide",
];

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
        
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-primary-foreground/90 text-sm font-medium">
                  Kenya's Trusted Meter Supplier
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                Utility Metering Solutions
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/85 mb-8 max-w-xl">
                Premium prepaid electricity, water, and gas meters with flexible pricing, 
                secure M-Pesa payments, and nationwide delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button size="lg" variant="secondary" className="shadow-lg group">
                    Browse Products
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                {!user && (
                  <Link to="/auth">
                    <Button size="lg" variant="outline" className="bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20">
                      Create Account
                    </Button>
                  </Link>
                )}
              </div>
              
              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-primary-foreground/80">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm">Quality Certified</span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/80">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm">M-Pesa Payments</span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/80">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm">Nationwide Delivery</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-2xl"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
                  <img src={umsLogo} alt="UMS Prepaid" className="w-48 mx-auto mb-4" />
                  <p className="text-center text-muted-foreground text-sm">
                    Your trusted partner in utility metering
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Meter Solutions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer a comprehensive range of smart metering solutions for all your utility needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {meterCategories.map((category, index) => (
              <Card key={index} className="group hover:shadow-hover transition-all duration-300 border-2 hover:border-primary/20">
                <CardContent className="p-8">
                  <div className={`h-16 w-16 rounded-2xl ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <category.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{category.title}</h3>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <Link to="/products" className="text-primary font-medium inline-flex items-center group-hover:gap-2 transition-all">
                    View Products <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose UMS Prepaid?</h2>
              <p className="text-muted-foreground mb-8">
                With years of experience in utility metering solutions, we provide quality products 
                and exceptional service to customers across Kenya.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/products" className="inline-block mt-8">
                <Button size="lg">
                  Explore Our Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="p-6 text-center shadow-card hover:shadow-hover transition-shadow">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">Easy Ordering</h3>
                  <p className="text-xs text-muted-foreground">Simple online ordering process</p>
                </Card>
                <Card className="p-6 text-center shadow-card hover:shadow-hover transition-shadow">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">M-Pesa Payment</h3>
                  <p className="text-xs text-muted-foreground">Secure STK Push payments</p>
                </Card>
              </div>
              <div className="space-y-6 pt-8">
                <Card className="p-6 text-center shadow-card hover:shadow-hover transition-shadow">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-1">Price Negotiation</h3>
                  <p className="text-xs text-muted-foreground">Get the best deals</p>
                </Card>
                <Card className="p-6 text-center shadow-card hover:shadow-hover transition-shadow">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                    <Truck className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-1">Fast Delivery</h3>
                  <p className="text-xs text-muted-foreground">Nationwide shipping</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Browse our collection of quality utility meters and place your order today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" variant="secondary" className="shadow-lg">
                View All Products
              </Button>
            </Link>
            <a href="tel:0709155585">
              <Button size="lg" variant="outline" className="bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20">
                <Phone className="mr-2 h-4 w-4" />
                Call Us: 0709 155585
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <img src={umsLogo} alt="UMS Prepaid" className="h-12 mb-4 brightness-0 invert" />
              <p className="text-background/70 text-sm">
                Your trusted partner for quality utility metering solutions in Kenya.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link to="/products" className="hover:text-background transition-colors">Products</Link></li>
                <li><Link to="/auth" className="hover:text-background transition-colors">Sign In</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li>Prepaid Electricity Meters</li>
                <li>Smart Water Meters</li>
                <li>Smart Gas Meters</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm text-background/70">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href="tel:0709155585" className="hover:text-background transition-colors">0709 155585</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:info@umskenya.com" className="hover:text-background transition-colors">info@umskenya.com</a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>Capital One Plaza, Eastern Bypass Kamakis Rd, Nairobi, Kenya</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-background/10 mt-10 pt-8 text-center text-sm text-background/50">
            <p>&copy; {new Date().getFullYear()} UMS Prepaid. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
