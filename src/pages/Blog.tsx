import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "The Complete Guide to Prepaid Electricity Meters in Kenya",
    excerpt: "Learn everything you need to know about prepaid electricity meters, from installation to daily usage and maintenance tips.",
    category: "Guide",
    author: "UMS Team",
    date: "2024-01-15",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
  },
  {
    id: 2,
    title: "Smart Water Meters vs Traditional Meters: A Comparison",
    excerpt: "Discover the key differences between smart water meters and traditional meters, and why upgrading can save you money.",
    category: "Comparison",
    author: "Technical Team",
    date: "2024-01-10",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800"
  },
  {
    id: 3,
    title: "5 Tips for Landlords: Maximizing Revenue with Prepaid Meters",
    excerpt: "Practical advice for property owners on how to optimize their prepaid metering systems for better tenant management.",
    category: "Tips",
    author: "UMS Team",
    date: "2024-01-05",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
  },
  {
    id: 4,
    title: "How to Troubleshoot Common Meter Issues",
    excerpt: "A step-by-step guide to diagnosing and fixing the most common prepaid meter problems you might encounter.",
    category: "Technical",
    author: "Support Team",
    date: "2023-12-28",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800"
  },
  {
    id: 5,
    title: "UMS Kenya Expands to Western Region",
    excerpt: "We're excited to announce the opening of our new service center in Kisumu, bringing quality metering solutions closer to you.",
    category: "News",
    author: "UMS Team",
    date: "2023-12-20",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"
  },
  {
    id: 6,
    title: "Understanding M-Pesa Integration for Token Purchases",
    excerpt: "A detailed look at how our M-Pesa integration works and how to ensure smooth token purchases every time.",
    category: "Guide",
    author: "Technical Team",
    date: "2023-12-15",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800"
  }
];

const categories = ["All", "Guide", "Comparison", "Tips", "Technical", "News"];

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Blog & Updates
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Stay informed with the latest news, guides, and tips from UMS Kenya
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-hover transition-shadow">
                <div className="aspect-video bg-muted">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <Button variant="link" className="px-0 mt-4">
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
