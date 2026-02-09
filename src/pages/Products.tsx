import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ProductQuickView } from "@/components/ProductQuickView";
import { CompareProvider, CompareButton, CompareDrawer } from "@/components/CompareProducts";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { motion } from "framer-motion";
import { FadeIn, SectionHeading, GridItem } from "@/components/AnimatedPage";
import { Package, Search, Filter, Zap, Droplets, Flame, Grid3X3, MessageCircle, Eye, Scale, Tag } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  image_url: string;
  stock: number;
  category: string;
  specifications?: string | null;
  catalogue_pdf_url?: string | null;
  label?: string | null;
}

const categories = [
  { value: "all", label: "All Products", icon: Grid3X3 },
  { value: "SINGLE PHASE METERS", label: "Single Phase", icon: Zap },
  { value: "3 PHASE METERS", label: "3 Phase", icon: Zap },
  { value: "WATER METERS", label: "Water", icon: Droplets },
  { value: "GAS METERS", label: "Gas", icon: Flame },
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const { settings: siteSettings } = useSiteSettings();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load products",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CompareProvider>
      <ProductsContent
        loading={loading}
        products={products}
        filteredProducts={filteredProducts}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        quickViewProduct={quickViewProduct}
        setQuickViewProduct={setQuickViewProduct}
        siteSettings={siteSettings}
        navigate={navigate}
      />
    </CompareProvider>
  );
}

interface ProductsContentProps {
  loading: boolean;
  products: Product[];
  filteredProducts: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  siteSettings: { hide_pricing: boolean; hide_stock: boolean };
  navigate: (path: string) => void;
}

function ProductsContent({
  loading,
  products,
  filteredProducts,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  quickViewProduct,
  setQuickViewProduct,
  siteSettings,
  navigate,
}: ProductsContentProps) {
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />

      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-hero py-12 md:py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our Products
          </motion.h1>
          <motion.p 
            className="text-primary-foreground/80 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Quality prepaid meters with competitive KES pricing
          </motion.p>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
                className="flex-shrink-0"
              >
                <cat.icon className="h-4 w-4 mr-1" />
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results count and compare hint */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Scale className="h-4 w-4" />
            Click compare icon to select products
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <GridItem key={product.id} index={index}>
                <Card 
                  className="group hover:shadow-hover transition-all duration-300 h-full flex flex-col cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <CardHeader className="p-0">
                    <div className="aspect-square bg-muted rounded-t-lg overflow-hidden relative">
                      {product.image_url ? (
                        <motion.img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                      {/* Product Label */}
                      {product.label && (
                        <motion.div 
                          className="absolute top-2 left-2"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Badge className="bg-accent text-accent-foreground shadow-md">
                            <Tag className="h-3 w-3 mr-1" />
                            {product.label}
                          </Badge>
                        </motion.div>
                      )}
                      {/* Quick View & Compare Buttons */}
                      <motion.div 
                        className="absolute top-2 right-2 flex gap-1"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickViewProduct(product);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Quick View
                        </Button>
                      </motion.div>
                      <div 
                        className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CompareButton product={product} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex-grow">
                    <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      {!siteSettings.hide_pricing && (
                        <span className="text-xl font-bold text-primary">
                          KSh {product.base_price.toLocaleString()}
                        </span>
                      )}
                      {!siteSettings.hide_stock && (
                        <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </Badge>
                      )}
                    </div>
                    {product.category && (
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                    <Link to={`/products/${product.id}`} className="w-full">
                      <Button className="w-full" disabled={!siteSettings.hide_stock && product.stock === 0}>
                        View Details
                      </Button>
                    </Link>
                    <div className="flex gap-2 w-full">
                      <a
                        href={`https://wa.me/254700444448?text=${encodeURIComponent(`Hi, I'd like to order: ${product.name}${!siteSettings.hide_pricing ? ` (KSh ${product.base_price.toLocaleString()})` : ''}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="default" className="w-full bg-green-600 hover:bg-green-700">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Order
                        </Button>
                      </a>
                      <a
                        href={`https://wa.me/254700444448?text=${encodeURIComponent(`Hi, I'd like to enquire about: ${product.name}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="outline" className="w-full">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Enquire
                        </Button>
                      </a>
                    </div>
                  </CardFooter>
                </Card>
              </GridItem>
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        open={!!quickViewProduct}
        onOpenChange={(open) => !open && setQuickViewProduct(null)}
        hidePricing={siteSettings.hide_pricing}
        hideStock={siteSettings.hide_stock}
      />

      {/* Compare Drawer */}
      <CompareDrawer />

      <Footer />
    </div>
  </PageTransition>
  );
}
