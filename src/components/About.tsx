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
    "AI Product Strategy & Roadmapping",
    "Data Strategy & Governance",
    "LLM Integration & Prompt Engineering",
    "ML Lifecycle & MLOps",
    "Experimentation & A/B Testing",
    "Product Analytics & Measurement",
    "Responsible AI & Ethics",
    "Data Pipeline & Feature Engineering"
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
              An AI Product Manager with 7+ years of experience building intelligent systems that drive measurable business impact. 
              From launching data platforms enabling AI use cases to deploying ML-powered solutions for fraud detection, sentiment analysis, 
              and recommendation engines—I've led cross-functional teams to deliver products that generated €15M+ in revenue growth 
              and transformed operational efficiency for global organizations.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Text Content */}
            <div className="slide-in-left">
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                Building AI-Powered Products That Deliver Measurable Business Impact
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  With 7+ years specializing in AI Product Management, I've built and deployed intelligent systems 
                  that transform how global organizations operate. From launching Datahub—a scalable data ingestion 
                  platform that reduced onboarding time by 40% and enabled AI use cases driving 15% revenue growth—to 
                  deploying machine learning solutions for fraud detection, sentiment analysis, and recommendation engines.
                </p>
                <p className="text-lg leading-relaxed">
                  My journey from front-end developer to founding an IoT startup with predictive analytics, to leading 
                  AI product initiatives at HRS Group and Hypha.cc, has given me unique insight into the full AI product 
                  lifecycle. I've consistently delivered ML-powered products that generated €15M+ in revenue while 
                  achieving measurable improvements: 70% fraud reduction, 96.7% lead generation optimization, and 95% 
                  enhancement in operational performance.
                </p>
                <p className="text-lg leading-relaxed">
                  I excel at translating complex AI capabilities into business value, collaborating with data scientists, 
                  engineers, and stakeholders to bring intelligent products from prototype to production scale across 
                  diverse industries—from travel tech to agriculture to knowledge management.
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