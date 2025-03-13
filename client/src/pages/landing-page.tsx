import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { GlobeIcon, SearchIcon, CreditCardIcon, ArrowRightIcon } from "lucide-react";
import { CookieBanner } from "@/components/cookie-banner";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10">
      {/* Navigation */}
      <nav className="border-b border-muted/10 backdrop-blur-md sticky top-0 z-50 bg-background/70">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-transparent">
              LeadScraper
            </h1>
          </div>
          <div className="space-x-4">
            {user ? (
              <Link href="/dashboard">
                <Button className="rounded-full px-8 py-6 font-medium shadow-xl shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-105 bg-gradient-to-r from-primary to-violet-600 border-0">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button className="rounded-full px-8 py-6 font-medium shadow-xl shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-105 bg-gradient-to-r from-primary to-violet-600 border-0">
                  Kostenloses Konto
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 md:py-40 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(black,transparent_70%)] -z-10" />
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-violet-500/10 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              Revolutionäre Lead-Generierung
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-transparent leading-tight">
              Einfach & kostengünstig B2B-Leads scrapen
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Finden Sie qualifizierte Geschäftskontakte mit unserem leistungsstarken Tool und steigern Sie Ihren Vertriebserfolg.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="rounded-full text-lg px-10 py-7 h-auto font-medium shadow-2xl shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-105 bg-gradient-to-r from-primary to-violet-600 border-0">

{/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Warum LeadScraper?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unser Tool bietet alles, was Sie für eine erfolgreiche Lead-Generierung benötigen
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background/50 backdrop-blur-sm p-8 rounded-2xl border border-primary/10 shadow-xl hover:shadow-primary/5 transition-all hover:-translate-y-1">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <SearchIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Präzise Suche</h3>
              <p className="text-muted-foreground">
                Finden Sie genau die Leads, die Sie suchen, mit unseren fortschrittlichen Filteroptionen.
              </p>
            </div>
            
            <div className="bg-background/50 backdrop-blur-sm p-8 rounded-2xl border border-primary/10 shadow-xl hover:shadow-primary/5 transition-all hover:-translate-y-1">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <GlobeIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Globale Datenbank</h3>
              <p className="text-muted-foreground">
                Zugriff auf Millionen von Unternehmensdaten aus der ganzen Welt.
              </p>
            </div>
            
            <div className="bg-background/50 backdrop-blur-sm p-8 rounded-2xl border border-primary/10 shadow-xl hover:shadow-primary/5 transition-all hover:-translate-y-1">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <CreditCardIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Transparente Preise</h3>
              <p className="text-muted-foreground">
                Zahlen Sie nur für die Leads, die Sie sammeln. Keine versteckten Kosten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Häufig gestellte Fragen</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Alles, was Sie über unseren Service wissen müssen
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-primary/10 shadow-lg">
              <h3 className="text-xl font-bold mb-2">Wie funktioniert LeadScraper?</h3>
              <p className="text-muted-foreground">
                Unser Tool durchsucht öffentlich zugängliche Unternehmensprofile und Geschäftsdaten, um relevante Kontakte für Ihre Geschäftsentwicklung zu finden.
              </p>
            </div>
            
            <div className="bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-primary/10 shadow-lg">
              <h3 className="text-xl font-bold mb-2">Ist die Nutzung legal?</h3>
              <p className="text-muted-foreground">
                Ja, wir sammeln nur öffentlich zugängliche Geschäftsdaten. Die Nutzung unterliegt jedoch den Datenschutzbestimmungen Ihres Landes.
              </p>
            </div>
            
            <div className="bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-primary/10 shadow-lg">
              <h3 className="text-xl font-bold mb-2">Wie viel kostet der Service?</h3>
              <p className="text-muted-foreground">
                Wir arbeiten mit einem Credit-System. Jeder Lead kostet eine bestimmte Anzahl an Credits. Die aktuellen Preise finden Sie im Dashboard nach der Anmeldung.
              </p>
            </div>
            
            <div className="bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-primary/10 shadow-lg">
              <h3 className="text-xl font-bold mb-2">Kann ich die gesammelten Daten exportieren?</h3>
              <p className="text-muted-foreground">
                Ja, alle gesammelten Leads können in verschiedenen Formaten (CSV, Excel, etc.) exportiert werden.
              </p>
            </div>
          </div>
        </div>
      </section>

                  Kostenloses Konto <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="rounded-full text-lg px-10 py-7 h-auto font-medium bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all">
                  Mehr erfahren
                </Button>
              </Link>
            </div>
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

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-muted/10 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              Häufig gestellte Fragen
            </h2>
            <p className="text-lg text-muted-foreground">
              Hier finden Sie Antworten auf die häufigsten Fragen zu unserem Service
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 rounded-xl border border-muted/30 bg-card/50 transition-all hover:bg-card hover:border-primary/20">
              <h3 className="text-lg font-semibold mb-2">Wie funktioniert LeadScraper?</h3>
              <p className="text-muted-foreground">LeadScraper durchsucht automatisch öffentlich zugängliche Unternehmensverzeichnisse und extrahiert relevante Kontaktdaten nach Ihren Suchkriterien.</p>
            </div>
            
            <div className="p-6 rounded-xl border border-muted/30 bg-card/50 transition-all hover:bg-card hover:border-primary/20">
              <h3 className="text-lg font-semibold mb-2">Welche Informationen kann ich sammeln?</h3>
              <p className="text-muted-foreground">Sie können Unternehmensnamen, Kontaktdaten, Adressen, Brancheninformationen und weitere geschäftsrelevante Details sammeln.</p>
            </div>
            
            <div className="p-6 rounded-xl border border-muted/30 bg-card/50 transition-all hover:bg-card hover:border-primary/20">
              <h3 className="text-lg font-semibold mb-2">Wie viel kostet der Service?</h3>
              <p className="text-muted-foreground">Wir verwenden ein Kreditsystem, bei dem Sie nur für die tatsächlich gesammelten Leads bezahlen. Ein kostenloses Konto enthält eine begrenzte Anzahl an Credits zum Testen.</p>
            </div>
            
            <div className="p-6 rounded-xl border border-muted/30 bg-card/50 transition-all hover:bg-card hover:border-primary/20">
              <h3 className="text-lg font-semibold mb-2">Sind die Daten DSGVO-konform?</h3>
              <p className="text-muted-foreground">Ja, wir sammeln nur öffentlich zugängliche Geschäftsdaten und halten uns strikt an die DSGVO-Bestimmungen. Mehr dazu in unserer Datenschutzerklärung.</p>
            </div>
            
            <div className="p-6 rounded-xl border border-muted/30 bg-card/50 transition-all hover:bg-card hover:border-primary/20">
              <h3 className="text-lg font-semibold mb-2">Kann ich die Daten exportieren?</h3>
              <p className="text-muted-foreground">Ja, alle gesammelten Leads können in verschiedene Formate wie CSV, Excel oder direkt in CRM-Systeme exportiert werden.</p>
            </div>
          </div>
        </div>
      </section>

    {/* Footer */}
      <footer className="border-t border-muted/10 py-16 px-4 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-transparent">
                LeadScraper
              </h3>
              <p className="text-muted-foreground">
                Die einfachste Lösung zur Generierung von qualifizierten B2B-Leads.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Produkt</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Preise</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Rechtliches</h4>
              <ul className="space-y-2">
                <li><Link href="/datenschutz" className="text-muted-foreground hover:text-primary transition-colors">Datenschutz</Link></li>
                <li><Link href="/agb" className="text-muted-foreground hover:text-primary transition-colors">AGB</Link></li>
                <li><Link href="/impressum" className="text-muted-foreground hover:text-primary transition-colors">Impressum</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Kontakt</h4>
              <ul className="space-y-2">
                <li><Link href="/kontakt" className="text-muted-foreground hover:text-primary transition-colors">Kontaktformular</Link></li>
                <li><a href="mailto:info@leadscaper.example" className="text-muted-foreground hover:text-primary transition-colors">info@leadscaper.example</a></li>
                <li><a href="tel:+491234567890" className="text-muted-foreground hover:text-primary transition-colors">+49 123 456 7890</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-muted/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} LeadScraper GmbH. Alle Rechte vorbehalten.
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      <CookieBanner />
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