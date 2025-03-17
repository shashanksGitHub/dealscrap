import { ArrowRightIcon } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import CookieBanner from "@/components/cookie-banner";
import { Footer } from "@/components/layout/footer";
import { ActivityBubble } from "@/components/activity-bubble";
import { Star } from "lucide-react";
import { Zap, Users, BarChart, Code, Megaphone, ShoppingCart, Wallet, Factory, Database, Target, Download, Coins, GlobeIcon, SearchIcon, ShieldCheck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>LeadScraper.de - Intelligente B2B Lead-Generierung für den DACH-Raum</title>
        <meta name="description" content="Automatisierte Lead-Generierung für den deutschen B2B-Markt. DSGVO-konform, KI-gestützt und effizient." />
        <meta name="keywords" content="Lead-Generierung, B2B, DACH, DSGVO-konform, Vertrieb, Marketing" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "LeadScraper.de",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "EUR"
              }
            }
          `}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(black,transparent_70%)] -z-10" />
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-violet-500/10 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-2000" />

        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-8">
              <Zap className="h-4 w-4 mr-2" />
              Höchsteffiziente Leadgenerierung durch KI-Technologie
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-gradient-to-r from-blue-500 via-blue-600 to-violet-600 text-transparent bg-clip-text">
              Einfach & kostengünstig B2B-Leads scrapen
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-8">
              Finden Sie qualifizierte Geschäftskontakte mit unserem leistungsstarken Tool und steigern Sie Ihren Vertriebserfolg.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/auth">
                <Button size="lg" className="rounded-full px-6 py-5 h-auto text-base font-medium bg-primary hover:bg-primary/90 transition-all duration-300">
                  Kostenloses Konto erstellen <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            {/* Rating Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-center"
            >
              <div className="flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg mt-2">5/5 Bewertungen</p>
              <p className="text-muted-foreground">Über 1000 zufriedene Kunden</p>
            </motion.div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-2 gap-8">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-sm p-6 rounded-xl text-center"
              >
                <div className="flex flex-col items-center">
                  <img 
                    src="/public/dsgvo-logo.svg" 
                    alt="DSGVO" 
                    className="h-8 mb-2"
                    loading="lazy"
                  />
                  <h3 className="text-lg font-medium">DSGVO-konform</h3>
                  <p className="text-sm text-muted-foreground">Höchste Sicherheitsstandards</p>
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-sm p-6 rounded-xl text-center"
              >
                <img 
                  src="/public/hamburg-coa.svg" 
                  alt="Hamburg" 
                  className="h-8 mb-2"
                  loading="lazy"
                />
                <h3 className="text-lg font-medium">Hamburg</h3>
                <p className="text-sm text-muted-foreground">Entwickelt für den DACH-Raum</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Desktop Optimiert */}
      <section className="bg-muted/5 py-16">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Einfache Lead-Generierung mit LeadScraper</h2>
            <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Unser Tool bietet alles, was Sie für eine erfolgreiche Lead-Generierung benötigen
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="group bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <SearchIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Präzise Suche</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Finden Sie genau die Leads, die Sie suchen, mit unseren fortschrittlichen Filteroptionen.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <GlobeIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Globale Abdeckung</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Zugriff auf Millionen von Unternehmen in Deutschland und weltweit, regelmäßig aktualisiert.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="group bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Verifizierte Daten</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Alle Daten werden vor dem Export validiert, um höchste Qualitätsstandards zu gewährleisten.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section - Desktop Optimiert */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">So einfach funktioniert Leadscraper.de</h2>
            <p className="text-base lg:text-lg text-muted-foreground">
              Starten Sie in nur 3 Schritten mit der automatisierten Lead-Generierung
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-background/60 backdrop-blur-lg p-8 rounded-2xl border border-primary/10 relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">1</div>
              <h3 className="text-lg font-semibold mb-3">Registrieren & Suchfilter setzen</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Wählen Sie Standort, Branche & weitere Kriterien für Ihre Leads.
              </p>
            </div>
            <div className="bg-background/60 backdrop-blur-lg p-8 rounded-2xl border border-primary/10 relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">2</div>
              <h3 className="text-lg font-semibold mb-3">Leads automatisch generieren</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Unser System sammelt geprüfte Kontaktdaten in Echtzeit.
              </p>
            </div>
            <div className="bg-background/60 backdrop-blur-lg p-8 rounded-2xl border border-primary/10 relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">3</div>
              <h3 className="text-lg font-semibold mb-3">Leads herunterladen & kontaktieren</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Exportieren Sie Ihre Leads als CSV und starten Sie Ihre Kampagne.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strengths Section - Desktop Optimiert */}
      <section className="bg-muted/5 py-16">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Was uns auszeichnet</h2>
            <p className="text-base lg:text-lg text-muted-foreground">
              Wir setzen neue Maßstäbe in der B2B-Lead-Generierung
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1">
              <div className="shrink-0 bg-primary/10 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2">Größte B2B-Kontaktdatenbank</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Millionen verifizierter Geschäftskontakte in Deutschland
                </p>
              </div>
            </div>
            <div className="group flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1">
              <div className="shrink-0 bg-primary/10 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2">KI-gestützte Filterung</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Innovative Technologie für präzise Zielgruppenauswahl
                </p>
              </div>
            </div>
            <div className="group flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1">
              <div className="shrink-0 bg-primary/10 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2">100% DSGVO-konform</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Alle Prozesse entsprechen den aktuellen Datenschutzrichtlinien
                </p>
              </div>
            </div>
            <div className="group flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1">
              <div className="shrink-0 bg-primary/10 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <BarChart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2">Beste Datenqualität</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Kontinuierlich geprüfte und aktualisierte Kontaktdaten
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="bg-muted/10 py-16">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Für wen ist Leadscraper.de gemacht?</h2>
            <p className="text-base lg:text-lg text-muted-foreground">
              Perfekt abgestimmt auf die Bedürfnisse verschiedener Branchen
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <div key={index} className="group bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    {industry.icon}
                  </div>
                  <h3 className="text-base font-medium">{industry.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{industry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="bg-muted/5 py-16">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center mb-12"
          >
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Warum LeadScraper?</h2>
            <p className="text-base lg:text-lg text-muted-foreground">
              Unser Tool wurde entwickelt, um Ihren Vertriebsprozess zu optimieren
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all hover:-translate-y-1 duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <h3 className="text-base font-medium">{benefit.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-center">Häufig gestellte Fragen</h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AccordionItem value={`item-${index + 1}`} className="border border-primary/10 rounded-lg overflow-hidden backdrop-blur-sm">
                    <AccordionTrigger className="text-base px-4 hover:no-underline hover:bg-primary/5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground px-4 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
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
    icon: <Code className="h-5 w-5 text-primary" />,
    description: "Maßgeschneiderte Lead-Generierung für innovative Technologieunternehmen"
  },
  {
    title: "Marketing & Werbung",
    icon: <Megaphone className="h-5 w-5 text-primary" />,
    description: "Gezielte Leads für Agenturen und Marketingdienstleister"
  },
  {
    title: "Beratung & Consulting",
    icon: <Users className="h-5 w-5 text-primary" />,
    description: "Qualifizierte Kontakte für Berater und Consultants"
  },
  {
    title: "Handel & E-Commerce",
    icon: <ShoppingCart className="h-5 w-5 text-primary" />,
    description: "B2B-Kontakte für Händler und Online-Shops"
  },
  {
    title: "Finanzen & Versicherung",
    icon: <Wallet className="h-5 w-5 text-primary" />,
    description: "Relevante Leads für Finanzdienstleister"
  },
  {
    title: "Handwerk & Industrie",
    icon: <Factory className="h-5 w-5 text-primary" />,
    description: "Zielgerichtete Kontakte für produzierende Unternehmen"
  }
];

const benefits = [
  {
    title: "Große Datenbank",
    icon: <Database className="h-5 w-5 text-primary" />,
    description: "Zugriff auf Millionen von Unternehmenskontakten in Deutschland und weltweit."
  },
  {
    title: "Zielgenaue Filterung",
    icon: <Target className="h-5 w-5 text-primary" />,
    description: "Filtern Sie nach Branche, Standort, Unternehmensgröße und mehr."
  },
  {
    title: "DSGVO-konform",
    icon: <ShieldCheck className="h-5 w-5 text-primary" />,
    description: "Alle Daten werden unter Einhaltung der Datenschutzgrundverordnung verarbeitet."
  },
  {
    title: "API-Zugang",
    icon: <Code className="h-5 w-5 text-primary" />,
    description: "Integrieren Sie LeadScraper nahtlos in Ihre bestehenden Systeme."
  },
  {
    title: "Einfacher Export",
    icon: <Download className="h-5 w-5 text-primary" />,
    description: "Exportieren Sie Ihre Leads in verschiedenen Formaten wie CSV, Excel oder direkt in Ihr CRM."
  },
  {
    title: "Günstiger als die Konkurrenz",
    icon: <Coins className="h-5 w-5 text-primary" />,
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