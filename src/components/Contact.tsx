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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Mail, 
  Linkedin, 
  MapPin, 
  Send, 
  Download,
  Twitter,
  Github,
  BookOpen,
  Loader2
} from "lucide-react";

// Inline tracking functions to avoid import issues
const trackResumeDownload = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("resume_downloads").insert({
      user_id: user?.id || null,
      user_agent: navigator.userAgent,
    });
  } catch (error) {
    console.error("Error tracking resume download:", error);
  }
};

const trackResumePreview = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("resume_previews").insert({
      user_id: user?.id || null,
      user_agent: navigator.userAgent,
    });
  } catch (error) {
    console.error("Error tracking resume preview:", error);
  }
};

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  inquiryType: z.string().min(1, "Please select an inquiry type"),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject must be less than 200 characters"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
  honeypot: z.string().max(0, "Invalid submission")
});

const RATE_LIMIT_COOLDOWN = 60 * 1000;
const RATE_LIMIT_KEY = "contact_form_last_submission";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "",
    subject: "",
    message: "",
    honeypot: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [isResumePreviewOpen, setIsResumePreviewOpen] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(true);
  const { toast } = useToast();

  const handleDownloadResume = async () => {
    try {
      trackResumeDownload();
      const response = await fetch('/InshaKanue_ProductManager_Resume.pdf');
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
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) {
        if (error.message?.includes("rate limit") || error.message?.includes("429")) {
          toast({
            title: "Rate Limit Exceeded",
            description: error.message || "Too many requests. Please try again later.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
      setCooldownRemaining(RATE_LIMIT_COOLDOWN / 1000);

      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. I'll get back to you soon!",
      });

      setFormData({ name: "", email: "", inquiryType: "", subject: "", message: "", honeypot: "" });
    } catch (error) {
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

  return (
    <section id="contact" className="section-padding bg-secondary/30">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
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
            <div className="slide-in-left">
              <Card className="card-elevated mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl">Get In Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-muted/50 text-muted-foreground">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Location</p>
                      <p className="text-muted-foreground">Available for Remote Work</p>
                    </div>
                  </div>
                   
                  <div className="mt-8 pt-6 border-t border-border space-y-4">
                    <Button
                      variant="outline"
                      className="w-full text-sm sm:text-base py-4 sm:py-5 border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent"
                      onClick={() => {
                        setIsResumePreviewOpen(true);
                        setIsPdfLoading(true);
                        trackResumePreview();
                      }}
                    >
                      <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Download Resume
                    </Button>
                 
                    <Button className="btn-primary w-full text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6" asChild>
                      <a href="mailto:inshakanue@protonmail.com">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Send Direct Email
                      </a>
                    </Button>
                    
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Social Media</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <Button variant="outline" className="w-full text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6 border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent" asChild>
                          <a href="https://linkedin.com/in/inshakanue" target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Connect on LinkedIn
                          </a>
                        </Button>
                        
                        <Button variant="outline" className="w-full text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6 border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent" asChild>
                          <a href="https://github.com/inshakanue" target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            View GitHub
                          </a>
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <Button variant="outline" className="w-full text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6 border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent" asChild>
                          <a href="https://x.com/inshakanue" target="_blank" rel="noopener noreferrer">
                            <Twitter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Follow on X
                          </a>
                        </Button>
                        
                        <Button variant="outline" className="w-full text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6 border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent" asChild>
                          <a href="https://medium.com/@inshakanue" target="_blank" rel="noopener noreferrer">
                            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Read on Medium
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="slide-in-right">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-2xl">Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                      type="text"
                      name="honeypot"
                      value={formData.honeypot}
                      onChange={handleChange}
                      style={{ display: 'none' }}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">Name *</label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">Email *</label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="inquiryType" className="block text-sm font-medium mb-2 text-foreground">Inquiry Type *</label>
                      <Select
                        value={formData.inquiryType}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, inquiryType: value }))}
                      >
                        <SelectTrigger id="inquiryType" className="w-full">
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
                      <label htmlFor="subject" className="block text-sm font-medium mb-2 text-foreground">Subject *</label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Brief subject line"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">Message *</label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell me about your project or inquiry..."
                        rows={5}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="btn-primary w-full py-6 text-lg"
                      disabled={isLoading || cooldownRemaining > 0}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : cooldownRemaining > 0 ? (
                        `Wait ${cooldownRemaining}s`
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog 
        open={isResumePreviewOpen} 
        onOpenChange={(open) => {
          setIsResumePreviewOpen(open);
          if (open) setIsPdfLoading(true);
        }}
      >
        <DialogContent className="max-w-4xl w-[95vw] h-[85vh] !flex !flex-col p-6">
          <DialogHeader className="shrink-0 pb-4">
            <DialogTitle className="flex items-center justify-between pr-8">
              <span>Resume Preview</span>
              <Button variant="default" size="sm" onClick={handleDownloadResume}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden rounded-lg border border-border relative">
            {isPdfLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading resume...</p>
                </div>
              </div>
            )}
            <iframe
              src="/InshaKanue_ProductManager_Resume.pdf#toolbar=1&navpanes=0&view=FitH"
              className="w-full h-full"
              title="Insha Kanue Resume Preview"
              style={{ minHeight: '500px' }}
              onLoad={() => setIsPdfLoading(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Contact;
