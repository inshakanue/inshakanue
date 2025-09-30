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
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Simplified animations */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-primary/40 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Readability overlays */}
      <div className="absolute inset-0 z-0 bg-background/70"></div>
      <div className="absolute inset-0 z-20 bg-background/60 backdrop-blur-sm pointer-events-none"></div>
      
      <div className="container-custom relative z-30 px-4">
        <div className="max-w-4xl mx-auto text-center rounded-xl md:rounded-2xl bg-background/50 backdrop-blur-md border border-border/50 shadow-strong p-6 sm:p-8 md:p-10 lg:p-12">
          {/* Main Heading */}
          <div className="fade-in-up">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4 md:mb-6 px-2">
              <span className="text-foreground whitespace-nowrap">Salaam, I'm </span>
              <span className="gradient-text whitespace-nowrap">Insha Kanue</span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className="fade-in-up animate-delay-100">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground font-medium mb-6 md:mb-8">
              AI Product Manager
            </h2>
          </div>

          {/* Description */}
          <div className="fade-in-up animate-delay-200">
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed px-2">
              7+ years of experience building AI-powered products and machine learning solutions, 
              leading cross-functional teams to implement intelligent systems that drive millions in revenue growth.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="fade-in-up animate-delay-300">
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-stretch sm:items-center mb-12 md:mb-16">
              <Button
                size="lg"
                className="btn-primary text-base md:text-lg px-6 md:px-8 py-5 md:py-6 w-full sm:w-auto"
                onClick={() => scrollToSection("contact")}
              >
                <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Get In Touch
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary w-full sm:w-auto"
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
              className="inline-flex flex-col items-center space-y-1 md:space-y-2 text-muted-foreground hover:text-primary transition-colors duration-300 animate-float"
            >
              <span className="text-xs sm:text-sm font-medium">Scroll to explore</span>
              <ArrowDown className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;