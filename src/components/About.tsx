import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Lightbulb, Target } from "lucide-react";

const About = () => {
  const highlights = [
    {
      icon: TrendingUp,
      title: "Revenue Impact",
      description: "Generated €15M+ in revenue through data-driven product strategies",
      color: "text-success"
    },
    {
      icon: Users,
      title: "Team Leadership",
      description: "Led cross-functional teams across multiple time zones and cultures",
      color: "text-primary"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Launched 10+ products from concept to market, including AI/ML solutions",
      color: "text-accent"
    },
    {
      icon: Target,
      title: "Optimization",
      description: "Achieved 96.7% optimization in lead generation and 70% fraud reduction",
      color: "text-primary-light"
    }
  ];

  const expertise = [
    "Product Strategy & Roadmapping",
    "Data Analytics & AI/ML",
    "Cross-functional Leadership",
    "Market Research & Validation",
    "Agile Methodologies",
    "Revenue Optimization",
    "Digital Transformation",
    "Stakeholder Management"
  ];

  return (
    <section id="about" className="section-padding">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              An AI Product Manager specializing in building intelligent systems and machine learning solutions 
              that transform business operations, driving millions in revenue growth through strategic implementation 
              of AI-powered products and cross-functional team leadership.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Text Content */}
            <div className="slide-in-left">
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                Transforming Businesses Through Strategic Product Leadership
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  With over 7 years of experience in product management, I specialize in building 
                  scalable solutions that bridge the gap between complex technical capabilities 
                  and real-world business needs.
                </p>
                <p className="text-lg leading-relaxed">
                  My journey spans from being a front-end developer to founding my own IoT startup, 
                  and eventually leading product initiatives at global companies like HRS Group, 
                  where I've consistently delivered products that generate millions in revenue.
                </p>
                <p className="text-lg leading-relaxed">
                  I thrive in ambiguous environments, turning data into actionable insights and 
                  collaborating with diverse teams to bring innovative solutions to market.
                </p>
              </div>
            </div>

            {/* Highlights Grid */}
            <div className="slide-in-right">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {highlights.map((highlight, index) => (
                  <Card key={index} className="card-elevated">
                    <CardContent className="p-6 text-center">
                      <highlight.icon className={`w-8 h-8 mx-auto mb-4 ${highlight.color}`} />
                      <h4 className="font-semibold mb-2 text-foreground">{highlight.title}</h4>
                      <p className="text-sm text-muted-foreground">{highlight.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Expertise */}
          <div className="fade-in-up">
            <h3 className="text-2xl font-bold text-center mb-8">Core Expertise</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {expertise.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-sm py-2 px-4 bg-secondary/50 text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;