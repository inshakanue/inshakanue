import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import Skills from "@/components/Skills";
import SEO from "@/components/SEO";
import StructuredData, { PersonSchema, WebsiteSchema, OrganizationSchema } from "@/components/StructuredData";
import { SocialPreview } from "@/components/SocialPreview";
import { usePerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";
import { LatestBlogs } from "@/components/LatestBlogs";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  usePerformanceMonitoring();
  
  return (
    <>
      <SEO />
      <SocialPreview
        title="Insha Kanue - AI Product Manager | Machine Learning & AI Strategy Expert"
        description="AI Product Manager with 7+ years building ML products. Expert in AI strategy, LLM integration, MLOps, and data-driven product development. Generated €15M+ revenue through AI products."
        type="website"
      />
      <StructuredData data={PersonSchema} />
      <StructuredData data={WebsiteSchema} />
      <StructuredData data={OrganizationSchema} />
      
      <div className="min-h-screen">
        <Header />
        <main id="main-content">
          <Hero />
          <ErrorBoundary>
            <About />
          </ErrorBoundary>
          <Experience />
          <ErrorBoundary>
            <Skills />
          </ErrorBoundary>
          <ErrorBoundary>
            <Contact />
          </ErrorBoundary>
          <div className="container-custom py-8">
            <Separator className="bg-border/50" />
          </div>
          <LatestBlogs />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;