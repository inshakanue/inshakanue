import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Brain, 
  Users, 
  Code, 
  Database, 
  Lightbulb,
  Target,
  Zap
} from "lucide-react";

const Skills = () => {
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
        { name: "Data Analysis & Insights", level: 90 },
        { name: "A/B Testing & Experimentation", level: 85 },
        { name: "KPI Definition & Tracking", level: 92 },
        { name: "Business Intelligence", level: 80 },
        { name: "Predictive Analytics", level: 75 }
      ]
    },
    {
      title: "Technology & AI/ML",
      icon: Brain,
      color: "text-success",
      skills: [
        { name: "AI/ML Product Development", level: 85 },
        { name: "API Design & Integration", level: 80 },
        { name: "System Architecture", level: 75 },
        { name: "IoT & Connected Devices", level: 82 },
        { name: "Cloud Platforms", level: 78 }
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
    "Figma", "Jira", "Confluence", "Slack", "Notion", "Miro", 
    "Google Analytics", "Mixpanel", "PowerBI", "SQL", "Python", 
    "AWS", "Docker", "Git", "Postman", "Airtable"
  ];

  const certifications = [
    "Product Management Certification",
    "Agile & Scrum Master",
    "Google Analytics Certified",
    "AWS Cloud Practitioner",
    "Data Analytics Certificate"
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
                <CardContent className="space-y-4">
                  {category.skills.map((skill, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">{skill.name}</span>
                        <span className="text-xs text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress 
                        value={skill.level} 
                        className="h-2 bg-muted"
                      />
                    </div>
                  ))}
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