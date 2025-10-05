import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search, FileQuestion } from "lucide-react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    // Extract potential search term from URL
    const path = location.pathname.slice(1);
    if (path) {
      setSearchQuery(path.replace(/-/g, ' ').replace(/\//g, ' '));
    }
  }, [location.pathname]);

  const suggestions = [
    { title: 'Home', path: '/', description: 'Return to homepage', icon: Home },
    { title: 'Blog', path: '/blog', description: 'Read latest articles', icon: FileQuestion },
    { title: 'About', path: '/#about', description: 'Learn more about Insha', icon: FileQuestion },
    { title: 'Contact', path: '/#contact', description: 'Get in touch', icon: FileQuestion },
  ];

  return (
    <>
      <SEO 
        title="404 - Page Not Found | Insha Kanue"
        description="The page you are looking for does not exist. Return to the homepage to explore AI product management insights."
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-3xl w-full">
            <div className="text-center mb-12">
              <h1 className="text-9xl font-bold gradient-text mb-6">404</h1>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h2>
              <p className="text-xl text-muted-foreground mb-4">
                Oops! The page you're looking for doesn't exist or has been moved.
              </p>
              <code className="text-sm bg-muted px-3 py-1 rounded">
                {location.pathname}
              </code>
            </div>

            {/* Search Query Suggestion */}
            {searchQuery && (
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Search className="w-5 h-5" />
                    <p>Were you looking for: <span className="font-medium text-foreground">"{searchQuery}"</span>?</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Suggested Pages */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-center">Suggested Pages</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {suggestions.map((suggestion) => (
                  <Card key={suggestion.path} className="hover:scale-105 transition-transform duration-200">
                    <CardContent className="pt-6">
                      <Link to={suggestion.path} className="block">
                        <div className="flex items-start gap-3">
                          <suggestion.icon className="w-5 h-5 text-primary mt-1" />
                          <div>
                            <h4 className="font-medium mb-1">{suggestion.title}</h4>
                            <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                          </div>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.history.back()} variant="outline" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button asChild size="lg">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>

            {/* Help Text */}
            <p className="text-center mt-8 text-sm text-muted-foreground">
              If you believe this is an error, please{" "}
              <Link to="/#contact" className="text-primary hover:underline">
                contact us
              </Link>
              .
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default NotFound;
