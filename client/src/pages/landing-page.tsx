
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { GlobeIcon, SearchIcon, CreditCardIcon, ArrowRightIcon } from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Navigation */}
      <nav className="border-b border-muted/20 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-violet-500 bg-clip-text text-transparent">
              LeadScraper
            </h1>
          </div>
          <div className="space-x-4">
            {user ? (
              <Link href="/dashboard">
                <Button className="rounded-full px-6 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button className="rounded-full px-6 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30">
                  Kostenloses Konto
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(black,transparent_70%)] -z-10" />
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/90 to-violet-500 bg-clip-text text-transparent">
              Einfach & kostengünstig B2B-Leads scrapen
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Finden Sie qualifizierte Geschäftskontakte mit unserem leistungsstarken Tool und steigern Sie Ihren Vertriebserfolg.
            </p>
            <Link href="/auth">
              <Button size="lg" className="rounded-full text-lg px-8 h-14 shadow-xl shadow-primary/20 transition-all hover:shadow-primary/40">
                Kostenloses Konto <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4 border-y border-muted/20">
        <div className="container mx-auto">
          <h2 className="text-2xl font-medium text-center mb-12 text-muted-foreground">
            Vertrauen von führenden Unternehmen in Deutschland
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {companies.map((company, index) => (
              <div key={index} className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <img 
                  src={company.logo} 
                  alt={company.name} 
                  className="h-12 object-contain" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

  {/* Features Section */}
      <section className="py-20 px-4 bg-muted/10 backdrop-blur-sm">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            So funktioniert es
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-lg border border-muted/20 transition-all hover:shadow-xl hover:border-primary/20">
              <div className="bg-primary/10 p-3 rounded-xl w-fit mb-6">
                <SearchIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Unternehmen suchen</h3>
              <p className="text-muted-foreground">
                Geben Sie Ihren Zielort und die Branche ein, um mit dem Scrapen zu beginnen
              </p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-lg border border-muted/20 transition-all hover:shadow-xl hover:border-primary/20">
              <div className="bg-primary/10 p-3 rounded-xl w-fit mb-6">
                <GlobeIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Daten sammeln</h3>
              <p className="text-muted-foreground">
                Wir erfassen automatisch Kontaktinformationen und Unternehmensdetails
              </p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-lg border border-muted/20 transition-all hover:shadow-xl hover:border-primary/20">
              <div className="bg-primary/10 p-3 rounded-xl w-fit mb-6">
                <CreditCardIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Bezahlung pro Lead</h3>
              <p className="text-muted-foreground">
                Bezahlen Sie nur für die gesammelten Leads mit unserem Kreditsystem
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              Warum LeadScraper?
            </h2>
            <p className="text-lg text-muted-foreground">
              Unser Tool wurde entwickelt, um Ihnen Zeit zu sparen und Ihren Vertriebsprozess zu optimieren
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-6 rounded-xl border border-muted/30 bg-card/50 transition-all hover:bg-card hover:border-primary/20">
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20 px-4 bg-muted/10 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-primary/5 to-violet-500/5 p-10 rounded-3xl border border-primary/20 shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Bereit, Leads zu sammeln?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Starten Sie noch heute mit LeadScraper und verbessern Sie Ihre Vertriebsergebnisse
            </p>
            <Link href="/auth">
              <Button size="lg" className="rounded-full text-lg px-8 h-12 shadow-lg shadow-primary/20">
                Kostenloses Konto erstellen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-muted/20 py-8 px-4 mt-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} LeadScraper. Alle Rechte vorbehalten.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-primary text-sm">Datenschutz</a>
              <a href="#" className="text-muted-foreground hover:text-primary text-sm">AGB</a>
              <a href="#" className="text-muted-foreground hover:text-primary text-sm">Kontakt</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const companies = [
  {
    name: "Bosch",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Robert_Bosch_GmbH_logo.svg/320px-Robert_Bosch_GmbH_logo.svg.png"
  },
  {
    name: "Würth",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Würth_Logo.svg/320px-Würth_Logo.svg.png"
  },
  {
    name: "Trumpf",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/TRUMPF_Logo.svg/320px-TRUMPF_Logo.svg.png"
  },
  {
    name: "Festo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Festo_logo.svg/320px-Festo_logo.svg.png"
  },
  {
    name: "Miele",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Miele_Logo.svg/320px-Miele_Logo.svg.png"
  },
  {
    name: "Kärcher",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Logo_Kaercher.svg/320px-Logo_Kaercher.svg.png"
  }
];

const benefits = [
  {
    title: "Zeit sparen",
    description: "Automatisierte Datenerfassung statt manueller Recherche"
  },
  {
    title: "Hohe Genauigkeit",
    description: "Präzise Kontaktdaten für Ihre Vertriebsaktivitäten"
  },
  {
    title: "Skalierbar",
    description: "Sammeln Sie Hunderte von Leads in kurzer Zeit"
  },
  {
    title: "Kostengünstig",
    description: "Bezahlen Sie nur für die Leads, die Sie tatsächlich nutzen"
  },
  {
    title: "Einfache Bedienung",
    description: "Intuitive Benutzeroberfläche für effizientes Arbeiten"
  },
  {
    title: "Datenexport",
    description: "Exportieren Sie Ihre Leads in verschiedene Formate"
  }
];
