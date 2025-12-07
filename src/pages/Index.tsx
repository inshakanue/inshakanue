import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Skills from "@/components/Skills";
import SEO from "@/components/SEO";
import { LatestBlogs } from "@/components/LatestBlogs";
import Contact from "@/components/Contact";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  return (
    <>
      <SEO />
      
      <div className="min-h-screen">
        <Header />
        <main id="main-content">
          <Hero />
          <About />
          <Experience />
          <Skills />
          <LatestBlogs />
          <div className="container-custom section-padding">
            <Separator className="bg-border/50" />
          </div>
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;