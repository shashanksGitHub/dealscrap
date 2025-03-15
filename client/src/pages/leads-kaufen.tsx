import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { Footer } from "@/components/layout/footer";
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck,
  Users,
  LineChart,
  Settings
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function LeadsKaufenPage() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Leads kaufen » Der ultimative Ratgeber 2025 | LeadScraper</title>
        <meta name="description" content="Leads kaufen leicht gemacht ✓ Alle wichtigen Informationen über B2B Lead-Generierung ✓ Kosten & Qualität ✓ Rechtliche Aspekte ✓ Best Practices & Tipps" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Leads kaufen » Der ultimative Ratgeber 2025 | LeadScraper" />
        <meta property="og:description" content="Leads kaufen leicht gemacht ✓ Alle wichtigen Informationen über B2B Lead-Generierung ✓ Kosten & Qualität ✓ Rechtliche Aspekte ✓ Best Practices & Tipps" />
      </Helmet>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-24 relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(black,transparent_70%)] -z-10" />
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-violet-500/10 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-2000" />

          <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-6">
                Leads kaufen – Hochwertige B2B-Kontakte in Sekunden erhalten
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Erhalten Sie sofort qualifizierte Leads für Ihr Business – gefiltert nach Branche, Standort & Unternehmensgröße.
              </p>
            </div>
          </div>
        </section>

        {/* Warum Leads kaufen? */}
        <section className="py-24 bg-muted/5">
          <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="scroll-m-20 text-3xl font-bold tracking-tight mb-8 text-center">
                Warum Leads kaufen dein Business schneller wachsen lässt
              </h2>
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <h3 className="font-medium mb-2">Keine Kaltakquise mehr</h3>
                    <p className="text-sm text-muted-foreground">Erhalte sofort geprüfte Kontakte statt mühsamer Recherchen</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <h3 className="font-medium mb-2">Zeitersparnis für dein Team</h3>
                    <p className="text-sm text-muted-foreground">Konzentriere dich auf Abschlüsse statt auf Suche</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <h3 className="font-medium mb-2">Passgenaue Kontakte</h3>
                    <p className="text-sm text-muted-foreground">Filtere Leads nach Branche, Standort & Unternehmensgröße</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <h3 className="font-medium mb-2">Sofortige Lieferung</h3>
                    <p className="text-sm text-muted-foreground">Erhalte deine Leads direkt im Dashboard & als CSV-Export</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* So funktioniert's */}
        <section className="py-24">
          <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
            <h2 className="scroll-m-20 text-3xl font-bold tracking-tight mb-12 text-center">
              In 3 Schritten zu deinen perfekten Leads
            </h2>
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10">
                <LineChart className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-medium text-lg mb-2">1. Registrieren & Filter setzen</h3>
                <p className="text-sm text-muted-foreground">
                  Definiere Standort, Branche & weitere Kriterien für deine Wunschkunden
                </p>
              </div>
              <div className="bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-medium text-lg mb-2">2. Automatische Lead-Generierung</h3>
                <p className="text-sm text-muted-foreground">
                  Unser System scannt aktuelle Unternehmensdaten und filtert relevante Kontakte heraus
                </p>
              </div>
              <div className="bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10">
                <Settings className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-medium text-lg mb-2">3. Leads sofort nutzen</h3>
                <p className="text-sm text-muted-foreground">
                  Exportiere deine Leads als CSV oder nutze sie direkt in deinem CRM
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Branchen & Anwendungsfälle */}
        <section className="py-24 bg-muted/5">
          <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
            <h2 className="scroll-m-20 text-3xl font-bold tracking-tight mb-12 text-center">
              Leads kaufen – Branchen & Anwendungsfälle
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border bg-background/50 backdrop-blur-sm">
                <h3 className="font-medium text-lg mb-3">B2B Leads</h3>
                <p className="text-muted-foreground">Perfekt für Agenturen, Berater & SaaS-Unternehmen</p>
              </div>
              <div className="p-6 rounded-xl border bg-background/50 backdrop-blur-sm">
                <h3 className="font-medium text-lg mb-3">Immobilien Leads</h3>
                <p className="text-muted-foreground">Finde Unternehmen, die in neue Gewerbeimmobilien investieren</p>
              </div>
              <div className="p-6 rounded-xl border bg-background/50 backdrop-blur-sm">
                <h3 className="font-medium text-lg mb-3">E-Commerce Leads</h3>
                <p className="text-muted-foreground">Generiere Händlerkontakte für dein Online-Geschäft</p>
              </div>
              <div className="p-6 rounded-xl border bg-background/50 backdrop-blur-sm">
                <h3 className="font-medium text-lg mb-3">Handwerker Leads</h3>
                <p className="text-muted-foreground">Erreiche Facility Manager & Bauunternehmen</p>
              </div>
              <div className="p-6 rounded-xl border bg-background/50 backdrop-blur-sm">
                <h3 className="font-medium text-lg mb-3">Finanz- & Versicherungsleads</h3>
                <p className="text-muted-foreground">Verkaufe gezielt an Unternehmen mit Bedarf</p>
              </div>
              <div className="p-6 rounded-xl border bg-background/50 backdrop-blur-sm">
                <h3 className="font-medium text-lg mb-3">IT & Software Leads</h3>
                <p className="text-muted-foreground">Finde Unternehmen, die deine digitalen Lösungen brauchen</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="scroll-m-20 text-3xl font-bold tracking-tight mb-12 text-center">
                Häufig gestellte Fragen zum Lead-Kauf
              </h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Was kostet ein B2B Lead durchschnittlich?</AccordionTrigger>
                  <AccordionContent>
                    Die Kosten für B2B Leads variieren stark nach Qualität und Branche. Klassische Anbieter verlangen zwischen 50€ und 200€ pro Lead. Mit LeadScraper können Sie hochwertige Leads bereits ab 1€ generieren.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Wie erkenne ich qualitativ hochwertige Leads?</AccordionTrigger>
                  <AccordionContent>
                    Hochwertige Leads zeichnen sich durch aktuelle und vollständige Kontaktdaten, verifizierte Firmeninformationen und eine präzise Zielgruppenpassung aus.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Sind gekaufte Leads DSGVO-konform?</AccordionTrigger>
                  <AccordionContent>
                    LeadScraper garantiert zu 100% DSGVO-konforme Lead-Generierung.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex gap-4 justify-center">
                <Link href="/auth">
                  <Button size="lg" className="rounded-full">
                    Kostenlos registrieren <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}