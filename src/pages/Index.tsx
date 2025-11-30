import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ShoppingBag, MessageSquare, Truck, Shield } from "lucide-react";

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <div className="container relative mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Professional UMS Meters
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
            Quality utility meters with flexible pricing, secure M-Pesa payments, and reliable delivery tracking
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            <Link to="/products">
              <Button size="lg" variant="secondary" className="shadow-lg">
                Browse Products
              </Button>
            </Link>
            {!user && (
              <Link to="/auth">
                <Button size="lg" variant="outline" className="bg-background/10 text-primary-foreground border-primary-foreground/20 hover:bg-background/20">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose UMS Meters?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-card shadow-card hover:shadow-hover transition-all duration-300">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Easy Ordering</h3>
              <p className="text-sm text-muted-foreground">
                Browse products and place orders with just a few clicks
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card shadow-card hover:shadow-hover transition-all duration-300">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Price Negotiation</h3>
              <p className="text-sm text-muted-foreground">
                Negotiate prices directly with our team for the best deals
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card shadow-card hover:shadow-hover transition-all duration-300">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">M-Pesa Payment</h3>
              <p className="text-sm text-muted-foreground">
                Secure STK Push payments via M-Pesa for your convenience
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card shadow-card hover:shadow-hover transition-all duration-300">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Delivery Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Track your order from processing to delivery in real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Start browsing our collection of quality UMS meters today
          </p>
          <Link to="/products">
            <Button size="lg" className="shadow-lg">
              View All Products
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
