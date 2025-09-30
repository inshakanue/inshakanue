import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Linkedin, 
  MapPin, 
  Send, 
  Download,
  Calendar,
  Twitter,
  Github
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create mailto link with form data
    const mailtoLink = `mailto:inshakanue@protonmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Hi Insha,\n\nMy name is ${formData.name}.\n\n${formData.message}\n\nBest regards,\n${formData.name}\n${formData.email}`
    )}`;
    
    window.location.href = mailtoLink;
    
    toast({
      title: "Email client opened",
      description: "Your default email client should open with the message pre-filled.",
    });

    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
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
                       className="btn-primary w-full text-lg py-6"
                       asChild
                     >
                       <a href="mailto:inshakanue@protonmail.com">
                         <Mail className="w-5 h-5 mr-2" />
                         Send Direct Email
                       </a>
                     </Button>
                     
                     <Button
                       variant="outline"
                       className="w-full text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6 border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent"
                       asChild
                     >
                       <a href="https://linkedin.com/in/inshakanue" target="_blank" rel="noopener noreferrer">
                         <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                         Connect on LinkedIn
                       </a>
                     </Button>
                     
                      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
                        <Button
                          variant="outline"
                          className="text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6 border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent"
                          asChild
                        >
                          <a href="https://github.com/inshakanue" target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            View GitHub
                          </a>
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6 border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent"
                          asChild
                        >
                          <a href="https://x.com/inshakanue" target="_blank" rel="noopener noreferrer">
                            <Twitter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Follow on X
                          </a>
                        </Button>
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

                    <Button
                      type="submit"
                      className="btn-primary w-full text-lg py-6"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
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