import { Link } from "wouter";

export function SimpleFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center mb-8">
          <img 
            src="/images/leadscraper-logo.png" 
            alt="LeadScraper" 
            className="h-10"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-3">Unternehmen</h3>
            <ul className="space-y-2">
              <li><Link href="/impressum" className="text-muted-foreground hover:text-primary">Impressum</Link></li>
              <li><Link href="/datenschutz" className="text-muted-foreground hover:text-primary">Datenschutz</Link></li>
              <li><Link href="/agb" className="text-muted-foreground hover:text-primary">AGB</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/kontakt" className="text-muted-foreground hover:text-primary">Kontakt</Link></li>
              <li><a href="mailto:support@leadscraper.de" className="text-muted-foreground hover:text-primary">E-Mail Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Ressourcen</h3>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
              <li><Link href="/leads-kaufen" className="text-muted-foreground hover:text-primary">Leads kaufen</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} LeadScraper. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
