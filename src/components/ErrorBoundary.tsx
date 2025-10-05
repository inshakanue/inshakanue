import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console so we can debug from the chat tools
    console.error("ErrorBoundary caught an error", { error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center">
              <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Something went wrong</h2>
              <p className="text-muted-foreground mb-8">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-8 text-left bg-muted p-4 rounded-lg">
                  <summary className="cursor-pointer font-medium mb-2">Error Details</summary>
                  <pre className="text-sm overflow-auto whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={this.handleReset} variant="default">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
