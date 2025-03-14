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
      question: "Wie funktioniert das Kreditsystem?",
      answer: "Unser Kreditsystem ist einfach: Sie kaufen Credits und geben pro Lead einen Credit aus. Sie müssen nur für die Leads bezahlen, die Sie tatsächlich benötigen - ohne monatliche Gebühren oder versteckte Kosten."
    },
    {
      question: "Woher stammen die Daten und sind diese DSGVO-konform?",
      answer: "Alle Daten werden aus öffentlich zugänglichen Quellen gesammelt und in Übereinstimmung mit der DSGVO verarbeitet. Wir stellen sicher, dass alle erforderlichen rechtlichen Grundlagen für die Verarbeitung vorhanden sind."
    },
    {
      question: "Kann ich die Leads in mein CRM-System exportieren?",
      answer: "Ja, selbstverständlich! Sie können Ihre Leads bequem als CSV oder Excel-Datei exportieren oder unsere API nutzen, um die Daten direkt in Ihr CRM-System zu übertragen."
    },
    {
      question: "Wie aktuell sind die Leads?",
      answer: "Unsere Datenbank wird kontinuierlich aktualisiert, um sicherzustellen, dass Sie Zugriff auf die neuesten Informationen haben. Bei jeder Suchanfrage erhalten Sie die aktuellsten verfügbaren Daten."
    },
    {
      question: "Gibt es eine Mindestabnahme von Credits?",
      answer: "Nein, Sie können genau die Menge an Credits kaufen, die Sie benötigen. Wir bieten jedoch Mengenrabatte an, sodass der Preis pro Lead sinkt, je mehr Credits Sie auf einmal erwerben."
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 lg:pt-44 pb-16 md:pb-24 lg:pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(black,transparent_70%)] -z-10" />
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-violet-500/10 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              Höchsteffiziente Leadgenerierung durch KI-Technologie
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 md:mb-8 bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-transparent leading-tight">
              Einfach & kostengünstig B2B-Leads scrapen
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 md:mb-10 max-w-3xl mx-auto px-4">
              Finden Sie qualifizierte Geschäftskontakte mit unserem leistungsstarken Tool und steigern Sie Ihren Vertriebserfolg.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto rounded-full text-base md:text-lg px-6 md:px-8 py-4 md:py-6 h-auto font-medium">
                  Kostenloses Konto <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full text-base md:text-lg px-6 md:px-8 py-4 md:py-6 h-auto font-medium bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all">
                  Mehr erfahren
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Einfache Lead-Generierung mit LeadScraper</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Unser Tool bietet alles, was Sie für eine erfolgreiche Lead-Generierung benötigen
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-background/50 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-primary/10 shadow-lg hover:shadow-primary/5 transition-all hover:-translate-y-1">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <SearchIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-medium mb-2">Präzise Suche</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Finden Sie genau die Leads, die Sie suchen, mit unseren fortschrittlichen Filteroptionen.
              </p>
            </div>

            <div className="bg-background/50 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-primary/10 shadow-lg hover:shadow-primary/5 transition-all hover:-translate-y-1">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <GlobeIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-medium mb-2">Globale Abdeckung</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Zugriff auf Millionen von Unternehmen in Deutschland und weltweit, regelmäßig aktualisiert.
              </p>
            </div>

            <div className="bg-background/50 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-primary/10 shadow-lg hover:shadow-primary/5 transition-all hover:-translate-y-1">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <CheckIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-medium mb-2">Verifizierte Daten</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Alle Daten werden vor dem Export validiert, um höchste Qualitätsstandards zu gewährleisten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">So einfach funktioniert Leadscraper.de</h2>
            <p className="text-base md:text-lg text-muted-foreground">Starten Sie in nur 3 Schritten mit der automatisierten Lead-Generierung</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-background/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-primary/10 relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">1</div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Registrieren & Suchfilter setzen</h3>
              <p className="text-sm md:text-base text-muted-foreground">Wähle Standort, Branche & weitere Kriterien für deine Leads.</p>
            </div>
            <div className="bg-background/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-primary/10 relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">2</div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Leads automatisch generieren</h3>
              <p className="text-sm md:text-base text-muted-foreground">Unser System sammelt geprüfte Kontaktdaten in Echtzeit.</p>
            </div>
            <div className="bg-background/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-primary/10 relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">3</div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Leads herunterladen & kontaktieren</h3>
              <p className="text-sm md:text-base text-muted-foreground">Exportiere deine Leads als CSV und starte deine Kampagne.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-16 md:py-20 px-4 bg-muted/10">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Für wen ist Leadscraper.de gemacht?</h2>
            <p className="text-base md:text-lg text-muted-foreground">Perfekt abgestimmt auf die Bedürfnisse verschiedener Branchen</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {["IT & Software", "Marketing & Werbung", "Beratung & Consulting", "Handel & E-Commerce", "Finanzen & Versicherung", "Handwerk & Industrie"].map((industry) => (
              <div key={industry} className="bg-background/50 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all">
                <h3 className="text-base md:text-lg font-medium mb-2">{industry}</h3>
                <p className="text-sm text-muted-foreground">Maßgeschneiderte Lead-Generierung für Ihre Branche</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 md:py-20 px-4 bg-muted/5">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Warum LeadScraper?</h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Unser Tool wurde entwickelt, um Ihnen Zeit zu sparen und Ihren Vertriebsprozess zu optimieren
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-4 md:p-5 rounded-xl border border-muted/30 bg-card/50 transition-all hover:bg-card hover:border-primary/20">
                <h3 className="text-base md:text-lg font-medium mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-20 px-4 bg-muted/5">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-10 text-center">Häufig gestellte Fragen</h2>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Bereit, Ihre Lead-Generierung zu revolutionieren?</h2>
            <p className="text-base md:text-lg text-muted-foreground mb-8 md:mb-10 max-w-2xl mx-auto">
              Starten Sie noch heute mit LeadScraper und entdecken Sie, wie einfach moderne Lead-Generierung sein kann.
            </p>
            <Link href="/auth">
              <Button size="lg" className="w-full sm:w-auto rounded-full text-base md:text-lg px-6 md:px-8 py-4 md:py-6 h-auto font-medium">
                Jetzt kostenloses Konto erstellen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-10 px-4 border-t border-muted/20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
            <div className="text-center md:text-left">
              <div className="text-xl md:text-2xl font-bold text-primary mb-2">LeadScraper</div>
              <p className="text-sm text-muted-foreground">© 2024 LeadScraper GmbH. Alle Rechte vorbehalten.</p>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
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