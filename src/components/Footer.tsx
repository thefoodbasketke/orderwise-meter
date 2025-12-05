import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import umsLogo from "@/assets/ums-logo.png";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <img src={umsLogo} alt="UMS Kenya" className="h-12 mb-4 brightness-0 invert" />
            <p className="text-background/70 text-sm mb-4">
              Your trusted partner for quality utility metering solutions in Kenya.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link to="/products" className="hover:text-background transition-colors">Products</Link></li>
              <li><Link to="/services" className="hover:text-background transition-colors">Services</Link></li>
              <li><Link to="/projects" className="hover:text-background transition-colors">Projects</Link></li>
              <li><Link to="/about" className="hover:text-background transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-background transition-colors">Contact</Link></li>
              <li><Link to="/quotation" className="hover:text-background transition-colors">Request Quote</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link to="/faq" className="hover:text-background transition-colors">FAQs</Link></li>
              <li><Link to="/blog" className="hover:text-background transition-colors">Blog</Link></li>
              <li><Link to="/testimonials" className="hover:text-background transition-colors">Testimonials</Link></li>
              <li><Link to="/careers" className="hover:text-background transition-colors">Careers</Link></li>
              <li><Link to="/register-meter" className="hover:text-background transition-colors">Register Meter</Link></li>
              <li><Link to="/privacy" className="hover:text-background transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-background transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:0700444448" className="hover:text-background transition-colors">0700 444 448</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@umskenya.com" className="hover:text-background transition-colors">info@umskenya.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Capital One Plaza, Eastern Bypass Off Thika Road</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/10 mt-10 pt-8 text-center text-sm text-background/50">
          <p>&copy; {new Date().getFullYear()} UMS Kenya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
