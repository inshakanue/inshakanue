import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    // Log to console so we can debug from the chat tools
    console.error("ErrorBoundary caught an error", { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center text-destructive">
              Something went wrong loading this section.
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
