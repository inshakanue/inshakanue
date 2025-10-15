import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, TrendingUp, Euro } from "lucide-react";

const Experience = () => {
  const experiences = [
    {
      title: "Product Manager",
      company: "HRS Group",
      companyUrl: "https://www.hrs.com/enterprise/hrsgroup/",
      location: "Germany (Remote)",
      period: "Sep 2022 – July 2025",
      type: "Full-time",
      description: "Leading global business travel tech company and one of Europe's top three hotel booking platforms.",
      achievements: [
        "Launched Datahub platform, reducing onboarding time by 40% and driving 15% revenue increase",
        "Built Mission Control Analytics Dashboard, enhancing operations performance by 95%",
        "Achieved 96.7% lead gen optimization and €28.5K annual savings via Marketing Lead Dashboard",
        "Developed Budget hotel Classifier service contributing €12M in revenue",
        "Productionalized Star Category backfill service enhancing revenue by €3.5M"
      ],
      tags: ["Data Platforms", "Analytics", "ML/AI", "Revenue Growth"]
    },
    {
      title: "Product Owner",
      company: "HRS Group",
      companyUrl: "https://www.hrs.com/enterprise/hrsgroup/",
      location: "Germany (Remote)",
      period: "Aug 2021 – Aug 2022",
      type: "Full-time",
      achievements: [
        "Developed Hotel Reviews Sentiment Analysis resulting in 30% increase in customer satisfaction",
        "Enhanced SigMail Email Classification Service boosting user engagement by 25%",
        "Built Fraud bookings detection service reducing fraud by 70% and increasing revenue by 45%"
      ],
      tags: ["Sentiment Analysis", "Fraud Detection", "Customer Satisfaction"]
    },
    {
      title: "Product Manager",
      company: "Hypha.cc",
      location: "UK (Contract)",
      period: "Apr 2021 – Jun 2021",
      type: "Contract",
      description: "AI-powered platform enabling strategic ideation and innovation across teams and businesses.",
      achievements: [
        "Led global market research identifying 5+ AI-driven product opportunities",
        "Expanded product pipeline by 30% and shaped 2 strategic roadmap initiatives",
        "Drove entry into $30B knowledge management market with 25% portfolio expansion",
        "Recruited 20+ target users from Reckitt and IKEA for product testing"
      ],
      tags: ["AI Strategy", "Market Research", "Innovation", "B2B"]
    },
    {
      title: "Product Manager (Partner, Digital Transformation)",
      company: "FastBeetle",
      companyUrl: "https://fastbeetle.com/",
      location: "India",
      period: "Apr 2020 – Mar 2021",
      type: "Full-time",
      description: "Logistics tech platform managing 300,000+ shipments per month for micro-entrepreneurs and SMEs.",
      achievements: [
        "Orchestrated digital transformation reducing delivery times by 25%",
        "Launched warehouse management product improving efficiency by 35%",
        "Achieved $6,872 annual cost reduction and scaled adoption across franchise partners",
        "Partnered with Amazon, Flipkart, Myntra, and Lenskart for tailored solutions"
      ],
      tags: ["Digital Transformation", "Logistics", "B2B Partnerships", "Cost Optimization"]
    },
    {
      title: "Founder & Head of Products",
      company: "Byoul.co",
      location: "India",
      period: "Jun 2018 – Mar 2020",
      type: "Founder",
      description: "IoT-based smart farming platform for monitoring, controlling, and optimizing agriculture operations.",
      achievements: [
        "Launched comprehensive platform with real-time monitoring and predictive analytics",
        "Achieved 25% increase in crop yield and 30% reduction in water usage",
        "Improved user satisfaction by 40% and retention by 20% through iterative features",
        "Established strategic partnerships expanding platform reach by 40%"
      ],
      tags: ["IoT", "Agriculture", "Predictive Analytics", "Startup"]
    },
    {
      title: "Front-End Developer",
      company: "Corp.H",
      location: "India",
      period: "Sep 2017 – Oct 2018",
      type: "Full-time",
      description: "Technology consultancy transforming businesses through web and mobile app development.",
      achievements: [
        "Developed responsive web applications for various industry clients",
        "Collaborated with cross-functional teams on digital transformation projects",
        "Built user interfaces that improved client engagement and satisfaction"
      ],
      tags: ["Frontend Development", "Web Apps", "Client Solutions"]
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Founder":
        return "bg-accent/10 text-accent border-accent/20";
      case "Contract":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <section id="experience" className="section-padding bg-secondary/30">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Professional <span className="gradient-text">Experience</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A journey of building impactful products across diverse industries, 
              from startups to global enterprises.
            </p>
          </div>

          {/* Experience Timeline */}
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <Card key={index} className="card-elevated fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="text-xl lg:text-2xl font-bold text-foreground">{exp.title}</h3>
                        <Badge className={`w-fit text-xs px-2 py-1 ${getTypeColor(exp.type)}`}>
                          {exp.type}
                        </Badge>
                      </div>
                      {exp.companyUrl ? (
                        <a 
                          href={exp.companyUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`text-lg lg:text-xl font-semibold text-primary hover:underline inline-block ${exp.description ? 'mb-2' : 'mb-4'}`}
                        >
                          {exp.company}
                        </a>
                      ) : (
                        <h4 className={`text-lg lg:text-xl font-semibold text-primary ${exp.description ? 'mb-2' : 'mb-4'}`}>{exp.company}</h4>
                      )}
                      {exp.description && <p className="text-muted-foreground mb-4">{exp.description}</p>}
                    </div>
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{exp.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Key Achievements */}
                  <div className="mb-6">
                    <h5 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      Key Achievements
                    </h5>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-xs bg-muted/30 text-muted-foreground border-muted-foreground/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;