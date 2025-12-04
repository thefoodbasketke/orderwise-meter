import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Clock, 
  Briefcase,
  Users,
  GraduationCap,
  Heart,
  Send
} from "lucide-react";

const jobOpenings = [
  {
    id: 1,
    title: "Sales Executive",
    department: "Sales",
    location: "Nairobi",
    type: "Full-time",
    description: "We're looking for a motivated Sales Executive to join our growing team. You'll be responsible for driving sales of our metering solutions to property owners and developers.",
    requirements: [
      "2+ years sales experience",
      "Excellent communication skills",
      "Knowledge of real estate industry is a plus",
      "Valid driving license"
    ]
  },
  {
    id: 2,
    title: "Meter Installation Technician",
    department: "Technical",
    location: "Nairobi, Mombasa",
    type: "Full-time",
    description: "Join our technical team to install and maintain prepaid utility meters across Kenya. Training will be provided.",
    requirements: [
      "Diploma in Electrical Engineering or related field",
      "Experience with electrical installations",
      "Willingness to travel",
      "Customer service oriented"
    ]
  },
  {
    id: 3,
    title: "Customer Support Representative",
    department: "Support",
    location: "Nairobi",
    type: "Full-time",
    description: "Provide excellent customer support to our growing customer base. Handle inquiries, troubleshoot issues, and ensure customer satisfaction.",
    requirements: [
      "1+ year customer service experience",
      "Strong problem-solving skills",
      "Good computer skills",
      "Fluent in English and Swahili"
    ]
  },
  {
    id: 4,
    title: "Marketing Intern",
    department: "Marketing",
    location: "Nairobi",
    type: "Internship",
    description: "Great opportunity for recent graduates to gain hands-on marketing experience. You'll assist with digital marketing, content creation, and campaigns.",
    requirements: [
      "Degree in Marketing or related field",
      "Basic understanding of social media",
      "Creative mindset",
      "Available for 3-6 months"
    ]
  }
];

const benefits = [
  { icon: Heart, title: "Health Insurance", description: "Comprehensive medical cover" },
  { icon: GraduationCap, title: "Learning & Development", description: "Continuous training opportunities" },
  { icon: Users, title: "Team Culture", description: "Collaborative work environment" },
  { icon: Briefcase, title: "Career Growth", description: "Clear progression paths" },
];

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState<typeof jobOpenings[0] | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    
    setLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Application Submitted!",
      description: `Your application for ${selectedJob.title} has been received. We'll be in touch soon.`,
    });
    
    setFormData({ name: "", email: "", phone: "", coverLetter: "" });
    setSelectedJob(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Join Our Team
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Build your career with Kenya's leading utility metering company
          </p>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Work at UMS Kenya?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join a dynamic team that's transforming utility management across Kenya
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
            <p className="text-muted-foreground">
              Find your next opportunity
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {jobOpenings.map((job) => (
              <Card key={job.id} className="hover:shadow-hover transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{job.department}</p>
                    </div>
                    <Badge variant={job.type === "Full-time" ? "default" : "secondary"}>
                      {job.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {job.description}
                  </p>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setSelectedJob(job)}
                      >
                        View & Apply
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{job.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="flex gap-4 text-sm">
                          <Badge>{job.department}</Badge>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {job.type}
                          </span>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">About the Role</h4>
                          <p className="text-sm text-muted-foreground">{job.description}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Requirements</h4>
                          <ul className="space-y-1">
                            {job.requirements.map((req, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4 border-t pt-6">
                          <h4 className="font-semibold">Apply Now</h4>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name *</Label>
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email *</Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="coverLetter">Cover Letter *</Label>
                            <Textarea
                              id="coverLetter"
                              value={formData.coverLetter}
                              onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                              placeholder="Tell us why you're interested in this role..."
                              rows={4}
                              required
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Note: Please email your CV to careers@umskenya.com with the subject "{job.title} Application"
                          </p>
                          <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Submitting..." : (
                              <>
                                <Send className="mr-2 h-4 w-4" />
                                Submit Application
                              </>
                            )}
                          </Button>
                        </form>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
