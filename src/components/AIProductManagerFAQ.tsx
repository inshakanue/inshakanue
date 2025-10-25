import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AIProductManagerFAQ = () => {
  const faqs = [
    {
      question: "What does an AI Product Manager do?",
      answer: "An AI Product Manager builds and manages machine learning and artificial intelligence products. They bridge the gap between data science teams and business stakeholders, defining product strategy, prioritizing ML features, and ensuring AI products deliver measurable business value. AI Product Managers work with data scientists, ML engineers, and cross-functional teams to ship AI-powered products from concept to production."
    },
    {
      question: "What skills does an AI Product Manager need?",
      answer: "An AI Product Manager needs technical understanding of machine learning, data science, and AI algorithms combined with product management skills. Key competencies include ML lifecycle management, LLM integration, prompt engineering, MLOps, data strategy, A/B testing, product analytics, stakeholder management, and AI ethics. Experience with Python, SQL, and ML frameworks is valuable for effective AI Product Management."
    },
    {
      question: "How is AI Product Management different from traditional Product Management?",
      answer: "AI Product Management differs from traditional PM in several ways: working with probabilistic outputs instead of deterministic features, managing data quality and ML model performance, understanding ML experimentation and deployment pipelines, handling AI ethics and bias considerations, and collaborating closely with data science teams. AI Product Managers must understand technical ML concepts while focusing on business outcomes and user value."
    },
    {
      question: "What industries hire AI Product Managers?",
      answer: "AI Product Managers are in high demand across many industries including technology companies, financial services, healthcare, e-commerce, travel and hospitality, logistics, agriculture, automotive, and enterprise SaaS. Any company building machine learning products, implementing AI features, or developing data-driven solutions needs experienced AI Product Managers to lead their AI strategy and product development."
    },
    {
      question: "How do AI Product Managers measure success?",
      answer: "AI Product Managers measure success through both technical ML metrics and business KPIs. Technical metrics include model accuracy, precision, recall, latency, and infrastructure costs. Business metrics include revenue impact, user engagement, conversion rates, operational efficiency gains, and cost savings. Successful AI Product Managers balance model performance with business value, demonstrating ROI from AI investments through measurable outcomes."
    },
    {
      question: "What is the career path for an AI Product Manager?",
      answer: "The AI Product Manager career path typically progresses from Associate AI PM to AI Product Manager, Senior AI PM, Lead/Principal AI PM, and eventually Director or VP of AI Product. Many AI Product Managers come from backgrounds in software engineering, data science, or traditional product management and transition by building ML expertise. The role offers high growth potential as AI adoption accelerates across industries."
    }
  ];

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              AI Product Manager <span className="gradient-text">FAQ</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Common questions about AI Product Management, machine learning products, and building a career as an AI PM
            </p>
          </header>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AIProductManagerFAQ;
