import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Lock, ShieldCheck, CreditCard, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-[1200px] mx-auto py-16 px-6 lg:px-8">
        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Bereit, Ihre Lead-Generierung zu revolutionieren?</h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8 md:mb-10 max-w-2xl mx-auto">
            Starten Sie noch heute mit LeadScraper und entdecken Sie, wie einfach moderne Lead-Generierung sein kann.
          </p>
          <Link href="/auth">
            <Button size="lg" className="w-full sm:w-auto rounded-full px-6 md:px-8 py-4 md:py-6 h-auto text-base md:text-lg font-medium">
              Jetzt kostenloses Konto erstellen
            </Button>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Fragen? Kontaktieren Sie unseren Support unter{" "}
            <a href="mailto:support@leadscraper.de" className="text-primary hover:underline">
              support@leadscraper.de
            </a>
          </p>
        </div>

        {/* Trust Badges */}
        <div className="mb-16 pt-8 border-t">
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="bg-primary/5 p-2 rounded-full">
                <Lock className="h-4 w-4 text-primary" />
              </div>
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="bg-primary/5 p-2 rounded-full">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
              <span>DSGVO-konform</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="bg-primary/5 p-2 rounded-full">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <span>Sichere Zahlung</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="bg-primary/5 p-2 rounded-full">
                <Award className="h-4 w-4 text-primary" />
              </div>
              <span>Geprüfte Qualität</span>
            </div>
          </div>
        </div>

        {/* Made in Germany Badge */}
        <div className="flex justify-center mb-16">
          <div className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-xl p-4 flex items-center gap-3">
            <div className="relative w-6 h-4 rounded overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-black"></div>
              <div className="absolute inset-y-0 w-full bg-red-600" style={{ top: '33.33%' }}></div>
              <div className="absolute inset-y-0 w-full bg-yellow-400" style={{ top: '66.66%' }}></div>
            </div>
            <span className="font-medium">Made in Germany</span>
          </div>
        </div>

        {/* Footer Links & Copyright */}
        <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground">
          <div className="flex justify-center gap-8">
            <Link href="/impressum" className="hover:text-primary transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-primary transition-colors">
              Datenschutz
            </Link>
            <Link href="/agb" className="hover:text-primary transition-colors">
              AGB
            </Link>
          </div>
          <p>&copy; {new Date().getFullYear()} LeadScraper. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;