import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { Footer } from "@/components/layout/footer";
import { DSGVOBadge } from "@/components/ui/dsgvo-badge";
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  DollarSign, 
  Target, 
  Search,
  ShieldCheck,
  Users,
  LineChart,
  Settings,
  FileCheck
} from "lucide-react";

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
        <section className="pt-20 pb-16 relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(black,transparent_70%)] -z-10" />
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-violet-500/10 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Leads kaufen: Der ultimative Ratgeber für 2025
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Erfahren Sie alles über den professionellen Einkauf von B2B-Leads: Von der Qualitätssicherung bis zur rechtssicheren Nutzung.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/auth">
                  <Button size="lg" className="rounded-full">
                    Jetzt kostenlos testen <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="rounded-full" onClick={() => document.getElementById('was-sind-leads')?.scrollIntoView({ behavior: 'smooth' })}>
                  Mehr erfahren
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Was sind Leads? */}
        <section id="was-sind-leads" className="py-16 bg-muted/5">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold mb-6">Was sind Leads und warum sind sie so wertvoll?</h2>
              <p className="text-muted-foreground mb-6">
                Ein Lead ist ein potenzieller Kunde, der Interesse an Ihren Produkten oder Dienstleistungen gezeigt hat. Im B2B-Bereich sind Leads besonders wertvoll, da sie den ersten Schritt zu langfristigen und lukrativen Geschäftsbeziehungen darstellen.
              </p>
              <div className="grid sm:grid-cols-2 gap-6 mt-8">
                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <h3 className="font-medium mb-2">Qualifizierte Kontakte</h3>
                    <p className="text-sm text-muted-foreground">Vorqualifizierte Geschäftskontakte, die bereits Interesse gezeigt haben</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Target className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <h3 className="font-medium mb-2">Zielgerichtete Akquise</h3>
                    <p className="text-sm text-muted-foreground">Gezielte Ansprache von Unternehmen, die zu Ihrem Angebot passen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Arten von Leads */}
        <section className="py-16">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
            <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-center">Verschiedene Arten von Leads</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10">
                <Search className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Cold Leads</h3>
                <p className="text-sm text-muted-foreground">
                  Geschäftskontakte, die noch nicht mit Ihrer Marke interagiert haben. Diese Leads erfordern intensive Aufbauarbeit.
                </p>
              </div>
              <div className="bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Marketing Qualified Leads</h3>
                <p className="text-sm text-muted-foreground">
                  Kontakte, die bereits Interesse durch Interaktionen mit Ihrem Marketing-Content gezeigt haben.
                </p>
              </div>
              <div className="bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10">
                <DollarSign className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Sales Qualified Leads</h3>
                <p className="text-sm text-muted-foreground">
                  Hochwertige Leads, die bereit für den direkten Verkaufskontakt sind und konkretes Kaufinteresse zeigen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Worauf beim Lead-Kauf achten */}
        <section className="py-16 bg-muted/5">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
            <h2 className="text-2xl lg:text-3xl font-bold mb-6">Worauf Sie beim Lead-Kauf achten sollten</h2>
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Die wichtigsten Qualitätskriterien</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-muted-foreground">Aktualität der Daten (nicht älter als 3 Monate)</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-muted-foreground">Vollständigkeit der Kontaktinformationen</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-muted-foreground">DSGVO-konforme Datenerhebung</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-muted-foreground">Verifizierte Unternehmensangaben</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Häufige Fallstricke vermeiden</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                    <span className="text-muted-foreground">Veraltete oder duplizierte Datensätze</span>
                  </li>
                  <li className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                    <span className="text-muted-foreground">Fehlende Opt-in Nachweise</span>
                  </li>
                  <li className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                    <span className="text-muted-foreground">Intransparente Preismodelle</span>
                  </li>
                  <li className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                    <span className="text-muted-foreground">Mangelnde Zielgruppengenauigkeit</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* LeadScraper Lösung */}
        <section className="py-16">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl lg:text-3xl font-bold mb-6">Die moderne Lösung: LeadScraper</h2>
              <p className="text-muted-foreground mb-8">
                Mit LeadScraper bieten wir Ihnen eine innovative Alternative zum klassischen Lead-Kauf. Generieren Sie hochwertige B2B-Leads in Echtzeit, DSGVO-konform und zu fairen Preisen.
              </p>
              <div className="grid sm:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center p-4">
                  <ShieldCheck className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-medium mb-2">100% DSGVO-konform</h3>
                  <p className="text-sm text-muted-foreground">Rechtssichere Lead-Generierung</p>
                </div>
                <div className="flex flex-col items-center p-4">
                  <LineChart className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-medium mb-2">Beste Datenqualität</h3>
                  <p className="text-sm text-muted-foreground">Verifizierte Geschäftskontakte</p>
                </div>
                <div className="flex flex-col items-center p-4">
                  <Settings className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-medium mb-2">Flexible Filterung</h3>
                  <p className="text-sm text-muted-foreground">Präzise Zielgruppenauswahl</p>
                </div>
              </div>
              <Link href="/auth">
                <Button size="lg" className="rounded-full">
                  Jetzt kostenlos testen <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/5">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-center">Häufig gestellte Fragen zum Lead-Kauf</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Was kostet ein B2B Lead durchschnittlich?</h3>
                  <p className="text-muted-foreground">
                    Die Kosten für B2B Leads variieren stark nach Qualität und Branche. Klassische Anbieter verlangen zwischen 50€ und 200€ pro Lead. Mit LeadScraper können Sie hochwertige Leads bereits ab 1€ generieren.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Wie erkenne ich qualitativ hochwertige Leads?</h3>
                  <p className="text-muted-foreground">
                    Hochwertige Leads zeichnen sich durch aktuelle und vollständige Kontaktdaten, verifizierte Firmeninformationen und eine präzise Zielgruppenpassung aus.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Sind gekaufte Leads DSGVO-konform?</h3>
                  <p className="text-muted-foreground">
                    Nicht automatisch. Achten Sie auf nachweisbare Opt-ins und transparente Datenerhebung. LeadScraper garantiert zu 100% DSGVO-konforme Lead-Generierung.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl lg:text-3xl font-bold mb-6">Starten Sie jetzt mit der professionellen Lead-Generierung</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Testen Sie LeadScraper und überzeugen Sie sich selbst von der Qualität unserer Leads.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/auth">
                  <Button size="lg" className="rounded-full">
                    Kostenlos registrieren <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="mt-8">
                <DSGVOBadge size="sm" className="mx-auto" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
