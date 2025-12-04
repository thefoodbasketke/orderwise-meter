import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
            Privacy Policy
          </h1>
          <p className="text-primary-foreground/80">
            Last updated: January 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
            <h2>1. Introduction</h2>
            <p>
              UMS Kenya ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our services, 
              website, and products.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>We may collect the following personal information:</p>
            <ul>
              <li>Name and contact details (email, phone number, address)</li>
              <li>Property and meter information</li>
              <li>Payment and transaction details</li>
              <li>M-Pesa phone numbers for token purchases</li>
              <li>Location data for service delivery</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>When you access our services, we may automatically collect:</p>
            <ul>
              <li>Device information and identifiers</li>
              <li>Usage data and analytics</li>
              <li>IP address and browser type</li>
              <li>Meter consumption data</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul>
              <li>Provide and maintain our metering services</li>
              <li>Process transactions and token purchases</li>
              <li>Send notifications about your meter and account</li>
              <li>Provide customer support</li>
              <li>Improve our products and services</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>4. Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>Property owners/landlords (for tenant meter data)</li>
              <li>Payment processors (Safaricom M-Pesa)</li>
              <li>Service providers who assist our operations</li>
              <li>Legal authorities when required by law</li>
            </ul>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. However, 
              no method of transmission over the Internet is 100% secure.
            </p>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Lodge a complaint with relevant authorities</li>
            </ul>

            <h2>7. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services 
              and fulfill the purposes outlined in this policy, unless a longer retention period is 
              required by law.
            </p>

            <h2>8. Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under 18 years of age. We do not knowingly 
              collect personal information from children.
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new policy on this page and updating the "Last updated" date.
            </p>

            <h2>10. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us:</p>
            <ul>
              <li>Email: info@umskenya.com</li>
              <li>Phone: 0700 444 448</li>
              <li>Address: Capital One Plaza, Eastern Bypass Off Thika Road, Nairobi</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
