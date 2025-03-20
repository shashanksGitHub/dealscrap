import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Lock, ShieldCheck, CreditCard, Award, Shield } from "lucide-react";
import { useAuth } from "@/hooks/auth"; // Updated import path

export function Footer() {
  const { user } = useAuth();

  return (
    <footer className="bg-background border-t">
      <div className="max-w-[1200px] mx-auto py-16 px-6 lg:px-8">
        {/* CTA Section - Only show when not logged in */}
        {!user && (
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Bereit, Ihre Lead-Generierung zu revolutionieren?</h2>
            <p className="text-base md:text-lg text-muted-foreground mb-8 md:mb-10 max-w-2xl mx-auto">
              Starten Sie noch heute mit LeadScraper und entdecken Sie, wie einfach moderne Lead-Generierung sein kann.
            </p>
            <Link href="/auth">
              <Button size="lg" className="w-full sm:w-auto rounded-full px-6 md:px-8 py-4 md:py-6 h-auto text-base md:text-lg font-medium transition-all duration-300 hover:scale-105 animate-wiggle">
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
        )}

        {/* Trust Icons Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          <div className="flex flex-col items-center text-center p-2">
            <div className="bg-primary/10 p-2 rounded-full mb-2">
              <Lock className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-xs font-medium mb-0.5">SSL-Verschlüsselt</h3>
            <p className="text-[10px] text-muted-foreground">Sichere Datenübertragung</p>
          </div>
          <div className="flex flex-col items-center text-center p-2">
            <div className="bg-primary/10 p-2 rounded-full mb-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-xs font-medium mb-0.5">DSGVO-konform</h3>
            <p className="text-[10px] text-muted-foreground">Höchste Sicherheitsstandards</p>
          </div>
          <div className="flex flex-col items-center text-center p-2">
            <div className="bg-primary/10 p-2 rounded-full mb-2">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-xs font-medium mb-0.5">Sichere Zahlung</h3>
            <p className="text-[10px] text-muted-foreground">Via Stripe & PayPal</p>
          </div>
          <div className="flex flex-col items-center text-center p-2">
            <div className="bg-primary/10 p-2 rounded-full mb-2">
              <Award className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-xs font-medium mb-0.5">Qualitätsgarantie</h3>
            <p className="text-[10px] text-muted-foreground">Geprüfte Kontakte</p>
          </div>
          <div className="flex flex-col items-center text-center p-2">
            <div className="bg-primary/10 p-2 rounded-full mb-2">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-xs font-medium mb-0.5">Made in Germany</h3>
            <p className="text-[10px] text-muted-foreground">Entwickelt in Hamburg</p>
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