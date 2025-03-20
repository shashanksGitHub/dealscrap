import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { NavHeader } from "@/components/layout/nav-header";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import LandingPage from "@/pages/landing-page";
import { useAuth } from "@/hooks/use-auth";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/blog" component={BlogPage} />
          <Route path="/blog/new" component={NewBlogPost} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/impressum" component={Impressum} />
          <Route path="/datenschutz" component={Datenschutz} />
          <Route path="/agb" component={AGB} />
          <Route path="/leads-kaufen" component={LeadsKaufen} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
import BlogPage from "@/pages/blog";
import NewBlogPost from "@/pages/blog-new";
import ResetPassword from "@/pages/reset-password";
import Impressum from "@/pages/impressum";
import Datenschutz from "@/pages/datenschutz";
import AGB from "@/pages/agb";
import LeadsKaufen from "@/pages/leads-kaufen";
import Dashboard from "@/pages/dashboard";
import { ProtectedRoute } from "./lib/protected-route";
import { useAuth } from "@/hooks/use-auth";

function Router() {
  const { user } = useAuth();

  return (
    <>
      <NavHeader />
      <Switch>
        <Route path="/">
          {() => user ? <Redirect to="/dashboard" /> : <LandingPage />}
        </Route>
        <Route path="/auth" component={AuthPage} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/leads-kaufen" component={LeadsKaufen} />
        <Route path="/impressum" component={Impressum} />
        <Route path="/datenschutz" component={Datenschutz} />
        <Route path="/agb" component={AGB} />
        <ProtectedRoute path="/blog/new" component={NewBlogPost} />
        <ProtectedRoute path="/dashboard" component={Dashboard} />
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