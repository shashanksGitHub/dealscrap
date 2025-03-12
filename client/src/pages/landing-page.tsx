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
                <Button>Anmelden</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main>
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Einfach & kostengünstig B2B-Leads scrapen
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Entdecken und sammeln Sie automatisch Geschäftsinformationen.
              Perfekt für Vertriebsteams und Marketingfachleute.
            </p>
            <Link href="/auth">
              <Button size="lg" className="text-lg px-8">
                Jetzt starten - Kostenloses Konto
              </Button>
            </Link>
          </div>
        </section>

        <section className="bg-muted/30 py-20 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">So funktioniert es</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <SearchIcon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Unternehmen suchen</h3>
                <p className="text-muted-foreground">
                  Geben Sie Ihren Zielort und die Branche ein, um mit dem Scrapen zu beginnen
                </p>
              </div>
              <div className="text-center p-6">
                <GlobeIcon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Daten sammeln</h3>
                <p className="text-muted-foreground">
                  Wir erfassen automatisch Kontaktinformationen und Unternehmensdetails
                </p>
              </div>
              <div className="text-center p-6">
                <CreditCardIcon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Bezahlung pro Lead</h3>
                <p className="text-muted-foreground">
                  Bezahlen Sie nur für die gesammelten Leads mit unserem Kreditsystem
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          © 2024 LeadScraper. Alle Rechte vorbehalten.
        </div>
      </footer>
    </div>
  );
}
