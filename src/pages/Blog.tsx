import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, User, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FadeIn, StaggerContainer, GridItem, CardHover } from "@/components/AnimatedPage";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  author: string | null;
  image_url: string | null;
  published_at: string | null;
  created_at: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;

      setPosts(data || []);
      
      // Extract unique categories
      const uniqueCategories = ["All", ...new Set(data?.map(p => p.category).filter(Boolean) as string[])];
      setCategories(uniqueCategories);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load blog posts",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = selectedCategory === "All" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div 
              className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-muted-foreground">Loading posts...</p>
          </motion.div>
        </div>
      </div>
    );
  }

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
              Blog & Updates
            </motion.h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Stay informed with the latest news, guides, and tips from UMS Kenya
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-wrap gap-2 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={category === selectedCategory ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredPosts.length === 0 ? (
            <FadeIn>
              <Card className="text-center py-12">
                <CardContent>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2">No Posts Yet</h3>
                  <p className="text-muted-foreground">Check back soon for new content!</p>
                </CardContent>
              </Card>
            </FadeIn>
          ) : (
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <GridItem key={post.id} index={index}>
                  <CardHover>
                    <Card className="overflow-hidden h-full flex flex-col">
                      <motion.div 
                        className="aspect-video bg-muted overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        {post.image_url ? (
                          <motion.img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.4 }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </motion.div>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 mb-2">
                          {post.category && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <Badge variant="secondary">{post.category}</Badge>
                            </motion.div>
                          )}
                        </div>
                        <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col">
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {post.excerpt || post.content.substring(0, 150) + "..."}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                          <div className="flex items-center gap-4">
                            {post.author && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {post.author}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(post.published_at || post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {estimateReadTime(post.content)}
                          </span>
                        </div>
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button variant="link" className="px-0 mt-4" asChild>
                            <Link to={`/blog/${post.slug}`}>
                              Read More
                              <motion.span
                                className="ml-1"
                                initial={{ x: 0 }}
                                whileHover={{ x: 3 }}
                              >
                                <ArrowRight className="h-4 w-4" />
                              </motion.span>
                            </Link>
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </CardHover>
                </GridItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
