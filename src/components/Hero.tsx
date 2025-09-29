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
      {/* Background overlay for text readability */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      
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