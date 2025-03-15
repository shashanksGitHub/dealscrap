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
      {/* Hero Section - Optimiert */}
      <section className="pt-12 lg:pt-24 pb-8 lg:pb-16 relative overflow-hidden">
        {/* Animierter Hintergrund bleibt unverändert */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(black,transparent_70%)] -z-10" />
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-violet-500/10 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4 animate-fade-in">
              <Zap className="h-4 w-4" />
              <span>Höchsteffiziente Leadgenerierung durch KI-Technologie</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-transparent leading-tight animate-gradient">
              Einfach & kostengünstig B2B-Leads scrapen
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto animate-fade-in-up">
              Finden Sie qualifizierte Geschäftskontakte mit unserem leistungsstarken Tool und steigern Sie Ihren Vertriebserfolg.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6 animate-fade-in-up animation-delay-300">
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto rounded-full px-6 py-6 h-auto font-medium bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105">
                  Kostenloses Konto erstellen <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-6 py-6 h-auto font-medium bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
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

      {/* Features Section - Optimiert */}
      <section id="features" className="py-16 bg-muted/5">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Einfache Lead-Generierung mit LeadScraper</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unser Tool bietet alles, was Sie für eine erfolgreiche Lead-Generierung benötigen
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <SearchIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Präzise Suche</h3>
              <p className="text-muted-foreground">
                Finden Sie genau die Leads, die Sie suchen, mit unseren fortschrittlichen Filteroptionen.
              </p>
            </div>

            <div className="group bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <GlobeIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Globale Abdeckung</h3>
              <p className="text-muted-foreground">
                Zugriff auf Millionen von Unternehmen in Deutschland und weltweit, regelmäßig aktualisiert.
              </p>
            </div>

            <div className="group bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Verifizierte Daten</h3>
              <p className="text-muted-foreground">
                Alle Daten werden vor dem Export validiert, um höchste Qualitätsstandards zu gewährleisten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section mit Glasmorphismus */}
      <section className="py-12 md:py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">So einfach funktioniert Leadscraper.de</h2>
            <p className="text-base md:text-lg text-muted-foreground">Starten Sie in nur 3 Schritten mit der automatisierten Lead-Generierung</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            <div className="bg-background/60 backdrop-blur-lg p-8 md:p-10 rounded-2xl border border-primary/10 relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">1</div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Registrieren & Suchfilter setzen</h3>
              <p className="text-sm md:text-base text-muted-foreground">Wählen Sie Standort, Branche & weitere Kriterien für Ihre Leads.</p>
            </div>
            <div className="bg-background/60 backdrop-blur-lg p-8 md:p-10 rounded-2xl border border-primary/10 relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">2</div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Leads automatisch generieren</h3>
              <p className="text-sm md:text-base text-muted-foreground">Unser System sammelt geprüfte Kontaktdaten in Echtzeit.</p>
            </div>
            <div className="bg-background/60 backdrop-blur-lg p-8 md:p-10 rounded-2xl border border-primary/10 relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">3</div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Leads herunterladen & kontaktieren</h3>
              <p className="text-sm md:text-base text-muted-foreground">Exportieren Sie Ihre Leads als CSV und starten Sie Ihre Kampagne.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Strengths Section mit verbesserten Icons und Animation */}
      <section className="py-12 md:py-16 px-4 bg-muted/5">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Was uns auszeichnet</h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Wir setzen neue Maßstäbe in der B2B-Lead-Generierung
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1">
              <div className="shrink-0 bg-primary/10 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Größte B2B-Kontaktdatenbank</h3>
                <p className="text-sm text-muted-foreground">Millionen verifizierter Geschäftskontakte in Deutschland</p>
              </div>
            </div>
            <div className="group flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1">
              <div className="shrink-0 bg-primary/10 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">KI-gestützte Filterung</h3>
                <p className="text-sm text-muted-foreground">Innovative Technologie für präzise Zielgruppenauswahl</p>
              </div>
            </div>
            <div className="group flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1">
              <div className="shrink-0 bg-primary/10 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">100% DSGVO-konform</h3>
                <p className="text-sm text-muted-foreground">Alle Prozesse entsprechen den aktuellen Datenschutzrichtlinien</p>
              </div>
            </div>
            <div className="group flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1">
              <div className="shrink-0 bg-primary/10 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Beste Datenqualität</h3>
                <p className="text-sm text-muted-foreground">Kontinuierlich geprüfte und aktualisierte Kontaktdaten</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-12 md:py-16 px-4 bg-muted/10">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Für wen ist Leadscraper.de gemacht?</h2>
            <p className="text-base md:text-lg text-muted-foreground">Perfekt abgestimmt auf die Bedürfnisse verschiedener Branchen</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="group bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all hover:-translate-y-1 duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-medium">IT & Software</h3>
              </div>
              <p className="text-sm text-muted-foreground">Maßgeschneiderte Lead-Generierung für Ihre Branche</p>
            </div>
            <div className="group bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all hover:-translate-y-1 duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Megaphone className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-medium">Marketing & Werbung</h3>
              </div>
              <p className="text-sm text-muted-foreground">Maßgeschneiderte Lead-Generierung für Ihre Branche</p>
            </div>
            <div className="group bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all hover:-translate-y-1 duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-medium">Beratung & Consulting</h3>
              </div>
              <p className="text-sm text-muted-foreground">Maßgeschneiderte Lead-Generierung für Ihre Branche</p>
            </div>
            <div className="group bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all hover:-translate-y-1 duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-medium">Handel & E-Commerce</h3>
              </div>
              <p className="text-sm text-muted-foreground">Maßgeschneiderte Lead-Generierung für Ihre Branche</p>
            </div>
            <div className="group bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all hover:-translate-y-1 duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-medium">Finanzen & Versicherung</h3>
              </div>
              <p className="text-sm text-muted-foreground">Maßgeschneiderte Lead-Generierung für Ihre Branche</p>
            </div>
            <div className="group bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all hover:-translate-y-1 duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Factory className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-medium">Handwerk & Industrie</h3>
              </div>
              <p className="text-sm text-muted-foreground">Maßgeschneiderte Lead-Generierung für Ihre Branche</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-12 md:py-16 px-4 bg-muted/5">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Warum LeadScraper?</h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Unser Tool wurde entwickelt, um Ihnen Zeit zu sparen und Ihren Vertriebsprozess zu optimieren
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            <div className="p-4 md:p-5 rounded-xl border border-muted/30 bg-card/50 transition-all hover:bg-card hover:border-primary/20 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-medium">Große Datenbank</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Zugriff auf Millionen von Unternehmenskontakten in Deutschland und weltweit.
              </p>
            </div>
            <div className="p-4 md:p-5 rounded-xl border border-muted/30 bg-card/50 transition-all hover:bg-card hover:border-primary/20 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-medium">Zielgenaue Filterung</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Filtern Sie nach Branche, Standort, Unternehmensgröße und mehr.
              </p>
            </div>
            <div className="p-4 md:p-5 rounded-xl border border-muted/30 bg-card/50 transition-all hover:bg-card hover:border-primary/20 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-medium">DSGVO-konform</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Alle Daten werden unter Einhaltung der Datenschutzgrundverordnung verarbeitet.
              </p>
            </div>
            <div className="p-4 md:p-5 rounded-xl border border-muted/30 bg-card/50 transition-all hover:bg-card hover:border-primary/20 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-medium">API-Zugang</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Integrieren Sie LeadScraper nahtlos in Ihre bestehenden Systeme.
              </p>
            </div>
            <div className="p-4 md:p-5 rounded-xl border border-muted/30 bg-card/50 transition-all hover:bg-card hover:border-primary/20 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Download className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-medium">Einfacher Export</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Exportieren Sie Ihre Leads in verschiedenen Formaten wie CSV, Excel oder direkt in Ihr CRM.
              </p>
            </div>
            <div className="p-4 md:p-5 rounded-xl border border-muted/30 bg-card/50 transition-all hover:bg-card hover:border-primary/20 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Coins className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-medium">Günstiger als die Konkurrenz</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Wettbewerbsfähige Preise bei höchster Datenqualität und Benutzerfreundlichkeit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 md:py-16 px-4 bg-muted/5">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
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

      <Footer />
      <CookieBanner />
      <ActivityBubble />
    </div>
  );
}

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