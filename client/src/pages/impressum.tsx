import { Link } from "wouter";
import { ArrowLeftIcon } from "lucide-react";
import { Helmet } from "react-helmet";
import { Footer } from "@/components/layout/footer";

export default function Impressum() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="container mx-auto py-12 px-4">
        <Link href="/" className="inline-flex items-center text-primary hover:underline mb-8">
          <ArrowLeftIcon className="h-4 w-4 mr-2" /> Zurück zur Startseite
        </Link>

        <h1 className="text-3xl font-bold mb-8">Impressum</h1>

        <div className="space-y-6 max-w-3xl">
          <section>
            <h2 className="text-xl font-semibold mb-3">Angaben gemäß § 5 TMG</h2>
            <p>Deim. Consulting UG<br />
            Randstraße 75<br />
            22525 Hamburg<br />
            Deutschland</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Kontakt</h2>
            <p>E-Mail: info@leadscraper.de</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Vertreten durch</h2>
            <p>Lara Braun</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Handelsregister</h2>
            <p>Registergericht: Amtsgericht Hamburg<br />
            Registernummer: HRB 164162</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Umsatzsteuer-ID</h2>
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
            DE332747716</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}