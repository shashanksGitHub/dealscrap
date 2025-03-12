import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { GlobeIcon, SearchIcon, CreditCardIcon } from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <nav className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            LeadScraper
          </h1>
          <div className="space-x-4">
            {user ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main>
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Generate Quality Leads from Google Maps
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Automatically discover and collect business information from Google Maps. 
              Perfect for sales teams and marketing professionals.
            </p>
            <Link href="/auth">
              <Button size="lg" className="text-lg px-8">
                Get Started - Free Account
              </Button>
            </Link>
          </div>
        </section>

        <section className="bg-muted/30 py-20 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <SearchIcon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Search Business</h3>
                <p className="text-muted-foreground">
                  Enter your target location and business type to start scraping
                </p>
              </div>
              <div className="text-center p-6">
                <GlobeIcon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Collect Data</h3>
                <p className="text-muted-foreground">
                  We automatically gather contact information and business details
                </p>
              </div>
              <div className="text-center p-6">
                <CreditCardIcon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Pay Per Lead</h3>
                <p className="text-muted-foreground">
                  Only pay for the leads you collect with our credit system
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          © 2024 LeadScraper. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
