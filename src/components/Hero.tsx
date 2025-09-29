import { Button } from "@/components/ui/button";
import { ArrowDown, Download, Mail } from "lucide-react";
import heroBackground from "@/assets/ai-hero-background.jpg";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      id="hero" 
      className="min-h-screen flex items-center justify-center section-padding relative overflow-hidden"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
        
        {/* Data Flow Lines */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-pulse"
              style={{
                width: `${200 + Math.random() * 300}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        
        {/* Neural Network Nodes */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 border-2 border-primary/40 rounded-full animate-pulse"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${1.5 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        
        {/* Geometric Shapes */}
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-8 h-8 border border-accent/30 rotate-45 animate-spin"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${10 + Math.random() * 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Background overlay for text readability */}
      <div className="absolute inset-0 bg-background/85 backdrop-blur-sm"></div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="fade-in-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-foreground">Salaam, I'm </span>
              <span className="gradient-text">Insha Kanue</span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className="fade-in-up animate-delay-100">
            <h2 className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-medium mb-8">
              AI Product Manager
            </h2>
          </div>

          {/* Description */}
          <div className="fade-in-up animate-delay-200">
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              7+ years of experience building AI-powered products and machine learning solutions, 
              leading cross-functional teams to implement intelligent systems that drive millions in revenue growth.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="fade-in-up animate-delay-300">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                className="btn-primary text-lg px-8 py-6"
                onClick={() => scrollToSection("contact")}
              >
                <Mail className="w-5 h-5 mr-2" />
                Get In Touch
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                onClick={() => scrollToSection("experience")}
              >
                View My Work
              </Button>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="fade-in-up animate-delay-300">
            <button
              onClick={() => scrollToSection("about")}
              className="inline-flex flex-col items-center space-y-2 text-muted-foreground hover:text-primary transition-colors duration-300 animate-float"
            >
              <span className="text-sm font-medium">Scroll to explore</span>
              <ArrowDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;