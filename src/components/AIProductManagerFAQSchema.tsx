import { useEffect } from 'react';

/**
 * AI Product Manager FAQ Schema component
 * Provides structured FAQ data for Google's FAQ rich results
 */
const AIProductManagerFAQSchema = () => {
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What does an AI Product Manager do?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An AI Product Manager builds and manages machine learning and artificial intelligence products. They bridge the gap between data science teams and business stakeholders, defining product strategy, prioritizing ML features, and ensuring AI products deliver measurable business value. AI Product Managers work with data scientists, ML engineers, and cross-functional teams to ship AI-powered products from concept to production."
          }
        },
        {
          "@type": "Question",
          "name": "What skills does an AI Product Manager need?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An AI Product Manager needs technical understanding of machine learning, data science, and AI algorithms combined with product management skills. Key competencies include ML lifecycle management, LLM integration, prompt engineering, MLOps, data strategy, A/B testing, product analytics, stakeholder management, and AI ethics. Experience with Python, SQL, and ML frameworks is valuable for effective AI Product Management."
          }
        },
        {
          "@type": "Question",
          "name": "What makes Insha Kanue an experienced AI Product Manager?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Insha Kanue is an AI Product Manager with 7+ years of experience building machine learning products across multiple industries. As an AI PM, he has led cross-functional data science and engineering teams, shipped 10+ ML products, and generated €15M+ in revenue through AI-driven product strategies. His AI Product Management expertise includes data platforms, fraud detection ML systems, and recommendation engines."
          }
        },
        {
          "@type": "Question",
          "name": "What industries hire AI Product Managers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AI Product Managers work across travel technology, financial services, e-commerce, logistics, agriculture, healthcare, and enterprise SaaS. Insha's AI Product Management experience spans HRS Group (travel tech), logistics optimization, agricultural technology, and knowledge management systems, demonstrating the versatility of AI Product Manager roles."
          }
        },
        {
          "@type": "Question",
          "name": "What are key achievements for an AI Product Manager?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Successful AI Product Managers demonstrate measurable business impact. Insha Kanue's achievements as an AI PM include: generating €15M+ revenue through machine learning products, achieving 96.7% optimization in lead generation using AI, implementing ML fraud detection systems with 70% fraud reduction, and launching AI products that improved operations by 95%. These results showcase effective AI Product Management."
          }
        },
        {
          "@type": "Question",
          "name": "How do you become an AI Product Manager?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To become an AI Product Manager, develop expertise in both product management and machine learning. Key steps include: learning ML fundamentals and data science concepts, gaining product management experience, understanding MLOps and AI infrastructure, working with data scientists on ML projects, and building AI products end-to-end. Many AI Product Managers transition from software engineering, data science, or traditional PM roles by developing AI/ML expertise."
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(faqSchema);
    script.id = 'ai-pm-faq-schema';
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('ai-pm-faq-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return null;
};

export default AIProductManagerFAQSchema;
