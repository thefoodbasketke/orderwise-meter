import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  CheckCircle2,
  Star,
  Users,
  Award,
  Building2,
  Wrench,
  HeadphonesIcon,
  ExternalLink,
  Coins,
  Home,
  ChevronLeft,
  ChevronRight,
  Tag,
  BookOpen,
  Play,
  Image,
  X,
  ZoomIn
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import umsLogo from "@/assets/ums-logo.png";

interface HeroBanner {
  id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  is_active: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  stock: number;
  category: string | null;
  label: string | null;
}

interface FeaturedBlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  author: string | null;
  category: string | null;
  published_at: string | null;
}

interface GalleryImage {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
}

interface VideoShowcase {
  id: string;
  title: string | null;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
}

const stats = [
  { value: "10K+", label: "Meters Installed", icon: Zap },
  { value: "500+", label: "Happy Clients", icon: Users },
  { value: "47", label: "Counties Served", icon: Building2 },
  { value: "99%", label: "Satisfaction Rate", icon: Award },
];

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

const services = [
  { icon: Wrench, title: "Installation", description: "Professional meter installation by certified technicians" },
  { icon: HeadphonesIcon, title: "24/7 Support", description: "Round-the-clock technical assistance" },
  { icon: Shield, title: "Warranty", description: "Comprehensive warranty on all products" },
];

