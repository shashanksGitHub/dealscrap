import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { NavHeader } from "@/components/layout/nav-header";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import LandingPage from "@/pages/landing-page";
import Dashboard from "@/pages/dashboard";
import BlogPage from "@/pages/blog";
import NewBlogPost from "@/pages/blog-new";
import Checkout from "@/pages/checkout";
import { ProtectedRoute } from "./lib/protected-route";
import { useLocation } from "wouter";

function Router() {
  const [location] = useLocation();
  const hideNavigation = location.startsWith('/checkout/');

  return (
    <>
      {!hideNavigation && <NavHeader />}
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/blog" component={BlogPage} />
        <ProtectedRoute path="/blog/new" component={NewBlogPost} />
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <ProtectedRoute path="/checkout/:amount" component={Checkout} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;