import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Home, Shield, Clock, Users, Zap, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  phoneNumber: z.string().min(10, "Invalid phone number").max(15),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const FEATURES = [
  { icon: Shield, title: "Secure Access", description: "Bank-level encryption for your data" },
  { icon: Clock, title: "24/7 Support", description: "Round-the-clock customer service" },
  { icon: Users, title: "Trusted by Many", description: "Join thousands of satisfied customers" },
  { icon: Zap, title: "Fast & Reliable", description: "Quick meter solutions delivery" },
];

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      signInSchema.parse(data);
      const { error } = await signIn(data.email, data.password);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        toast({
          title: "Success",
          description: "Signed in successfully",
        });
        navigate("/");
      }
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

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get("fullName") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      signUpSchema.parse(data);
      const { error } = await signUp(data.email, data.password, data.fullName, data.phoneNumber);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        toast({
          title: "Success",
          description: "Account created successfully",
        });
        navigate("/");
      }
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

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-accent relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-4">Welcome to UMS Kenya</h1>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-md">
              Your trusted partner for smart metering solutions. Join us to access premium prepaid meters and excellent customer service.
            </p>
          </motion.div>

          <div className="space-y-4">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4"
              >
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-primary-foreground/70">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex items-center gap-2 text-sm text-primary-foreground/60"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Trusted by 10,000+ customers across Kenya</span>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
        {/* Home Button */}
        <div className="p-4">
          <Link to="/">
            <Button variant="outline" className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Mobile Features Banner */}
        <div className="lg:hidden bg-gradient-to-r from-primary to-accent p-6 text-primary-foreground">
          <h2 className="text-xl font-bold mb-2">Welcome to UMS Kenya</h2>
          <p className="text-sm text-primary-foreground/80">Your trusted partner for smart metering solutions</p>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Card className="shadow-xl border-primary/10">
              <CardHeader className="space-y-1 pb-4">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Shield className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center">UMS Meters</CardTitle>
                <CardDescription className="text-center">
                  {isSignIn ? "Sign in to access your account" : "Create an account to get started"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={isSignIn ? "signin" : "signup"} onValueChange={(v) => setIsSignIn(v === "signin")}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email">Email</Label>
                        <Input
                          id="signin-email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          required
                          className="border-primary/20 focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password">Password</Label>
                        <Input
                          id="signin-password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          required
                          className="border-primary/20 focus:border-primary"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity" 
                        disabled={loading}
                      >
                        {loading ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-fullname">Full Name</Label>
                        <Input
                          id="signup-fullname"
                          name="fullName"
                          type="text"
                          placeholder="John Doe"
                          required
                          className="border-primary/20 focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-phone">Phone Number</Label>
                        <Input
                          id="signup-phone"
                          name="phoneNumber"
                          type="tel"
                          placeholder="+254700000000"
                          required
                          className="border-primary/20 focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          required
                          className="border-primary/20 focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          required
                          className="border-primary/20 focus:border-primary"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity" 
                        disabled={loading}
                      >
                        {loading ? "Creating account..." : "Sign Up"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    By signing up, you agree to our{" "}
                    <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
