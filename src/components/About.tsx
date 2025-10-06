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
      title: "Product launches",
      description: "Shipped 10+ AI and ML products from concept to market",
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
    "AI Product Strategy & Roadmapping",
    "Data Strategy & Governance",
    "LLM Integration & Prompt Engineering",
    "ML Lifecycle & MLOps",
    "Experimentation & A/B Testing",
    "Product Analytics & Measurement",
    "Responsible AI & Ethics",
    "Market Research and Validation",
    "Cross-functional Team Leadership",
    "Revenue Optimization",
    "Stakeholder Management"
  ];

  return (
    <section id="about" className="section-padding" aria-labelledby="about-heading">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <header className="text-center mb-16">
            <h2 id="about-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              I build AI products for a living. Over 7 years, I've shipped data platforms, fraud detection systems, 
              and recommendation engines. The products I've led generated €15M+ in revenue for companies across travel, 
              agriculture, and knowledge management. I work with data scientists, engineers, and business teams to turn 
              ML models into products that scale.
            </p>
          </header>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Text Content */}
            <article className="slide-in-left">
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                How I build AI products that make money
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  I've spent 7 years building AI products. I launched Datahub, a data ingestion platform that cut 
                  onboarding time by 40%. It enabled AI features that grew revenue by 15%. I've also shipped ML 
                  solutions for fraud detection, sentiment analysis, and recommendation systems.
                </p>
                <p className="text-lg leading-relaxed">
                  I started as a front-end developer. Then I founded an IoT startup using predictive analytics. 
                  Now I lead AI product work at HRS Group and Hypha.cc. My products have generated €15M+ in revenue. 
                  The results: 70% less fraud, 96.7% better lead generation, 95% stronger operations.
                </p>
                <p className="text-lg leading-relaxed">
                  I work with data scientists, engineers, and business leaders. Together we take AI from prototype 
                  to production. I've done this across travel tech, agriculture, and knowledge management. The key 
                  is turning technical capability into products people pay for.
                </p>
              </div>
            </article>

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
          <aside className="fade-in-up" aria-labelledby="expertise-heading">
            <h3 id="expertise-heading" className="text-2xl font-bold text-center mb-8">Core Expertise</h3>
            <div className="flex flex-wrap justify-center gap-3" role="list">
              {expertise.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-sm py-2 px-4 bg-secondary/50 text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                  role="listitem"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default About;