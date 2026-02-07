import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import umsLogo from "@/assets/ums-logo.png";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const socialIconVariants = {
  hover: { 
    scale: 1.15, 
    rotate: 5,
    transition: { duration: 0.2 }
  }
};

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 overflow-hidden">
      <motion.div 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <motion.div variants={itemVariants}>
            <motion.img 
              src={umsLogo} 
              alt="UMS Kenya" 
              className="h-12 mb-4 brightness-0 invert"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            />
            <p className="text-background/70 text-sm mb-4">
              Your trusted partner for quality utility metering solutions in Kenya.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "https://facebook.com" },
                { icon: Twitter, href: "https://twitter.com" },
                { icon: Instagram, href: "https://instagram.com" },
                { icon: Linkedin, href: "https://linkedin.com" },
              ].map((social, index) => (
                <motion.a 
                  key={index}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="h-9 w-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                  variants={socialIconVariants}
                  whileHover="hover"
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-background/70">
              {[
                { href: "/products", label: "Products" },
                { href: "/services", label: "Services" },
                { href: "/projects", label: "Projects" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/quotation", label: "Request Quote" },
              ].map((link, index) => (
                <motion.li 
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link 
                    to={link.href} 
                    className="hover:text-background transition-colors inline-block hover:translate-x-1 transform duration-200"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-background/70">
              {[
                { href: "/faq", label: "FAQs" },
                { href: "/blog", label: "Blog" },
                { href: "/testimonials", label: "Testimonials" },
                { href: "/careers", label: "Careers" },
                { href: "/register-meter", label: "Register Meter" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms & Conditions" },
              ].map((link, index) => (
                <motion.li 
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link 
                    to={link.href} 
                    className="hover:text-background transition-colors inline-block hover:translate-x-1 transform duration-200"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <motion.li 
                className="flex items-center gap-2"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Phone className="h-4 w-4" />
                <a href="tel:0700444448" className="hover:text-background transition-colors">0700 444 448</a>
              </motion.li>
              <motion.li 
                className="flex items-center gap-2"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Mail className="h-4 w-4" />
                <a href="mailto:info@umskenya.com" className="hover:text-background transition-colors">info@umskenya.com</a>
              </motion.li>
              <motion.li 
                className="flex items-start gap-2"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Capital One Plaza, Eastern Bypass Off Thika Road</span>
              </motion.li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
  className="border-t border-background/10 mt-10 pt-8 text-center text-sm text-background/50"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ delay: 0.5 }}
>
  <p>&copy; {new Date().getFullYear()} UMS Kenya. All rights reserved.</p>

  <p className="mt-2 text-background/40 text-xs">
    Designed &amp; Created by{" "}
    <a
      href="https://amstern.netlify.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-background transition-colors"
    >
      Amstern Tech Hub
    </a>
  </p>
</motion.div>
        
    </footer>
  );
}
