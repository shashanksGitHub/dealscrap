import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Route, Switch, Router, useLocation, Redirect } from "wouter";
import { AuthProvider, useAuth } from "@/hooks/auth";
import { Toaster } from "@/components/ui/toaster";
import { NavHeader } from "@/components/layout/nav-header";
import React, { Suspense, lazy } from 'react';

// Lazy load route components
const NotFound = lazy(() => import("@/pages/not-found"));
const AuthPage = lazy(() => import("@/pages/auth-page"));
const LandingPage = lazy(() => import("@/pages/landing-page"));
const BlogPage = lazy(() => import("@/pages/blog"));
const NewBlogPost = lazy(() => import("@/pages/blog-new"));
const ResetPassword = lazy(() => import("@/pages/reset-password"));
const Impressum = lazy(() => import("@/pages/impressum"));
const Datenschutz = lazy(() => import("@/pages/datenschutz"));
const AGB = lazy(() => import("@/pages/agb"));
const LeadsKaufen = lazy(() => import("@/pages/leads-kaufen"));
const Dashboard = lazy(() => import("@/pages/dashboard"));

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

// Protected Route component with loading state
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return user ? <Component /> : null;
}

// Root component with optimized loading
function Root() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  React.useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  return <LandingPage />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <NavHeader />
          <Suspense fallback={<LoadingSpinner />}>
            <Switch>
              <Route path="/" component={Root} />
              <Route path="/auth" component={AuthPage} />
              <Route path="/blog" component={BlogPage} />
              <Route path="/blog/new" component={NewBlogPost} />
              <Route path="/reset-password" component={ResetPassword} />
              <Route path="/impressum" component={Impressum} />
              <Route path="/datenschutz" component={Datenschutz} />
              <Route path="/agb" component={AGB} />
              <Route path="/leads-kaufen" component={LeadsKaufen} />
              <Route path="/dashboard">
                <ProtectedRoute component={Dashboard} />
              </Route>
              <Route component={NotFound} />
            </Switch>
          </Suspense>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}