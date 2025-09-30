import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Brain, 
  Users, 
  Code, 
  Lightbulb,
  Target,
  Zap,
  Star
} from "lucide-react";

const Skills = () => {
  // Convert percentage to star rating (out of 5)
  const getStarRating = (level: number) => {
    return Math.round((level / 100) * 5 * 2) / 2; // Rounds to nearest 0.5
  };

  // Get skill level description
  const getSkillLevel = (level: number): { text: string; colorClass: string } => {
    if (level >= 90) return { text: "Expert", colorClass: "bg-success/10 text-success border-success/20" };
    if (level >= 85) return { text: "Advanced", colorClass: "bg-primary/10 text-primary border-primary/20" };
    if (level >= 80) return { text: "Proficient", colorClass: "bg-accent/10 text-accent border-accent/20" };
    return { text: "Intermediate", colorClass: "bg-muted text-muted-foreground border-border" };
  };

  // Render stars
  const renderStars = (level: number) => {
    const rating = getStarRating(level);
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <Star key={i} className="w-4 h-4 text-primary transition-all duration-300" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-muted-foreground transition-all duration-300" />
        );
      }
    }
    
    return <div className="flex gap-1">{stars}</div>;
  };
  const skillCategories = [
    {
      title: "Product Management",
      icon: Target,
      color: "text-primary",
      skills: [
        { name: "Product Strategy & Roadmapping", level: 95 },
        { name: "Market Research & Validation", level: 90 },
        { name: "Agile & Scrum Methodologies", level: 92 },
        { name: "Stakeholder Management", level: 88 },
        { name: "Go-to-Market Strategy", level: 85 }
      ]
    },
    {
      title: "Data & Analytics",
      icon: BarChart3,
      color: "text-accent",
      skills: [
        { name: "Data Strategy & Governance", level: 90 },
        { name: "ML Model Evaluation & Metrics", level: 85 },
        { name: "A/B Testing & Experimentation", level: 88 },
        { name: "Data Pipeline Management", level: 82 },
        { name: "Predictive Analytics & Forecasting", level: 80 }
      ]
    },
    {
      title: "AI/ML Product Development",
      icon: Brain,
      color: "text-success",
      skills: [
        { name: "AI Product Strategy & Roadmapping", level: 90 },
        { name: "LLM Integration & Prompt Engineering", level: 85 },
        { name: "ML Model Lifecycle Management", level: 82 },
        { name: "AI Ethics & Responsible AI", level: 88 },
        { name: "Feature Engineering & Data Labeling", level: 80 }
      ]
    },
    {
      title: "Leadership & Communication",
      icon: Users,
      color: "text-primary-light",
      skills: [
        { name: "Cross-functional Team Leadership", level: 95 },
        { name: "Strategic Communication", level: 90 },
        { name: "Change Management", level: 88 },
        { name: "Mentoring & Coaching", level: 85 },
        { name: "Executive Presentations", level: 87 }
      ]
    }
  ];

  const tools = [
    "Python", "SQL", "Power BI", "AWS", "Postman", "Jira", 
    "Confluence", "Miro", "Figma", "Google Analytics", "Mixpanel", 
    "Lovable", "Bolt", "Git", "Cursor"
  ];

  const certifications = [
    "Product Discovery Micro-Certification (PDC)™️ - Product School",
    "Product Prioritization Micro-Certification (PPC)™️ - Product School"
  ];

  return (
    <section id="skills" className="section-padding">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Skills & <span className="gradient-text">Expertise</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A comprehensive skill set spanning product management, technology, 
              and leadership developed through hands-on experience and continuous learning.
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {skillCategories.map((category, index) => (
              <Card 
                key={index} 
                className="card-elevated fade-in-up" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <category.icon className={`w-6 h-6 ${category.color}`} />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {category.skills.map((skill, idx) => {
                    const skillLevel = getSkillLevel(skill.level);
                    return (
                      <div key={idx} className="space-y-2 group">
                        <div className="flex justify-between items-start gap-3">
                          <span className="text-sm font-medium text-foreground flex-1">{skill.name}</span>
                          <Badge 
                            variant="outline" 
                            className={`${skillLevel.colorClass} border text-xs font-medium transition-all duration-300 group-hover:scale-105`}
                          >
                            {skillLevel.text}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderStars(skill.level)}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tools & Technologies */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="card-elevated fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Code className="w-6 h-6 text-accent" />
                  Tools & Technologies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tools.map((tool, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-muted/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                    >
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated fade-in-up animate-delay-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Lightbulb className="w-6 h-6 text-success" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-success flex-shrink-0" />
                      <span className="text-sm text-foreground">{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;