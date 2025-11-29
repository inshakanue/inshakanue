import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Mail, 
  Linkedin, 
  MapPin, 
  Send, 
  Download,
  Twitter,
  Github,
  Clock,
  BookOpen
} from "lucide-react";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  inquiryType: z.string().min(1, "Please select an inquiry type"),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject must be less than 200 characters"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
  honeypot: z.string().max(0, "Invalid submission") // Bot detection
});

const RATE_LIMIT_COOLDOWN = 60 * 1000; // 1 minute client-side cooldown
const RATE_LIMIT_KEY = "contact_form_last_submission";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "",
    subject: "",
    message: "",
    honeypot: "" // Hidden field for bot detection
  });
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const { toast } = useToast();

  const handleDownloadResume = async () => {
    try {
      const response = await fetch('/Insha_Kanue_Resume.pdf');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'InshaKanue_ProductManager_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Check cooldown on mount and update countdown
  useEffect(() => {
    const checkCooldown = () => {
      const lastSubmission = localStorage.getItem(RATE_LIMIT_KEY);
      if (lastSubmission) {
        const timeSince = Date.now() - parseInt(lastSubmission);
        const remaining = RATE_LIMIT_COOLDOWN - timeSince;
        if (remaining > 0) {
          setCooldownRemaining(Math.ceil(remaining / 1000));
        } else {
          setCooldownRemaining(0);
        }
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check client-side cooldown
    const lastSubmission = localStorage.getItem(RATE_LIMIT_KEY);
    if (lastSubmission) {
      const timeSince = Date.now() - parseInt(lastSubmission);
      if (timeSince < RATE_LIMIT_COOLDOWN) {
        const remainingSeconds = Math.ceil((RATE_LIMIT_COOLDOWN - timeSince) / 1000);
        toast({
          title: "Please Wait",
          description: `You can submit another message in ${remainingSeconds} seconds.`,
          variant: "destructive",
        });
        return;
      }
    }
    
    // Validate form data
    try {
      contactSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) {
        // Handle rate limit errors specifically
        if (error.message?.includes("rate limit") || error.message?.includes("429")) {
          toast({
            title: "Rate Limit Exceeded",
            description: error.message || "Too many requests. Please try again later or contact me directly via email.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      // Store submission timestamp
      localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
      setCooldownRemaining(RATE_LIMIT_COOLDOWN / 1000);

      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. I'll get back to you soon!",
      });

      // Reset form
      setFormData({ name: "", email: "", inquiryType: "", subject: "", message: "", honeypot: "" });
    } catch (error: any) {
      // Log error without exposing sensitive details
      if (import.meta.env.DEV) {
        console.error("Error sending message:", error);
      }
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or contact me directly.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: "Location",
      value: "Available for Remote Work",
      href: null,
      color: "text-muted-foreground"
    }
  ];

  return (
    <section id="contact" className="section-padding bg-secondary/30">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Let's <span className="gradient-text">Connect</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ready to discuss your next product challenge? I'd love to hear about 
              your vision and explore how we can create something amazing together.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="slide-in-left">
              <Card className="card-elevated mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl">Get In Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg bg-muted/50 ${info.color}`}>
                        <info.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{info.label}</p>
                        {info.href ? (
                          <a
                            href={info.href}
                            target={info.href.startsWith("http") ? "_blank" : undefined}
                            rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="text-muted-foreground hover:text-primary transition-colors duration-300"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">{info.value}</p>
                        )}
                      </div>
                     </div>
                   ))}
                   
                   {/* Contact Actions inside the card */}
                   <div className="mt-8 pt-6 border-t border-border space-y-4">
                      <Button
                        variant="outline"
                        className="w-full text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6 border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent"
                        onClick={handleDownloadResume}
                        aria-label="Download Insha Kanue's resume"
                      >
                        <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" aria-hidden="true" />
                        Download Resume
                      </Button>
                     
                      <Button
                        className="btn-primary w-full text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6"
                        asChild
                      >
                        <a href="mailto:inshakanue@protonmail.com" aria-label="Send direct email to Insha Kanue">
                          <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" aria-hidden="true" />
                          Send Direct Email
                        </a>
                      </Button>
                      
                      {/* Visual Separator */}
                      <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">Social Media</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Column 1: LinkedIn and GitHub */}
                        <div className="space-y-4">
                          <Button
                            variant="outline"
                            className="w-full text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6 border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent"
                            asChild
                          >
                            <a href="https://linkedin.com/in/inshakanue" target="_blank" rel="noopener noreferrer" aria-label="Connect with Insha Kanue on LinkedIn">
                              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" aria-hidden="true" />
                              Connect on LinkedIn
                            </a>
                          </Button>
                          
                          <Button
                            variant="outline"
                            className="w-full text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6 border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent"
                            asChild
                          >
                            <a href="https://github.com/inshakanue" target="_blank" rel="noopener noreferrer" aria-label="View Insha Kanue's GitHub profile">
                              <Github className="w-4 h-4 sm:w-5 sm:h-5 mr-2" aria-hidden="true" />
                              View GitHub
                            </a>
                          </Button>
                        </div>
                        
                        {/* Column 2: X and Medium */}
                        <div className="space-y-4">
                          <Button
                            variant="outline"
                            className="w-full text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6 border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent"
                            asChild
                          >
                            <a href="https://x.com/inshakanue" target="_blank" rel="noopener noreferrer" aria-label="Follow Insha Kanue on X">
                              <Twitter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" aria-hidden="true" />
                              Follow on X
                            </a>
                          </Button>
                          
                          <Button
                            variant="outline"
                            className="w-full text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6 border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent"
                            asChild
                          >
                            <a href="https://medium.com/@inshakanue" target="_blank" rel="noopener noreferrer" aria-label="Read Insha Kanue on Medium">
                              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" aria-hidden="true" />
                              Read on Medium
                            </a>
                          </Button>
                        </div>
                      </div>
                   </div>
                 </CardContent>
               </Card>
             </div>

            {/* Contact Form */}
            <div className="slide-in-right">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-2xl">Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Honeypot field - hidden from users */}
                    <input
                      type="text"
                      name="honeypot"
                      value={formData.honeypot}
                      onChange={handleChange}
                      style={{ display: 'none' }}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                    />
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
                          Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
                          Email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="inquiryType" className="block text-sm font-medium mb-2 text-foreground">
                        Inquiry Type *
                      </label>
                      <Select
                        value={formData.inquiryType}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, inquiryType: value }))}
                      >
                        <SelectTrigger 
                          id="inquiryType"
                          className="w-full text-foreground data-[placeholder]:text-muted-foreground"
                          aria-label="Select inquiry type"
                        >
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Job Opportunity">Job Opportunity</SelectItem>
                          <SelectItem value="Contract / Freelance Work">Contract / Freelance Work</SelectItem>
                          <SelectItem value="Consulting Services">Consulting Services</SelectItem>
                          <SelectItem value="Partnership & Collaboration">Partnership & Collaboration</SelectItem>
                          <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2 text-foreground">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="What would you like to discuss?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full min-h-[120px]"
                        placeholder="Tell me about your project, challenge, or opportunity..."
                      />
                    </div>

                    {cooldownRemaining > 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        <Clock className="w-4 h-4" />
                        <span>Please wait {cooldownRemaining} seconds before submitting again</span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="btn-primary w-full text-lg py-6"
                      disabled={isLoading || cooldownRemaining > 0}
                      aria-label={isLoading ? "Sending message" : cooldownRemaining > 0 ? `Wait ${cooldownRemaining} seconds to send message` : "Send message"}
                    >
                      <Send className="w-5 h-5 mr-2" aria-hidden="true" />
                      {isLoading ? "Sending..." : cooldownRemaining > 0 ? `Wait ${cooldownRemaining}s` : "Send Message"}
                    </Button>
                    
                    {cooldownRemaining > 0 && (
                      <p className="text-xs text-center text-muted-foreground">
                        Need urgent help? <a href="mailto:inshakanue@protonmail.com" className="text-primary hover:underline">Email me directly</a>
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;