const testimonials = [
  {
    name: "John Kamau",
    role: "Property Manager, Greenview Estate",
    content: "UMS meters have transformed how we manage utilities in our estate. The prepaid system has eliminated billing disputes completely.",
    rating: 5,
  },
  {
    name: "Mary Wanjiku",
    role: "Landlord, Nairobi",
    content: "Excellent service from installation to support. My tenants love the convenience of prepaid meters.",
    rating: 5,
  },
  {
    name: "Peter Ochieng",
    role: "Facilities Manager",
    content: "Professional team and quality products. We've seen significant improvement in utility management across our buildings.",
    rating: 5,
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
  const { settings: siteSettings } = useSiteSettings();
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<FeaturedBlog[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [videoShowcases, setVideoShowcases] = useState<VideoShowcase[]>([]);
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const fetchHeroBanners = async () => {
      const { data } = await supabase
        .from("hero_banners")
        .select("*")
        .eq("is_active", true)
        .order("updated_at", { ascending: false });
      if (data && data.length > 0) setHeroBanners(data);
    };
    
    const fetchFeaturedProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, description, base_price, image_url, stock, category, label")
        .gt("stock", 0)
        .limit(4);
      if (data) setFeaturedProducts(data);
    };

    const fetchFeaturedBlogs = async () => {
      const { data } = await supabase
        .from("blogs")
        .select("id, title, slug, excerpt, image_url, author, category, published_at")
        .eq("is_published", true)
        .eq("is_featured", true)
        .order("published_at", { ascending: false })
        .limit(3);
      if (data) setFeaturedBlogs(data);
    };

    const fetchGalleryImages = async () => {
      const { data } = await supabase
        .from("gallery_images")
        .select("id, title, description, image_url")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .limit(6);
      if (data) setGalleryImages(data);
    };

    const fetchVideoShowcases = async () => {
      const { data } = await supabase
        .from("video_showcases")
        .select("id, title, description, video_url, thumbnail_url")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .limit(2);
      if (data) setVideoShowcases(data);
    };
    
    fetchHeroBanners();
    fetchFeaturedProducts();
    fetchFeaturedBlogs();
    fetchGalleryImages();
    fetchVideoShowcases();
  }, []);

  // Auto-rotate banners every 6 seconds
  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroBanners.length]);

  const goToPrevBanner = useCallback(() => {
    setCurrentBannerIndex((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  }, [heroBanners.length]);

  const goToNextBanner = useCallback(() => {
    setCurrentBannerIndex((prev) => (prev + 1) % heroBanners.length);
  }, [heroBanners.length]);

  const currentBanner = heroBanners[currentBannerIndex] || null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[600px]">
        {/* Background Video, Image or Gradient */}
        {currentBanner?.video_url ? (
          <>
            <video
              key={currentBanner.id + '-video'}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            >
              <source src={currentBanner.video_url} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
          </>
        ) : currentBanner?.image_url ? (
          <>
            <div 
              key={currentBanner.id + '-image'}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
              style={{ backgroundImage: `url(${currentBanner.image_url})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-hero"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
          </>
        )}

        {/* Carousel Navigation */}
        {heroBanners.length > 1 && (
          <>
            <button
              onClick={goToPrevBanner}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 text-primary-foreground transition-colors"
              aria-label="Previous banner"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={goToNextBanner}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 text-primary-foreground transition-colors"
              aria-label="Next banner"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            {/* Dots indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {heroBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentBannerIndex 
                      ? 'bg-white w-8' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
        
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-primary-foreground/90 text-sm font-medium">
                  {currentBanner?.subtitle || "Kenya's Trusted Meter Supplier"}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                {currentBanner?.title || "Utility Metering Solutions"}
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/85 mb-8 max-w-xl">
                {currentBanner?.description || "Premium prepaid electricity, water, and gas meters with flexible pricing, secure M-Pesa payments, and nationwide delivery."}
              </p>
              
              {/* External Portal Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <a 
                  href="https://vendsolid.umskenya.com/tknverify" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="secondary" className="shadow-lg group w-full sm:w-auto">
                    <Coins className="mr-2 h-5 w-5" />
                    Retrieve Tokens
                    <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
                  </Button>
                </a>
                <a 
                  href="https://customer.umskenya.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="outline" className="bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20 w-full sm:w-auto">
                    <Home className="mr-2 h-5 w-5" />
                    Landlords Portal
                    <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
                  </Button>
                </a>
              </div>
              
              {/* Secondary Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button size="lg" variant="ghost" className="text-primary-foreground hover:bg-white/10 border border-white/20">
                    Browse Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/register-meter">
                  <Button size="lg" variant="ghost" className="text-primary-foreground hover:bg-white/10 border border-white/20">
                    <Shield className="mr-2 h-4 w-4" />
                    Register Meter
                  </Button>
                </Link>
                {!user && (
                  <Link to="/auth">
                    <Button size="lg" variant="ghost" className="text-primary-foreground hover:bg-white/10">
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

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
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

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Browse our selection of quality prepaid meters available for immediate purchase
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="group overflow-hidden hover:shadow-hover transition-all duration-300">
                  <div className="aspect-square bg-muted/50 relative overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.label && (
                        <Badge className="bg-accent text-accent-foreground">
                          <Tag className="h-3 w-3 mr-1" />
                          {product.label}
                        </Badge>
                      )}
                      {product.category && (
                        <Badge variant="secondary">
                          {product.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description || "Quality prepaid meter"}
                    </p>
                    <div className="flex items-center justify-between">
                      {!siteSettings.hide_pricing && (
                        <span className="text-lg font-bold text-primary">
                          KES {product.base_price.toLocaleString()}
                        </span>
                      )}
                      <Link to={`/products/${product.id}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link to="/products">
                <Button size="lg">
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Blogs Section */}
      {featuredBlogs.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">From Our Blog</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Insights</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Stay updated with the latest news, tips, and guides about utility metering
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {featuredBlogs.map((blog) => (
                <Card key={blog.id} className="group overflow-hidden hover:shadow-hover transition-all duration-300">
                  <div className="aspect-video bg-muted/50 relative overflow-hidden">
                    {blog.image_url ? (
                      <img
                        src={blog.image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                    {blog.category && (
                      <Badge className="absolute top-3 left-3" variant="secondary">
                        {blog.category}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {blog.excerpt || "Read more about this topic..."}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {blog.author && `By ${blog.author}`}
                      </span>
                      <Link to={`/blog/${blog.slug}`}>
                        <Button size="sm" variant="ghost" className="text-primary">
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link to="/blog">
                <Button size="lg" variant="outline">
                  View All Articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Image className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Our Gallery</h2>
                  <p className="text-sm text-muted-foreground">Projects across Kenya</p>
                </div>
              </div>
              <Link to="/projects">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {galleryImages.map((image) => (
                <button 
                  key={image.id}
                  onClick={() => setLightboxImage(image)}
                  className="relative overflow-hidden rounded-md group aspect-square cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <img
                    src={image.image_url}
                    alt={image.title || "Gallery image"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1">
                    <ZoomIn className="h-5 w-5 text-white" />
                    {image.title && (
                      <span className="text-white text-xs font-medium text-center px-2 line-clamp-2">{image.title}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Lightbox Modal */}
      <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black/95 border-none">
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          {lightboxImage && (
            <div className="relative flex flex-col items-center justify-center p-4">
              <img
                src={lightboxImage.image_url}
                alt={lightboxImage.title || "Gallery image"}
                className="max-h-[80vh] w-auto object-contain rounded-lg animate-scale-in"
              />
              {(lightboxImage.title || lightboxImage.description) && (
                <div className="mt-4 text-center text-white">
                  {lightboxImage.title && <h3 className="text-lg font-semibold">{lightboxImage.title}</h3>}
                  {lightboxImage.description && <p className="text-sm text-white/70 mt-1">{lightboxImage.description}</p>}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Video Showcase Section */}
      {videoShowcases.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
                <Play className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Video Showcase</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Watch & Learn</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our featured videos about products, installations, and more
              </p>
            </div>
            
            <div className={`grid ${videoShowcases.length === 1 ? 'max-w-3xl mx-auto' : 'md:grid-cols-2'} gap-8`}>
              {videoShowcases.map((video) => (
                <Card key={video.id} className="overflow-hidden group">
                  <div className="aspect-video relative">
                    <video
                      src={video.video_url}
                      poster={video.thumbnail_url || undefined}
                      controls
                      className="w-full h-full object-cover"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  {(video.title || video.description) && (
                    <CardContent className="p-5">
                      {video.title && (
                        <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                      )}
                      {video.description && (
                        <p className="text-sm text-muted-foreground">{video.description}</p>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Complete metering solutions from installation to ongoing support
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-hover transition-shadow">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <service.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/services">
              <Button variant="outline">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose UMS Kenya?</h2>
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

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Trusted by property managers, landlords, and businesses across Kenya
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 text-sm italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/testimonials">
              <Button variant="outline">
                View All Testimonials
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
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
            <a href="tel:0700444448">
              <Button size="lg" variant="outline" className="bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20">
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
