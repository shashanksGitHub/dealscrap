import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, ChevronDownIcon, GlobeIcon, SearchIcon } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import CookieBanner from "@/components/cookie-banner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function LandingPage() {
  const { user } = useAuth();

  const benefits = [
    {
      title: "Große Datenbank",
      description: "Zugriff auf Millionen von Unternehmenskontakten in Deutschland und weltweit."
    },
    {
      title: "Zielgenaue Filterung",
      description: "Filtern Sie nach Branche, Standort, Unternehmensgröße und mehr."
    },
    {
      title: "DSGVO-konform",
      description: "Alle Daten werden unter Einhaltung der Datenschutzgrundverordnung verarbeitet."
    },
    {
      title: "API-Zugang",
      description: "Integrieren Sie LeadScraper nahtlos in Ihre bestehenden Systeme."
    },
    {
      title: "Einfacher Export",
      description: "Exportieren Sie Ihre Leads in verschiedenen Formaten wie CSV, Excel oder direkt in Ihr CRM."
    },
    {
      title: "Günstiger als die Konkurrenz",
      description: "Wettbewerbsfähige Preise bei höchster Datenqualität und Benutzerfreundlichkeit."
    }
  ];

  const faqs = [
    {
      question: "Wie funktioniert LeadScraper?",
      answer: "LeadScraper verwendet fortschrittliche Technologien, um B2B-Kontaktdaten aus öffentlich zugänglichen Quellen zu sammeln und aufzubereiten. Sie können die Daten nach verschiedenen Kriterien filtern und exportieren."
    },
    {
      question: "Ist die Nutzung von LeadScraper DSGVO-konform?",
      answer: "Ja, wir achten sehr auf die Einhaltung der Datenschutzgrundverordnung (DSGVO). Alle gesammelten Daten stammen aus öffentlich zugänglichen Quellen, und wir bieten Ihnen Tools, um die Compliance bei der Nutzung dieser Daten sicherzustellen."
    },
    {
      question: "Wie viel kostet die Nutzung von LeadScraper?",
      answer: "Wir bieten verschiedene Preispläne an, die auf Ihre Bedürfnisse zugeschnitten sind. Sie können mit einem kostenlosen Konto beginnen und später auf Premium-Funktionen upgraden. Die genauen Preise finden Sie in unserem Preisbereich."
    },
    {
      question: "Kann ich die Daten in mein CRM-System exportieren?",
      answer: "Absolut! LeadScraper ermöglicht den Export von Daten in verschiedenen Formaten wie CSV und Excel. Zudem bieten wir direkte Integrationen mit gängigen CRM-Systemen wie Salesforce, HubSpot und Pipedrive."
    },
    {
      question: "Wie aktuell sind die Daten?",
      answer: "Unsere Datenbank wird kontinuierlich aktualisiert, um sicherzustellen, dass Sie Zugriff auf die neuesten Informationen haben. Die meisten Datensätze werden mindestens vierteljährlich überprüft und aktualisiert."
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            LeadScraper
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">
                Vorteile
              </Link>
              <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
              <Link href="/kontakt" className="text-muted-foreground hover:text-foreground transition-colors">
                Kontakt
              </Link>
            </nav>
            {user ? (
              <Link href="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button size="sm">Kostenloses Konto</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 md:pt-44 md:pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(black,transparent_70%)] -z-10" />
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-violet-500/10 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              Revolutionäre Lead-Generierung
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-8 bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-transparent leading-tight">
              Einfach & kostengünstig B2B-Leads scrapen
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Finden Sie qualifizierte Geschäftskontakte mit unserem leistungsstarken Tool und steigern Sie Ihren Vertriebserfolg.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="rounded-full text-lg px-8 py-6 h-auto font-medium">
                  Kostenloses Konto <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="rounded-full text-lg px-8 py-6 h-auto font-medium bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all">
                  Mehr erfahren
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-12 px-4 border-y border-muted/20 bg-muted/5">
        <div className="container mx-auto">
          <h2 className="text-xl font-medium text-center mb-10 text-muted-foreground">
            Vertrauen von führenden Unternehmen in Deutschland
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {companies.map((company, index) => (
              <div key={index} className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <img 
                  src={company.logo} 
                  alt={company.name} 
                  className="h-10 object-contain" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Einfache Lead-Generierung mit LeadScraper</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unser Tool bietet alles, was Sie für eine erfolgreiche Lead-Generierung benötigen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10 shadow-lg hover:shadow-primary/5 transition-all hover:-translate-y-1">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <SearchIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Präzise Suche</h3>
              <p className="text-muted-foreground">
                Finden Sie genau die Leads, die Sie suchen, mit unseren fortschrittlichen Filteroptionen.
              </p>
            </div>

            <div className="bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10 shadow-lg hover:shadow-primary/5 transition-all hover:-translate-y-1">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <GlobeIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Globale Abdeckung</h3>
              <p className="text-muted-foreground">
                Zugriff auf Millionen von Unternehmen in Deutschland und weltweit, regelmäßig aktualisiert.
              </p>
            </div>

            <div className="bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10 shadow-lg hover:shadow-primary/5 transition-all hover:-translate-y-1">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <CheckIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Verifizierte Daten</h3>
              <p className="text-muted-foreground">
                Alle Daten werden vor dem Export validiert, um höchste Qualitätsstandards zu gewährleisten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 bg-muted/5">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Warum LeadScraper?</h2>
            <p className="text-lg text-muted-foreground">
              Unser Tool wurde entwickelt, um Ihnen Zeit zu sparen und Ihren Vertriebsprozess zu optimieren
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-5 rounded-xl border border-muted/30 bg-card/50 transition-all hover:bg-card hover:border-primary/20">
                <h3 className="text-lg font-medium mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Space Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-primary/10 to-violet-500/10 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Werbebereich</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Dieser Bereich kann für Werbeanzeigen oder Promotionen genutzt werden, z.B. für Partnerschaften oder besondere Angebote.
            </p>
            <div className="bg-background/60 backdrop-blur-sm p-6 rounded-xl border border-primary/20 max-w-3xl mx-auto">
              <div className="h-20 flex items-center justify-center">
                <p className="text-muted-foreground italic">Werbebereich für Partner und Sponsoren</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-muted/5">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">Häufig gestellte Fragen</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-muted/30 rounded-lg px-6 py-2 bg-card/50">
                  <AccordionTrigger className="text-lg font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Bereit, Ihre Lead-Generierung zu revolutionieren?</h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Starten Sie noch heute mit LeadScraper und entdecken Sie, wie einfach moderne Lead-Generierung sein kann.
            </p>
            <Link href="/auth">
              <Button size="lg" className="rounded-full text-lg px-8 py-6 h-auto font-medium">
                Jetzt kostenloses Konto erstellen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-muted/20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold text-primary mb-2">LeadScraper</div>
              <p className="text-sm text-muted-foreground">© 2023 LeadScraper GmbH. Alle Rechte vorbehalten.</p>
            </div>
            <div className="flex flex-wrap gap-6 justify-center">
              <Link href="/impressum" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Impressum
              </Link>
              <Link href="/datenschutz" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Datenschutz
              </Link>
              <Link href="/agb" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                AGB
              </Link>
              <Link href="/kontakt" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Kontakt
              </Link>
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