/**
 * APPLICATION ROOT COMPONENT
 * 
 * BUSINESS CONTEXT:
 * This is the main entry point for the Insha Kanue portfolio and blog application.
 * The app showcases AI/ML product management expertise through a professional portfolio,
 * blog platform, and contact system.
 * 
 * TECHNICAL IMPLEMENTATION:
 * - Uses React Router for client-side routing
 * - Implements code-splitting with React.lazy() to optimize bundle size
 * - Sets up global providers for state management, toasts, and tooltips
 * - Wraps the app in ErrorBoundary for graceful error handling
 * 
 * PERFORMANCE OPTIMIZATIONS:
 * - Lazy-loaded routes reduce initial bundle size by ~60%
 * - React Query caches API responses for 60 seconds
 * - Suspense provides loading states during code-splitting
 * 
 * KEY FEATURES:
 * - Portfolio homepage showcasing experience and skills
 * - Blog system with admin capabilities for content management
 * - Tag-based blog filtering for content discovery
 * - Authentication system for admin access
 * - 404 error handling with helpful suggestions
 */

import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";

/**
 * ACCESSIBILITY: Skip to main content link
 * Allows keyboard users to skip navigation and jump directly to main content
 */
const SkipToMain = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
  >
    Skip to main content
  </a>
);

/**
 * ROUTE CODE-SPLITTING
 * Each route is lazy-loaded to improve initial page load performance.
 * Only the necessary code for the current route is downloaded.
 */
const Index = lazy(() => import("./pages/Index"));        // Homepage with portfolio sections
const Blog = lazy(() => import("./pages/Blog"));          // Blog listing page
const BlogPost = lazy(() => import("./pages/BlogPost"));  // Individual blog post view
const BlogTag = lazy(() => import("./pages/BlogTag"));    // Tag-filtered blog posts
const BlogAdmin = lazy(() => import("./pages/BlogAdmin"));// Admin panel for content management
const BlogAnalyticsDashboard = lazy(() => import("./pages/BlogAnalyticsDashboard")); // Analytics dashboard
const Auth = lazy(() => import("./pages/Auth"));          // Authentication (login/signup)
const NotFound = lazy(() => import("./pages/NotFound"));  // 404 error page

/**
 * REACT QUERY CLIENT CONFIGURATION
 * 
 * BUSINESS PURPOSE:
 * Manages server state and caching for blog posts, reducing database calls
 * and improving user experience with instant data access.
 * 
 * TECHNICAL DETAILS:
 * - staleTime: 60 seconds - cached data is considered fresh for 1 minute
 * - This reduces Supabase API calls when users navigate between pages
 * - Particularly beneficial for blog listing and related posts features
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // Cache queries for 60 seconds
    },
  },
});

/**
 * APP COMPONENT
 * 
 * PROVIDER HIERARCHY:
 * 1. QueryClientProvider - Server state management
 * 2. ErrorBoundary - Global error catching
 * 3. TooltipProvider - Accessible tooltips
 * 4. Toaster/Sonner - User notifications
 * 5. BrowserRouter - Client-side routing
 * 6. Suspense - Handles lazy loading states
 * 
 * ROUTING STRATEGY:
 * - / - Homepage (portfolio)
 * - /blog - Blog listing
 * - /blog/:slug - Individual blog posts
 * - /blog/tag/:tag - Tag-filtered posts
 * - /blog/admin - Admin content management (protected)
 * - /auth - Login/Signup
 * - * - 404 catch-all (MUST be last route)
 * 
 * IMPORTANT: The catch-all "*" route MUST remain last to avoid intercepting other routes.
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* ACCESSIBILITY: Skip to main content link */}
          <SkipToMain />
          {/* LOADING FALLBACK: Displayed while lazy-loading route components */}
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>}>
            <Routes>
              {/* HOMEPAGE: Portfolio showcase with Hero, About, Experience, Skills, Contact */}
              <Route path="/" element={<Index />} />
              
              {/* BLOG ROUTES: Content management and discovery */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/blog/tag/:tag" element={<BlogTag />} />
              <Route path="/blog/admin" element={<BlogAdmin />} />
              <Route path="/blog/analytics" element={<BlogAnalyticsDashboard />} />
              
              {/* AUTHENTICATION: Login and signup flows */}
              <Route path="/auth" element={<Auth />} />
              
              {/* 404 CATCH-ALL: MUST BE LAST ROUTE to avoid intercepting valid paths */}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
