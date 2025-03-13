
import { Link } from "wouter";
import { ArrowLeftIcon } from "lucide-react";

export default function Impressum() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4">
        <Link href="/" className="inline-flex items-center text-primary hover:underline mb-8">
          <ArrowLeftIcon className="h-4 w-4 mr-2" /> Zurück zur Startseite
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">Impressum</h1>
        
        <div className="space-y-6 max-w-3xl">
          <section>
            <h2 className="text-xl font-semibold mb-3">Angaben gemäß § 5 TMG</h2>
            <p>LeadScraper GmbH<br />
            Musterstraße 123<br />
            12345 Musterstadt<br />
            Deutschland</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Kontakt</h2>
            <p>Telefon: +49 123 456789<br />
            E-Mail: info@leadscaper.example</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Vertreten durch</h2>
            <p>Max Mustermann<br />
            Geschäftsführer</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Handelsregister</h2>
            <p>Registergericht: Amtsgericht Musterstadt<br />
            Registernummer: HRB 12345</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Umsatzsteuer-ID</h2>
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
            DE123456789</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>Max Mustermann<br />
            Musterstraße 123<br />
            12345 Musterstadt<br />
            Deutschland</p>
          </section>
        </div>
      </div>
    </div>
  );
}
