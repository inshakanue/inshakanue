import { Mail, Linkedin, ArrowUp, Twitter, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSectionClick = (sectionId: string) => {
    if (isHomePage) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom">
        <div className="py-12">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Logo and Description */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Insha Kanue</h3>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                AI Product Manager.<br />
                Transforming ideas into successful products.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <div className="flex flex-col space-y-2 text-sm">
                <button
                  onClick={() => handleSectionClick("about")}
                  className="text-left text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
                >
                  About
                </button>
                <button
                  onClick={() => handleSectionClick("experience")}
                  className="text-left text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
                >
                  Experience
                </button>
                <button
                  onClick={() => handleSectionClick("skills")}
                  className="text-left text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
                >
                  Skills
                </button>
                <Link
                  to="/blog"
                  className="text-left text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
                >
                  Blog
                </Link>
                <button
                  onClick={() => handleSectionClick("contact")}
                  className="text-left text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
                >
                  Contact
                </button>
              </div>
            </div>

            {/* Social Links and Back to Top */}
            <div className="space-y-4">
              <h4 className="font-semibold">Connect</h4>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <a href="mailto:inshakanue@protonmail.com">
                    <Mail className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <a href="https://linkedin.com/in/inshakanue" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <a href="https://github.com/inshakanue" target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <a href="https://x.com/inshakanue" target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={scrollToTop}
                  className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 ml-auto"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <div className="flex items-center gap-2">
              <p>© {currentYear} Insha Kanue. All rights reserved.</p>
              <Link 
                to="/blog?admin=true" 
                className="text-primary-foreground/30 hover:text-primary-foreground/60 transition-colors"
              >
                •
              </Link>
            </div>
            <p>Built with passion for great product experiences.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;