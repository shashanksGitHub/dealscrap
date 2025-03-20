import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Route, Switch } from "wouter";
import { AuthProvider } from "@/hooks/auth";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import LandingPage from "@/pages/landing-page";
import BlogPage from "@/pages/blog";
import NewBlogPost from "@/pages/blog-new";
import ResetPassword from "@/pages/reset-password";
import Impressum from "@/pages/impressum";
import Datenschutz from "@/pages/datenschutz";
import AGB from "@/pages/agb";
import LeadsKaufen from "@/pages/leads-kaufen";
import Dashboard from "@/pages/dashboard";
import { NavHeader } from "@/components/layout/nav-header";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavHeader />
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