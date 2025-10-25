import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Lightbulb, Target } from "lucide-react";
const About = () => {
  const highlights = [{
    icon: TrendingUp,
    title: "Revenue Impact",
    description: "Generated €15M+ in revenue through data-driven product strategies",
    color: "text-success"
  }, {
    icon: Users,
    title: "Team Leadership",
    description: "Led cross-functional teams across multiple time zones and cultures",
    color: "text-primary"
  }, {
    icon: Lightbulb,
    title: "Product launches",
    description: "Shipped 10+ AI and ML products from concept to market",
    color: "text-accent"
  }, {
    icon: Target,
    title: "Optimization",
    description: "Achieved 96.7% optimization in lead generation and 70% fraud reduction",
    color: "text-primary-light"
  }];
  const expertise = ["AI Product Strategy & Roadmapping", "Data Strategy & Governance", "LLM Integration & Prompt Engineering", "ML Lifecycle & MLOps", "Experimentation & A/B Testing", "Product Analytics & Measurement", "Responsible AI & Ethics", "Market Research and Validation", "Cross-functional Team Leadership", "Revenue Optimization", "Stakeholder Management"];
  return <section id="about" className="section-padding" aria-labelledby="about-heading">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <header className="text-center mb-16">
            <h2 id="about-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">AI Product Manager with 7+ years building machine learning products. I have shipped data platforms, fraud detection systems, and recommendation engines that generated €15M+ in revenue. As an AI Product Manager, I bridge data science and business, turning ML models into products that scale across travel tech, logistics, agriculture, and knowledge management.</p>
          </header>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Text Content */}
            <article className="slide-in-left">
              <h3 className="text-2xl font-bold mb-6 text-foreground">AI Product Manager Building Machine Learning Products That Scale</h3>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  As an AI Product Manager with 7 years of experience, I have built and launched machine learning 
                  products from concept to production. My work includes AI-powered data platforms, fraud detection 
                  systems using ML algorithms, sentiment analysis tools, and recommendation engines. At HRS Group, 
                  I launched Datahub, an AI data ingestion platform that reduced onboarding time by 40% and enabled 
                  AI features generating 15% revenue growth.
                </p>
                <p className="text-lg leading-relaxed">My journey as an AI Product Manager began as a developer, then founding an IoT startup using predictive analytics and machine learning. Now I lead AI/ML product strategy at HRS Group where my AI products have generated €15M+ in revenue with measurable impact: 70% fraud reduction, 96.7% optimization in lead generation, and 95% operational improvements through AI automation.</p>
                <p className="text-lg leading-relaxed">As an AI Product Manager, I collaborate with data scientists, ML engineers, and business stakeholders to transform machine learning models into scalable products. My AI product management experience spans travel technology, logistics, agriculture, and knowledge management. The key to successful AI Product Management is converting technical ML capabilities into products that deliver business value and revenue growth.</p>
              </div>
            </article>

            {/* Highlights Grid */}
            <div className="slide-in-right">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {highlights.map((highlight, index) => <Card key={index} className="card-elevated">
                    <CardContent className="p-6 text-center">
                      <highlight.icon className={`w-8 h-8 mx-auto mb-4 ${highlight.color}`} />
                      <h4 className="font-semibold mb-2 text-foreground">{highlight.title}</h4>
                      <p className="text-sm text-muted-foreground">{highlight.description}</p>
                    </CardContent>
                  </Card>)}
              </div>
            </div>
          </div>

          {/* Expertise */}
          <aside className="fade-in-up" aria-labelledby="expertise-heading">
            <h3 id="expertise-heading" className="text-2xl font-bold text-center mb-8">Core Expertise</h3>
            <ul className="flex flex-wrap justify-center gap-3 list-none">
              {expertise.map((skill, index) => (
                <li key={index}>
                  <Badge variant="secondary" className="text-sm py-2 px-4 bg-secondary/50 text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
                    {skill}
                  </Badge>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>;
};
export default About;