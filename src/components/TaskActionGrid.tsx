import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Coins,
  Home,
  FileText,
  Shield,
  AlertTriangle,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";

interface Action {
  title: string;
  description: string;
  icon: typeof Coins;
  href: string;
  external?: boolean;
  color: string;
  iconColor: string;
  featured?: boolean;
  cta?: string;
}

const actions: Action[] = [
  {
    title: "Order a Meter",
    description: "Browse our meters and place an order with secure M-Pesa checkout.",
    icon: ShoppingCart,
    href: "/products",
    color: "from-primary to-primary/80",
    iconColor: "text-primary",
    featured: true,
    cta: "Shop now",
  },
  {
    title: "Retrieve Tokens",
    description: "Get your prepaid electricity, water or gas tokens instantly.",
    icon: Coins,
    href: "https://vendsolid.umskenya.com/tknverify",
    external: true,
    color: "from-yellow-500/20 to-yellow-600/10",
    iconColor: "text-yellow-600",
  },
  {
    title: "Request a Quote",
    description: "Get pricing for bulk meters, installations or projects.",
    icon: FileText,
    href: "/quotation",
    color: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-600",
  },
  {
    title: "Register Your Meter",
    description: "Activate warranty and unlock free support on your meter.",
    icon: Shield,
    href: "/register-meter",
    color: "from-green-500/20 to-green-600/10",
    iconColor: "text-green-600",
  },
  {
    title: "Landlords Portal",
    description: "Manage tenants, monitor usage and track utility billing.",
    icon: Home,
    href: "https://customer.umskenya.com/",
    external: true,
    color: "from-purple-500/20 to-purple-600/10",
    iconColor: "text-purple-600",
  },
  {
    title: "Report an Issue",
    description: "Faulty meter or service issue? Reach our support team fast.",
    icon: AlertTriangle,
    href: "/contact",
    color: "from-red-500/20 to-red-600/10",
    iconColor: "text-red-600",
  },
];

export function TaskActionGrid() {
  return (
    <section className="py-10 md:py-14 -mt-12 md:-mt-16 relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">How Can We Help You Today?</h2>
          <p className="text-sm md:text-base text-muted-foreground">Quick access to our most-used services</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 md:gap-4 auto-rows-fr">
          {actions.map((action, i) => {
            const featured = action.featured;
            const Inner = (
              <Card
                className={`group h-full border-2 transition-all duration-300 overflow-hidden cursor-pointer ${
                  featured
                    ? "border-primary shadow-lg hover:shadow-xl"
                    : "hover:border-primary/40 hover:shadow-hover"
                }`}
              >
                <CardContent
                  className={`p-4 md:p-6 h-full flex flex-col items-start gap-3 bg-gradient-to-br ${action.color} ${
                    featured ? "text-primary-foreground" : ""
                  }`}
                >
                  <div
                    className={`h-11 w-11 md:h-12 md:w-12 rounded-xl bg-background flex items-center justify-center shadow-sm ${action.iconColor}`}
                  >
                    <action.icon className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-semibold text-sm md:text-base mb-1 transition-colors ${
                        featured ? "" : "group-hover:text-primary"
                      }`}
                    >
                      {action.title}
                    </h3>
                    <p
                      className={`text-xs md:text-sm line-clamp-2 ${
                        featured ? "text-primary-foreground/85" : "text-muted-foreground"
                      }`}
                    >
                      {action.description}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium inline-flex items-center gap-1 opacity-90 group-hover:opacity-100 group-hover:gap-2 transition-all ${
                      featured ? "text-primary-foreground" : "text-primary"
                    }`}
                  >
                    {action.cta || "Learn more"} <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            );

            const spanClass = "col-span-1";

            return (
              <motion.div
                key={action.title}
                className={spanClass}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                {action.external ? (
                  <a href={action.href} target="_blank" rel="noopener noreferrer" className="block h-full">
                    {Inner}
                  </a>
                ) : (
                  <Link to={action.href} className="block h-full">
                    {Inner}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
