import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { MailIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-10 px-4 border-t border-muted/20">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="text-2xl font-bold text-primary mb-2">LeadScraper</div>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} LeadScraper GmbH. Alle Rechte vorbehalten.</p>
          </div>
          <div className="flex flex-col items-center mb-6 md:mb-0">
            <div className="flex items-center gap-2 text-primary mb-2">
              <MailIcon className="w-4 h-4" />
              <span className="font-medium">Support & Rückfragen:</span>
            </div>
            <a href="mailto:info@leadscraper.de" className="text-primary hover:underline">
              info@leadscraper.de
            </a>
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
  );
}