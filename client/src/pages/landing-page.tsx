import { ArrowRightIcon, CheckIcon, GlobeIcon, SearchIcon, Check, ShieldCheck, Zap, Users, BarChart, Code, Megaphone, ShoppingCart, Wallet, Factory, Database, Target, Download, Coins } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import CookieBanner from "@/components/cookie-banner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DSGVOBadge } from "@/components/ui/dsgvo-badge";
import { Footer } from "@/components/layout/footer";
import { ActivityBubble } from "@/components/activity-bubble";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section - Desktop Optimiert */}
      <section className="relative overflow-hidden">
        {/* Animierter Hintergrund */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(black,transparent_70%)] -z-10" />
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 animate-fade-in">
              <Zap className="h-4 w-4" />
              <span>Höchsteffiziente Leadgenerierung durch KI-Technologie</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-transparent leading-[1.1] animate-gradient">
              Einfach & kostengünstig B2B-Leads scrapen
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up">
              Finden Sie qualifizierte Geschäftskontakte mit unserem leistungsstarken Tool und steigern Sie Ihren Vertriebserfolg.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-up animation-delay-300">
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto rounded-full px-8 py-7 h-auto text-lg font-medium bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105">
                  Kostenloses Konto erstellen <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 py-7 h-auto text-lg font-medium bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                  Mehr erfahren
                </Button>
              </Link>
            </div>
            <div className="flex justify-center animate-fade-in-up animation-delay-500">
              <DSGVOBadge size="sm" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Desktop Optimiert */}
      <section id="features" className="bg-muted/5 py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Einfache Lead-Generierung mit LeadScraper</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unser Tool bietet alles, was Sie für eine erfolgreiche Lead-Generierung benötigen
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-background/50 backdrop-blur-sm p-8 rounded-xl border border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <SearchIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-medium mb-4">Präzise Suche</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Finden Sie genau die Leads, die Sie suchen, mit unseren fortschrittlichen Filteroptionen.
              </p>
            </div>

            <div className="group bg-background/50 backdrop-blur-sm p-8 rounded-xl border border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <GlobeIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-medium mb-4">Globale Abdeckung</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Zugriff auf Millionen von Unternehmen in Deutschland und weltweit, regelmäßig aktualisiert.
              </p>
            </div>

            <div className="group bg-background/50 backdrop-blur-sm p-8 rounded-xl border border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-medium mb-4">Verifizierte Daten</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Alle Daten werden vor dem Export validiert, um höchste Qualitätsstandards zu gewährleisten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - Desktop Optimiert */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">So einfach funktioniert Leadscraper.de</h2>
            <p className="text-xl text-muted-foreground">
              Starten Sie in nur 3 Schritten mit der automatisierten Lead-Generierung
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-background/60 backdrop-blur-lg p-10 rounded-2xl border border-primary/10 relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">1</div>
              <h3 className="text-2xl font-semibold mb-4">Registrieren & Suchfilter setzen</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Wählen Sie Standort, Branche & weitere Kriterien für Ihre Leads.
              </p>
            </div>
            <div className="bg-background/60 backdrop-blur-lg p-10 rounded-2xl border border-primary/10 relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">2</div>
              <h3 className="text-2xl font-semibold mb-4">Leads automatisch generieren</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Unser System sammelt geprüfte Kontaktdaten in Echtzeit.
              </p>
            </div>
            <div className="bg-background/60 backdrop-blur-lg p-10 rounded-2xl border border-primary/10 relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">3</div>
              <h3 className="text-2xl font-semibold mb-4">Leads herunterladen & kontaktieren</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Exportieren Sie Ihre Leads als CSV und starten Sie Ihre Kampagne.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strengths Section - Desktop Optimiert */}
      <section className="bg-muted/5 py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Was uns auszeichnet</h2>
            <p className="text-xl text-muted-foreground">
              Wir setzen neue Maßstäbe in der B2B-Lead-Generierung
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="group flex items-start gap-6 transition-transform duration-300 hover:-translate-y-1">
              <div className="shrink-0 bg-primary/10 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Größte B2B-Kontaktdatenbank</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Millionen verifizierter Geschäftskontakte in Deutschland
                </p>
              </div>
            </div>
            <div className="group flex items-start gap-6 transition-transform duration-300 hover:-translate-y-1">
              <div className="shrink-0 bg-primary/10 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">KI-gestützte Filterung</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Innovative Technologie für präzise Zielgruppenauswahl
                </p>
              </div>
            </div>
            <div className="group flex items-start gap-6 transition-transform duration-300 hover:-translate-y-1">
              <div className="shrink-0 bg-primary/10 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">100% DSGVO-konform</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Alle Prozesse entsprechen den aktuellen Datenschutzrichtlinien
                </p>
              </div>
            </div>
            <div className="group flex items-start gap-6 transition-transform duration-300 hover:-translate-y-1">
              <div className="shrink-0 bg-primary/10 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <BarChart className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Beste Datenqualität</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Kontinuierlich geprüfte und aktualisierte Kontaktdaten
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section - Desktop Optimiert */}
      <section className="bg-muted/10 py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Für wen ist Leadscraper.de gemacht?</h2>
            <p className="text-xl text-muted-foreground">
              Perfekt abgestimmt auf die Bedürfnisse verschiedener Branchen
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <div key={index} className="group bg-background/50 backdrop-blur-sm p-8 rounded-xl border border-primary/10 hover:border-primary/30 transition-all hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    {industry.icon}
                  </div>
                  <h3 className="text-xl font-medium">{industry.title}</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">{industry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Desktop Optimiert */}
      <section id="benefits" className="bg-muted/5 py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Warum LeadScraper?</h2>
            <p className="text-xl text-muted-foreground">
              Unser Tool wurde entwickelt, um Ihren Vertriebsprozess zu optimieren
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group bg-background/50 backdrop-blur-sm p-8 rounded-xl border border-primary/10 hover:border-primary/30 transition-all hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-medium">{benefit.title}</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Desktop Optimiert */}
      <section id="faq" className="py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Häufig gestellte Fragen</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`}>
                  <AccordionTrigger className="text-xl">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-lg text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <Footer />
      <CookieBanner />
      <ActivityBubble />
    </div>
  );
}

