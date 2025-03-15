
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            <h3 className="font-semibold mb-4">Kontakt</h3>
            <p className="text-muted-foreground">
              Email: info@leadscraper.de
            </p>
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
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Deim. Consulting UG. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
