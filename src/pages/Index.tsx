import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import SEO from "@/components/SEO";
import { LatestBlogs } from "@/components/LatestBlogs";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  return (
    <>
      <SEO />
      
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
            <LatestBlogs />
          </ErrorBoundary>
          <ErrorBoundary>
            <Contact />
          </ErrorBoundary>
          <div className="container-custom py-8">
            <Separator className="bg-border/50" />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
