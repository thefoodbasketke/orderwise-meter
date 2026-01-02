import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star, Quote, Building, Home, Factory, User } from "lucide-react";

interface Testimonial {
  id: string;
  client_name: string;
  company: string | null;
  role: string | null;
  content: string;
  rating: number;
  image_url: string | null;
  is_featured: boolean;
}

const defaultTestimonials = [
  {
    id: "1",
    client_name: "John Kamau",
    role: "Property Owner",
    company: "Nairobi",
    rating: 5,
    content: "UMS prepaid meters have transformed how I manage my rental properties. No more disputes over utility bills - tenants pay for what they use, and I receive payments automatically via M-Pesa. Highly recommend!",
    image_url: null,
    is_featured: false,
  },
  {
    id: "2",
    client_name: "Mary Wanjiku",
    role: "Apartment Manager",
    company: "Mombasa",
    rating: 5,
    content: "The installation was quick and professional. The meters are accurate and the customer support is excellent. Our tenants love the convenience of buying tokens via M-Pesa.",
    image_url: null,
    is_featured: false,
  },
  {
    id: "3",
    client_name: "Peter Ochieng",
    role: "Commercial Building Owner",
    company: "Kisumu",
    rating: 5,
    content: "Managing utility costs across my commercial building has never been easier. The detailed reports help me track consumption patterns and make informed decisions.",
    image_url: null,
    is_featured: false,
  },
  {
    id: "4",
    client_name: "Grace Muthoni",
    role: "Real Estate Developer",
    company: "Nakuru",
    rating: 4,
    content: "We've installed UMS meters in all our new developments. The quality is outstanding and the after-sales support is responsive. A reliable partner for any property developer.",
    image_url: null,
    is_featured: false,
  },
  {
    id: "5",
    client_name: "David Kiprop",
    role: "Industrial Park Manager",
    company: "Eldoret",
    rating: 5,
    content: "For industrial applications, accuracy is crucial. UMS meters have proven to be reliable and precise, helping us manage energy costs effectively across multiple units.",
    image_url: null,
    is_featured: false,
  },
  {
    id: "6",
    client_name: "Anne Njeri",
    role: "Hostel Owner",
    company: "Thika",
    rating: 5,
    content: "Running a student hostel, I was always worried about utility theft and disputes. UMS meters eliminated these problems completely. Best investment I've made!",
    image_url: null,
    is_featured: false,
  },
];

const stats = [
  { value: "5000+", label: "Satisfied Customers" },
  { value: "15000+", label: "Meters Installed" },
  { value: "4.8/5", label: "Average Rating" },
  { value: "47", label: "Counties Served" },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await supabase.from("testimonials").select("*").order("sort_order");
        if (data && data.length > 0) {
          setTestimonials(data);
        } else {
          setTestimonials(defaultTestimonials);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setTestimonials(defaultTestimonials);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Customer Testimonials
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            See what our customers say about UMS Kenya metering solutions
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="relative hover:shadow-hover transition-shadow">
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
                  
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Testimonial Text */}
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  {/* Author Info */}
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {testimonial.image_url ? (
                        <img src={testimonial.image_url} alt={testimonial.client_name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.client_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}{testimonial.company && ` • ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Join Our Satisfied Customers?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Experience the difference with UMS Kenya metering solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
