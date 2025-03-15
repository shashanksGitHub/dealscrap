import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto py-16">
        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Bereit, Ihre Lead-Generierung zu revolutionieren?</h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8 md:mb-10 max-w-2xl mx-auto">
            Starten Sie noch heute mit LeadScraper und entdecken Sie, wie einfach moderne Lead-Generierung sein kann.
          </p>
          <Link href="/auth">
            <Button size="lg" className="w-full sm:w-auto rounded-full text-base md:text-lg px-6 md:px-8 py-4 md:py-6 h-auto font-medium">
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

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/impressum" className="text-muted-foreground hover:text-primary">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-muted-foreground hover:text-primary">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="text-muted-foreground hover:text-primary">
                  AGB
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Über uns</h3>
            <p className="text-muted-foreground">
              Deim. Consulting UG<br />
              Randstraße 75<br />
              22525 Hamburg
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Deim. Consulting UG. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;