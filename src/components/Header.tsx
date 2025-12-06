/**
 * HEADER NAVIGATION COMPONENT
 * 
 * BUSINESS CONTEXT:
 * Primary navigation for the portfolio site, providing access to all sections
 * and social links. The header serves as the persistent navigation layer that
 * helps visitors explore content and connect through multiple channels.
 * 
 * KEY BUSINESS OBJECTIVES:
 * 1. Guide visitors through the portfolio journey (About → Experience → Skills → Contact)
 * 2. Provide quick access to social profiles for professional networking
 * 3. Enable admin authentication for blog management (hidden from regular visitors)
 * 4. Maintain visibility through scroll with backdrop blur effect
 * 
 * TECHNICAL IMPLEMENTATION:
 * - Sticky header with scroll-based transparency changes
 * - Responsive mobile menu with hamburger toggle
 * - Smart section scrolling for homepage, page navigation for other routes
 * - Supabase authentication state management
 * - Admin controls appear only when authenticated or on admin routes
 * 
 * USER EXPERIENCE:
 * - Smooth transitions and animations for professional feel
 * - Clear visual feedback for hover states
 * - Mobile-first responsive design
 * - Accessible ARIA labels for screen readers
 * 
 * PERFORMANCE:
 * - Authentication state cached to avoid redundant API calls
 * - Conditional rendering of admin controls reduces DOM complexity
 * - Efficient scroll listener with proper cleanup
 */

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Download, Mail, Linkedin, Twitter, Github, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useAdminStatus } from "@/hooks/useAdminStatus";

const Header = () => {
  // STATE MANAGEMENT
  // Track scroll position to apply backdrop blur effect for readability
  const [isScrolled, setIsScrolled] = useState(false);           // Tracks if user scrolled past 50px
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu visibility
  const [user, setUser] = useState<User | null>(null);             // Current authenticated user
  const { isAdmin } = useAdminStatus();                             // Check if user has admin privileges
  const location = useLocation();                                   // Current route
  const navigate = useNavigate();                                   // Programmatic navigation
  const { toast } = useToast();                                     // Toast notification system
  const isHomePage = location.pathname === "/";                     // Check if on homepage
  
  /**
   * ADMIN CONTROLS VISIBILITY LOGIC
   * Shows login/logout buttons when:
   * 1. User is on admin routes (/admin)
   * 2. User is on auth page (/auth)
   * 3. URL has ?admin=true parameter (for easy access)
   * 4. User is authenticated AND has admin role
   * 
   * BUSINESS REASON: Keep admin interface hidden from regular visitors
   * while providing easy access for content management tasks.
   */
  const urlParams = new URLSearchParams(window.location.search);
  const showAdminControls = location.pathname.includes('/admin') || 
                            location.pathname.includes('/auth') ||
                            urlParams.get('admin') === 'true' ||
                            (user && isAdmin);

  /**
   * SCROLL EFFECT
   * Applies backdrop blur and shadow after 50px scroll for better
   * text readability while maintaining visual hierarchy.
   */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * AUTHENTICATION STATE MANAGEMENT
   * 
   * WHY: Maintains real-time auth state across the application
   * - Fetches current session on mount
   * - Subscribes to auth state changes (login, logout, token refresh)
   * - Cleanup subscription to prevent memory leaks
   * 
   * BUSINESS VALUE: Enables admin blog management with proper security
   */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * LOGOUT HANDLER
   * Clears authentication session and redirects to homepage
   * with success notification.
   */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
    });
    navigate("/");
  };

  /**
   * NAVIGATION HANDLER
   * 
   * SMART ROUTING LOGIC:
   * - If href starts with "/": Navigate to different page (e.g., /blog)
   * - If href is a section ID: Smooth scroll on homepage OR navigate to homepage first
   * 
   * WHY: Provides seamless navigation experience whether user is on homepage
   * or blog pages, always getting to the right content smoothly.
   */
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
            className="text-lg md:text-xl lg:text-2xl font-bold gradient-text hover:scale-105 transition-transform duration-300"
            aria-label="Home"
          >
            Insha Kanue
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
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
            
            {/* Blog - Direct link */}
            <button
              onClick={() => handleNavigation("/blog")}
              className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium"
              aria-label="Navigate to Blog"
            >
              Blog
            </button>
            
            {/* Dashboard link for admins only */}
            {isAdmin && (
              <button
                onClick={() => handleNavigation("/blog/dashboard")}
                className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium"
                aria-label="Navigate to Dashboard"
              >
                Dashboard
              </button>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
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
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
              asChild
            >
              <a href="https://medium.com/@inshakanue" target="_blank" rel="noopener noreferrer" aria-label="Read on Medium">
                <BookOpen className="w-4 h-4" aria-hidden="true" />
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

          {/* Mobile/Tablet Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" /> : <Menu className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />}
          </Button>
        </div>

        {/* Mobile/Tablet Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border">
            <div className="py-4 md:py-6 space-y-3 md:space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className="block w-full text-left px-4 md:px-6 py-2 md:py-3 text-base md:text-lg text-muted-foreground hover:text-primary transition-colors duration-300"
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Blog - Direct link */}
              <button
                onClick={() => handleNavigation("/blog")}
                className="block w-full text-left px-4 md:px-6 py-2 md:py-3 text-base md:text-lg text-muted-foreground hover:text-primary transition-colors duration-300"
                aria-label="Navigate to Blog"
              >
                Blog
              </button>
              
              {/* Dashboard link for admins only */}
              {isAdmin && (
                <button
                  onClick={() => handleNavigation("/blog/dashboard")}
                  className="block w-full text-left px-4 md:px-6 py-2 md:py-3 text-base md:text-lg text-muted-foreground hover:text-primary transition-colors duration-300"
                  aria-label="Navigate to Dashboard"
                >
                  Dashboard
                </button>
              )}
              <div className="flex flex-col items-stretch pt-4 md:pt-6 border-t border-border space-y-2">
                <div className="flex items-center justify-center space-x-4 md:space-x-6">
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary"
                    asChild
                  >
                    <a href="https://medium.com/@inshakanue" target="_blank" rel="noopener noreferrer" aria-label="Read on Medium">
                      <BookOpen className="w-4 h-4" aria-hidden="true" />
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