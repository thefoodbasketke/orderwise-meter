import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AnimatePresence } from "framer-motion";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import CustomerOrders from "./pages/CustomerOrders";
import Negotiations from "./pages/Negotiations";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Testimonials from "./pages/Testimonials";
import Careers from "./pages/Careers";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import RegisterMeter from "./pages/RegisterMeter";
import Projects from "./pages/Projects";
import Quotation from "./pages/Quotation";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminNegotiations from "./pages/admin/Negotiations";
import AdminPayments from "./pages/admin/Payments";
import AdminMeterRegistrations from "./pages/admin/MeterRegistrations";
import AdminQuoteRequests from "./pages/admin/QuoteRequests";
import AdminContentManagement from "./pages/admin/ContentManagement";
import AdminProjects from "./pages/admin/Projects";
import AdminBlogs from "./pages/admin/Blogs";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { WhatsAppFloat } from "./components/WhatsAppFloat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/register-meter" element={<RegisterMeter />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/quotation" element={<Quotation />} />
              
              {/* Product Routes */}
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              
              {/* Customer Routes */}
              <Route path="/orders" element={<CustomerOrders />} />
              <Route path="/negotiations" element={<Negotiations />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute requireAdmin><AdminProducts /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute requireAdminOrHR><AdminOrders /></ProtectedRoute>} />
              <Route path="/admin/negotiations" element={<ProtectedRoute requireAdmin><AdminNegotiations /></ProtectedRoute>} />
              <Route path="/admin/payments" element={<ProtectedRoute requireAdmin><AdminPayments /></ProtectedRoute>} />
              <Route path="/admin/meter-registrations" element={<ProtectedRoute requireAdmin><AdminMeterRegistrations /></ProtectedRoute>} />
              <Route path="/admin/quote-requests" element={<ProtectedRoute requireAdmin><AdminQuoteRequests /></ProtectedRoute>} />
              <Route path="/admin/content" element={<ProtectedRoute requireAdmin><AdminContentManagement /></ProtectedRoute>} />
              <Route path="/admin/projects" element={<ProtectedRoute requireAdmin><AdminProjects /></ProtectedRoute>} />
              <Route path="/admin/blogs" element={<ProtectedRoute requireAdmin><AdminBlogs /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          <WhatsAppFloat />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
