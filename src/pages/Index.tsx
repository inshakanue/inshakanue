/**
 * HOMEPAGE - PORTFOLIO SHOWCASE
 * 
 * BUSINESS CONTEXT:
 * The homepage serves as Insha Kanue's professional portfolio, showcasing 7+ years
 * of AI/ML product management experience. It demonstrates expertise, achievements,
 * and provides multiple conversion paths for opportunities and collaboration.
 * 
 * KEY BUSINESS OBJECTIVES:
 * 1. Establish credibility through quantified achievements (€15M+ revenue impact)
 * 2. Showcase technical and leadership skills for recruitment
 * 3. Generate leads through contact form (Job opportunities, consulting)
 * 4. Drive SEO traffic through structured data and optimization
 * 
 * TECHNICAL IMPLEMENTATION:
 * - Implements comprehensive SEO with meta tags, structured data, and social previews
 * - Monitors Core Web Vitals for performance optimization
 * - Wraps Skills component in ErrorBoundary for resilience
 * - Uses semantic HTML sections for accessibility
 * 
 * SEO STRATEGY:
 * - Person Schema: Rich snippets in search results
 * - Website Schema: Site-wide SEO signals
 * - Organization Schema: Professional entity information
 * - Open Graph: Enhanced social media sharing
 * 
 * PERFORMANCE MONITORING:
 * Tracks LCP, FID, CLS for Google's Core Web Vitals ranking signals
 * 
 * USER JOURNEY:
 * Hero → About → Experience → Skills → Contact
 * Each section builds credibility and guides toward conversion
 */

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

const Index = () => {
  // Monitor Core Web Vitals for SEO and UX optimization
  usePerformanceMonitoring();
  
  return (
    <>
      {/* SEO: Meta tags for search engines */}
      <SEO />
      
      {/* SOCIAL PREVIEW: Enhanced sharing for LinkedIn, Twitter, Facebook */}
      <SocialPreview
        title="Insha Kanue - AI Product Manager"
        description="Senior AI Product Manager specializing in machine learning, data science, and AI-driven product strategy. Building the future of intelligent products."
        type="website"
      />
      
      {/* STRUCTURED DATA: JSON-LD schemas for rich search results */}
      <StructuredData data={PersonSchema} />      {/* Individual profile */}
      <StructuredData data={WebsiteSchema} />     {/* Website information */}
      <StructuredData data={OrganizationSchema} />{/* Professional entity */}
      
      <div className="min-h-screen">
        {/* HEADER: Fixed navigation with social links and auth controls */}
        <Header />
        
        <main id="main-content">
          {/* HERO: Above-the-fold impact with value proposition and CTAs */}
          <Hero />
          
          {/* ABOUT: €15M+ revenue impact, 7+ years experience, key achievements */}
          <About />
          
          {/* EXPERIENCE: 6 roles across travel tech, IoT, logistics, knowledge management */}
          <Experience />
          
          {/* SKILLS: 50+ competencies across PM, AI/ML, data, leadership, design */}
          {/* Wrapped in ErrorBoundary for resilience if rating calculations fail */}
          <ErrorBoundary>
            <Skills />
          </ErrorBoundary>
          
          {/* CONTACT: Multi-channel reach (form, email, LinkedIn) with rate limiting */}
          <Contact />
        </main>
        
        {/* FOOTER: Secondary navigation and social links */}
        <Footer />
      </div>
    </>
  );
};

export default Index;
