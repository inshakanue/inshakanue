import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Linkedin, 
  MapPin, 
  Download,
  Twitter,
  Github,
  BookOpen
} from "lucide-react";

const Contact = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="embed.typeform.com"]');
    
    if (existingScript) {
      // Script already loaded, just reinitialize
      if ((window as any).tf?.load) {
        (window as any).tf.load();
      }
      return;
    }

    // Load Typeform embed script
    const script = document.createElement('script');
    script.src = '//embed.typeform.com/next/embed.js';
    script.async = true;
    
    // When script loads, trigger Typeform to scan for embeds
    script.onload = () => {
      if ((window as any).tf?.load) {
        (window as any).tf.load();
      }
    };
    
    document.body.appendChild(script);

    return () => {
      // Cleanup - don't remove script as it might be needed elsewhere
    };
  }, []);

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
                <CardContent className="p-0">
                  <div 
                    data-tf-widget="01KB8CWMZ3CHN9SQ87DX3GTVHR"
                    data-tf-inline-on-mobile
                    data-tf-medium="snippet"
                    style={{ width: '100%', height: '600px' }}
                    className="rounded-lg"
                  />
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