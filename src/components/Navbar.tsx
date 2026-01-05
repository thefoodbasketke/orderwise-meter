import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu, ChevronDown, ExternalLink, Key, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import umsLogo from "@/assets/ums-logo.png";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const moreLinks = [
  { href: "/quotation", label: "Request Quote" },
  { href: "/faq", label: "FAQs" },
  { href: "/blog", label: "Blog" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/careers", label: "Careers" },
  { href: "/register-meter", label: "Register Meter" },
];

export function Navbar() {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src={umsLogo} alt="UMS Kenya" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}>
                <Button variant="ghost" size="sm">{link.label}</Button>
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  More <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {moreLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link to={link.href} className="cursor-pointer w-full">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

          </div>

          <div className="flex items-center space-x-2">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="hidden md:block">
                    <Button variant="ghost" size="sm">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/orders" className="cursor-pointer">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            My Orders
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/negotiations" className="cursor-pointer">
                            Negotiations
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    {isAdmin && (
                      <DropdownMenuItem asChild className="md:hidden">
                        <Link to="/admin" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/auth">
                <Button size="sm">Sign In</Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link key={link.href} to={link.href} className="text-lg font-medium hover:text-primary">
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t pt-4 mt-2">
                    <p className="text-sm text-muted-foreground mb-3">More</p>
                    {moreLinks.map((link) => (
                      <Link key={link.href} to={link.href} className="block py-2 text-sm hover:text-primary">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t pt-4 mt-2">
                    <p className="text-sm text-muted-foreground mb-3">Quick Links</p>
                    <a
                      href="https://vendsolid.umskenya.com/tknverify"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center py-2 text-sm hover:text-primary"
                    >
                      <Key className="mr-2 h-4 w-4" />
                      Retrieve Tokens
                      <ExternalLink className="ml-auto h-3 w-3" />
                    </a>
                    <a
                      href="https://customer.umskenya.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center py-2 text-sm hover:text-primary"
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      Landlords Portal
                      <ExternalLink className="ml-auto h-3 w-3" />
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
