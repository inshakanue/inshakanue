import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Download, Mail, Linkedin, Twitter, Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useAdminStatus } from "@/hooks/useAdminStatus";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { isAdmin } = useAdminStatus();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isHomePage = location.pathname === "/";
  
  // Check if we should show admin controls
  const urlParams = new URLSearchParams(window.location.search);
  const showAdminControls = location.pathname.includes('/admin') || 
                            location.pathname.includes('/auth') ||
                            urlParams.get('admin') === 'true' ||
                            (user && isAdmin);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
    });
    navigate("/");
  };

  const handleNavigation = (href: string) => {
    setIsMobileMenuOpen(false);
    
    if (href.startsWith("/")) {
      // It's a page link
      navigate(href);
    } else {
      // It's a section link on homepage
      if (!isHomePage) {
        navigate("/");
        setTimeout(() => {
          const element = document.getElementById(href);
          element?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const element = document.getElementById(href);
        element?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const navItems = [
    { label: "About", href: "about" },
    { label: "Experience", href: "experience" },
    { label: "Skills", href: "skills" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-soft border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="container-custom" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl lg:text-2xl font-bold gradient-text hover:scale-105 transition-transform duration-300"
            aria-label="Home"
          >
            IK
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium"
                aria-label={`Navigate to ${item.label}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
              asChild
            >
              <a href="mailto:inshakanue@protonmail.com" aria-label="Send email">
                <Mail className="w-4 h-4" aria-hidden="true" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
              asChild
            >
              <a href="https://linkedin.com/in/inshakanue" target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn">
                <Linkedin className="w-4 h-4" aria-hidden="true" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
              asChild
            >
              <a href="https://github.com/inshakanue" target="_blank" rel="noopener noreferrer" aria-label="View GitHub profile">
                <Github className="w-4 h-4" aria-hidden="true" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
              asChild
            >
              <a href="https://x.com/inshakanue" target="_blank" rel="noopener noreferrer" aria-label="Follow on X">
                <Twitter className="w-4 h-4" aria-hidden="true" />
              </a>
            </Button>
            {showAdminControls && (
              <>
                {user ? (
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/auth">Login</Link>
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border">
            <div className="py-4 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className="block w-full text-left px-4 py-2 text-muted-foreground hover:text-primary transition-colors duration-300"
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col items-stretch pt-4 border-t border-border space-y-2">
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary"
                    asChild
                  >
                    <a href="mailto:inshakanue@protonmail.com" aria-label="Send email">
                      <Mail className="w-4 h-4" aria-hidden="true" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary"
                    asChild
                  >
                    <a href="https://linkedin.com/in/inshakanue" target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn">
                      <Linkedin className="w-4 h-4" aria-hidden="true" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary"
                    asChild
                  >
                    <a href="https://github.com/inshakanue" target="_blank" rel="noopener noreferrer" aria-label="View GitHub profile">
                      <Github className="w-4 h-4" aria-hidden="true" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary"
                    asChild
                  >
                    <a href="https://x.com/inshakanue" target="_blank" rel="noopener noreferrer" aria-label="Follow on X">
                      <Twitter className="w-4 h-4" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
                {showAdminControls && (
                  <>
                    {user ? (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        Logout
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        asChild
                        className="w-full"
                      >
                        <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;