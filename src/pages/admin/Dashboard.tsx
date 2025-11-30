import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, MessageSquare, DollarSign } from "lucide-react";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  pendingNegotiations: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    pendingNegotiations: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes, negotiationsRes, paymentsRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("negotiations").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("payments").select("amount").eq("status", "success"),
      ]);

      const totalRevenue = paymentsRes.data?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      setStats({
        totalProducts: productsRes.count || 0,
        totalOrders: ordersRes.count || 0,
        pendingNegotiations: negotiationsRes.count || 0,
        totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      link: "/admin/products",
      color: "text-primary",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      link: "/admin/orders",
      color: "text-accent",
    },
    {
      title: "Pending Negotiations",
      value: stats.pendingNegotiations,
      icon: MessageSquare,
      link: "/admin/negotiations",
      color: "text-primary",
    },
    {
      title: "Total Revenue",
      value: `KSh ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      link: "/admin/payments",
      color: "text-accent",
    },
  ];

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat) => (
                  <Link key={stat.title} to={stat.link}>
                    <Card className="hover:shadow-hover transition-all duration-300 cursor-pointer">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </CardTitle>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link
                      to="/admin/products"
                      className="block p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="font-semibold">Manage Products</div>
                      <div className="text-sm text-muted-foreground">Add, edit, or remove products</div>
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="block p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="font-semibold">View Orders</div>
                      <div className="text-sm text-muted-foreground">Track and update order status</div>
                    </Link>
                    <Link
                      to="/admin/negotiations"
                      className="block p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="font-semibold">Handle Negotiations</div>
                      <div className="text-sm text-muted-foreground">Review and respond to price offers</div>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Platform</div>
                      <div className="font-semibold">UMS Meter Ordering System</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Status</div>
                      <div className="font-semibold text-green-600">Online</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