const industries = [
  {
    title: "IT & Software",
    icon: <Code className="h-6 w-6 text-primary" />,
    description: "Maßgeschneiderte Lead-Generierung für innovative Technologieunternehmen"
  },
  {
    title: "Marketing & Werbung",
    icon: <Megaphone className="h-6 w-6 text-primary" />,
    description: "Gezielte Leads für Agenturen und Marketingdienstleister"
  },
  {
    title: "Beratung & Consulting",
    icon: <Users className="h-6 w-6 text-primary" />,
    description: "Qualifizierte Kontakte für Berater und Consultants"
  },
  {
    title: "Handel & E-Commerce",
    icon: <ShoppingCart className="h-6 w-6 text-primary" />,
    description: "B2B-Kontakte für Händler und Online-Shops"
  },
  {
    title: "Finanzen & Versicherung",
    icon: <Wallet className="h-6 w-6 text-primary" />,
    description: "Relevante Leads für Finanzdienstleister"
  },
  {
    title: "Handwerk & Industrie",
    icon: <Factory className="h-6 w-6 text-primary" />,
    description: "Zielgerichtete Kontakte für produzierende Unternehmen"
  }
];

const benefits = [
  {
    title: "Große Datenbank",
    icon: <Database className="h-6 w-6 text-primary" />,
    description: "Zugriff auf Millionen von Unternehmenskontakten in Deutschland und weltweit."
  },
  {
    title: "Zielgenaue Filterung",
    icon: <Target className="h-6 w-6 text-primary" />,
    description: "Filtern Sie nach Branche, Standort, Unternehmensgröße und mehr."
  },
  {
    title: "DSGVO-konform",
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    description: "Alle Daten werden unter Einhaltung der Datenschutzgrundverordnung verarbeitet."
  },
  {
    title: "API-Zugang",
    icon: <Code className="h-6 w-6 text-primary" />,
    description: "Integrieren Sie LeadScraper nahtlos in Ihre bestehenden Systeme."
  },
  {
    title: "Einfacher Export",
    icon: <Download className="h-6 w-6 text-primary" />,
    description: "Exportieren Sie Ihre Leads in verschiedenen Formaten wie CSV, Excel oder direkt in Ihr CRM."
  },
  {
    title: "Günstiger als die Konkurrenz",
    icon: <Coins className="h-6 w-6 text-primary" />,
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