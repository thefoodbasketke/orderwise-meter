import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, Building, Home, Factory } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "John Kamau",
    role: "Property Owner",
    location: "Nairobi",
    type: "residential",
    rating: 5,
    text: "UMS prepaid meters have transformed how I manage my rental properties. No more disputes over utility bills - tenants pay for what they use, and I receive payments automatically via M-Pesa. Highly recommend!",
  },
  {
    id: 2,
    name: "Mary Wanjiku",
    role: "Apartment Manager",
    location: "Mombasa",
    type: "residential",
    rating: 5,
    text: "The installation was quick and professional. The meters are accurate and the customer support is excellent. Our tenants love the convenience of buying tokens via M-Pesa.",
  },
  {
    id: 3,
    name: "Peter Ochieng",
    role: "Commercial Building Owner",
    location: "Kisumu",
    type: "commercial",
    rating: 5,
    text: "Managing utility costs across my commercial building has never been easier. The detailed reports help me track consumption patterns and make informed decisions.",
  },
  {
    id: 4,
    name: "Grace Muthoni",
    role: "Real Estate Developer",
    location: "Nakuru",
    type: "commercial",
    rating: 4,
    text: "We've installed UMS meters in all our new developments. The quality is outstanding and the after-sales support is responsive. A reliable partner for any property developer.",
  },
  {
    id: 5,
    name: "David Kiprop",
    role: "Industrial Park Manager",
    location: "Eldoret",
    type: "industrial",
    rating: 5,
    text: "For industrial applications, accuracy is crucial. UMS meters have proven to be reliable and precise, helping us manage energy costs effectively across multiple units.",
  },
  {
    id: 6,
    name: "Anne Njeri",
    role: "Hostel Owner",
    location: "Thika",
    type: "residential",
    rating: 5,
    text: "Running a student hostel, I was always worried about utility theft and disputes. UMS meters eliminated these problems completely. Best investment I've made!",
  },
  {
    id: 7,
    name: "Samuel Mutua",
    role: "Hotel Owner",
    location: "Naivasha",
    type: "commercial",
    rating: 5,
    text: "The water meters from UMS have helped us reduce wastage significantly. The smart monitoring features are a game-changer for hospitality businesses.",
  },
  {
    id: 8,
    name: "Lucy Akinyi",
    role: "Property Manager",
    location: "Machakos",
    type: "residential",
    rating: 4,
    text: "Very satisfied with both the products and service. The team was helpful throughout the installation process and provided excellent training on how to use the management portal.",
  }
];

const stats = [
  { value: "5000+", label: "Satisfied Customers" },
  { value: "15000+", label: "Meters Installed" },
  { value: "4.8/5", label: "Average Rating" },
  { value: "47", label: "Counties Served" },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "residential":
      return Home;
    case "commercial":
      return Building;
    case "industrial":
      return Factory;
    default:
      return Home;
  }
};

export default function Testimonials() {
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
            {testimonials.map((testimonial) => {
              const TypeIcon = getTypeIcon(testimonial.type);
              return (
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
                      "{testimonial.text}"
                    </p>
                    
                    {/* Author Info */}
                    <div className="flex items-center gap-3 pt-4 border-t">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <TypeIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.role} • {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
            <a href="/products">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
                Browse Products
              </button>
            </a>
            <a href="/contact">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4">
                Contact Us
              </button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
