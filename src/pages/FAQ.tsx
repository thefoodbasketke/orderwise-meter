import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare } from "lucide-react";

const landlordFaqs = [
  {
    question: "What are the requirements to have UMS prepaid meters?",
    answer: "To install UMS prepaid meters, you need: 1) A property with existing utility connections, 2) Valid property ownership documents, 3) Tenant occupancy details, 4) An active mobile money account for revenue collection. Our team will guide you through the complete setup process."
  },
  {
    question: "Where can I get the UMS meters?",
    answer: "You can purchase UMS meters directly from our shop at Capital One Plaza, Eastern Bypass Off Thika Road, or order online through our website. We also have authorized dealers across major towns in Kenya."
  },
  {
    question: "How do these meters work?",
    answer: "UMS prepaid meters work on a pay-as-you-go system. Tenants purchase tokens using M-Pesa, which are then loaded onto the meter. The meter tracks consumption and deducts from the loaded balance, ensuring tenants only use what they've paid for."
  },
  {
    question: "What surety is there that the landlord shall receive their money?",
    answer: "All payments are processed through secure M-Pesa transactions and directly deposited into your designated account. You receive real-time SMS notifications for every token purchase, and our system provides detailed reports and analytics."
  },
  {
    question: "Does this meter replace the main KPLC meter?",
    answer: "No, UMS prepaid meters are sub-meters installed after the main KPLC meter. They help you distribute and bill utility usage to individual tenants while the main meter remains the property of the utility company."
  },
  {
    question: "Is this meter recognized by KPLC?",
    answer: "UMS meters are certified sub-metering devices approved by relevant regulatory bodies. They work alongside (not in place of) the main KPLC meter to help with internal billing and distribution."
  },
  {
    question: "Who installs the meter once purchased?",
    answer: "UMS provides professional installation services through our certified technicians. Installation is typically done within 24-48 hours of purchase. You can also use approved third-party installers if preferred."
  },
  {
    question: "Who is responsible for the main utility meter?",
    answer: "The main utility meter remains the responsibility of the property owner and the utility company (KPLC for electricity, county water company for water). The UMS prepaid meter only manages distribution to individual units."
  },
  {
    question: "Are there any charges once the meters are purchased?",
    answer: "After purchase and installation, there are minimal transaction fees on token purchases (similar to standard M-Pesa fees). There are no monthly subscription fees. Optional maintenance packages are available."
  },
  {
    question: "Who pays administration fee?",
    answer: "Administration fees, if any, are typically included in the token price and can be set by the landlord. This small margin covers system maintenance and support services."
  },
  {
    question: "Can landlord increase the tariff?",
    answer: "Yes, landlords have the flexibility to set their own tariff rates through the management portal. However, rates should be reasonable and compliant with any applicable regulations."
  }
];

const tenantFaqs = [
  {
    question: "How do I purchase tokens?",
    answer: "You can purchase tokens via M-Pesa by following these steps: 1) Go to M-Pesa > Lipa na M-Pesa > Buy Goods, 2) Enter your meter's paybill/till number, 3) Enter your meter number as the account, 4) Enter the amount, 5) Confirm with your M-Pesa PIN. Tokens are sent to your phone via SMS."
  },
  {
    question: "What if I need technical support?",
    answer: "For technical support, you can: 1) Call our support line at 0700 444 448 (24/7), 2) Email support@umskenya.com, 3) Visit our office at Capital One Plaza, 4) Contact your landlord who can raise a support ticket on your behalf."
  },
  {
    question: "How do I know my meter number?",
    answer: "Your meter number is displayed on the front of your prepaid meter unit. It's typically a 10-13 digit number. You can also find it on previous token purchase receipts or ask your landlord for the meter details."
  },
  {
    question: "What should I do if the meter stops working?",
    answer: "If your meter stops working: 1) Check if you have sufficient credit/tokens, 2) Try resetting the meter using the reset button (if available), 3) Check for any error codes on display, 4) Contact our 24/7 support line at 0700 444 448. Do not attempt to open or tamper with the meter."
  }
];

const generalFaqs = [
  {
    question: "What types of meters does UMS offer?",
    answer: "We offer prepaid electricity meters, smart water meters, and smart gas meters for both residential and commercial applications. All meters come with M-Pesa integration for convenient token purchases."
  },
  {
    question: "Do you deliver nationwide?",
    answer: "Yes, we deliver across Kenya. Delivery within Nairobi is typically within 24 hours, while other locations may take 2-5 business days depending on the destination."
  },
  {
    question: "What is your warranty policy?",
    answer: "All UMS meters come with a minimum 1-year manufacturer's warranty covering defects and malfunctions. Extended warranty options are available for purchase."
  },
  {
    question: "Can I negotiate prices for bulk orders?",
    answer: "Yes, we offer competitive pricing for bulk orders. Contact our sales team or use our price negotiation feature when placing orders to get the best deals."
  },
  {
    question: "How do I register my meter after purchase?",
    answer: "After installation, you can register your meter on our website through the 'Register Meter' page. This activates your warranty and enables you to access support services."
  }
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Find answers to common questions about our prepaid meters
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="landlord" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="landlord">Landlord FAQs</TabsTrigger>
              <TabsTrigger value="tenant">Tenant FAQs</TabsTrigger>
              <TabsTrigger value="general">General FAQs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="landlord">
              <Card>
                <CardHeader>
                  <CardTitle>For Landlords & Property Owners</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {landlordFaqs.map((faq, index) => (
                      <AccordionItem key={index} value={`landlord-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tenant">
              <Card>
                <CardHeader>
                  <CardTitle>For Tenants</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {tenantFaqs.map((faq, index) => (
                      <AccordionItem key={index} value={`tenant-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {generalFaqs.map((faq, index) => (
                      <AccordionItem key={index} value={`general-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Can't find what you're looking for? Contact our support team for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Us
              </Button>
            </Link>
            <a href="tel:0700444448">
              <Button size="lg" variant="outline">
                <Phone className="mr-2 h-4 w-4" />
                Call: 0700 444 448
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
