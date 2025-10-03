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

const Index = () => {
  return (
    <>
      <SEO />
      <StructuredData data={PersonSchema} />
      <StructuredData data={WebsiteSchema} />
      <StructuredData data={OrganizationSchema} />
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <About />
          <Experience />
          <ErrorBoundary>
            <Skills />
          </ErrorBoundary>
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
