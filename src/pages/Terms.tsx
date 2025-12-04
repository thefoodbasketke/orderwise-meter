import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
            Terms & Conditions
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
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using UMS Kenya's services, website, or products, you agree to be bound 
              by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </p>

            <h2>2. Services Description</h2>
            <p>
              UMS Kenya provides prepaid utility metering solutions including electricity, water, and 
              gas meters, along with related installation, maintenance, and support services.
            </p>

            <h2>3. Product Orders</h2>
            <h3>3.1 Ordering</h3>
            <ul>
              <li>All orders are subject to availability and acceptance</li>
              <li>Prices are in Kenya Shillings (KES) and may change without notice</li>
              <li>We reserve the right to refuse any order</li>
              <li>Price negotiations are subject to approval</li>
            </ul>

            <h3>3.2 Payment</h3>
            <ul>
              <li>Payment is processed via M-Pesa STK Push</li>
              <li>Full payment is required before order processing</li>
              <li>Payment confirmation is sent via SMS</li>
            </ul>

            <h3>3.3 Delivery</h3>
            <ul>
              <li>Delivery times are estimates and not guaranteed</li>
              <li>Risk of loss passes to buyer upon delivery</li>
              <li>Customer must provide accurate delivery information</li>
            </ul>

            <h2>4. Warranty</h2>
            <p>
              All meters come with a manufacturer's warranty. The warranty covers defects in materials 
              and workmanship under normal use. The warranty does not cover:
            </p>
            <ul>
              <li>Damage from improper installation</li>
              <li>Tampering or unauthorized modifications</li>
              <li>Normal wear and tear</li>
              <li>Damage from power surges or natural disasters</li>
            </ul>

            <h2>5. Token Purchases</h2>
            <p>For prepaid token purchases:</p>
            <ul>
              <li>Tokens are non-refundable once loaded</li>
              <li>Ensure correct meter number before purchase</li>
              <li>Transaction fees may apply</li>
              <li>Keep M-Pesa confirmation for your records</li>
            </ul>

            <h2>6. User Responsibilities</h2>
            <p>Users must:</p>
            <ul>
              <li>Provide accurate information during registration</li>
              <li>Not tamper with or attempt to bypass meters</li>
              <li>Report any meter malfunctions promptly</li>
              <li>Allow authorized access for installation/maintenance</li>
              <li>Pay for utilities consumed</li>
            </ul>

            <h2>7. Limitation of Liability</h2>
            <p>
              UMS Kenya shall not be liable for any indirect, incidental, special, or consequential 
              damages arising from the use of our products or services. Our maximum liability is limited 
              to the amount paid for the specific product or service in question.
            </p>

            <h2>8. Intellectual Property</h2>
            <p>
              All content on our website, including logos, text, graphics, and software, is the property 
              of UMS Kenya and protected by applicable intellectual property laws.
            </p>

            <h2>9. Privacy</h2>
            <p>
              Your use of our services is also governed by our Privacy Policy, which is incorporated 
              into these Terms by reference.
            </p>

            <h2>10. Dispute Resolution</h2>
            <p>
              Any disputes arising from these terms shall be resolved through negotiation. If 
              negotiation fails, disputes shall be settled through arbitration in accordance with 
              Kenyan law.
            </p>

            <h2>11. Governing Law</h2>
            <p>
              These Terms and Conditions are governed by the laws of the Republic of Kenya. Any 
              legal proceedings shall be conducted in Kenyan courts.
            </p>

            <h2>12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective 
              immediately upon posting on our website.
            </p>

            <h2>13. Contact Information</h2>
            <p>For questions about these Terms and Conditions:</p>
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
