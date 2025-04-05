import { Link } from "wouter";
import { ArrowLeftIcon } from "lucide-react";
import { Helmet } from "react-helmet";
import { Footer } from "@/components/layout/footer";

export default function AGB() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="container mx-auto py-12 px-4">
        <Link href="/" className="inline-flex items-center text-primary hover:underline mb-8">
          <ArrowLeftIcon className="h-4 w-4 mr-2" /> Zurück zur Startseite
        </Link>

        <h1 className="text-3xl font-bold mb-8">Allgemeine Geschäftsbedingungen</h1>

        <div className="space-y-6 max-w-3xl">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Geltungsbereich</h2>
            <p className="mb-4">
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen der Deim. Consulting UG, Randstraße 75, 22525 Hamburg (nachfolgend "Anbieter") und ihren Kunden (nachfolgend "Nutzer") über die Nutzung der LeadScraper-Plattform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Leistungsbeschreibung</h2>
            <p className="mb-4">
              Der Anbieter stellt eine Online-Plattform zur Verfügung, die es Nutzern ermöglicht, Unternehmenskontakte und Geschäftsdaten zu sammeln und zu exportieren. Die genaue Leistungsbeschreibung ergibt sich aus der jeweils aktuellen Beschreibung auf der Website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Vertragsschluss und Registrierung</h2>
            <p className="mb-4">
              3.1 Die Registrierung auf der Plattform ist kostenlos. Mit der Registrierung gibt der Nutzer ein Angebot zum Abschluss eines Nutzungsvertrages ab. Der Anbieter nimmt dieses Angebot durch Freischaltung des Zugangs an.
            </p>
            <p className="mb-4">
              3.2 Der Nutzer ist verpflichtet, bei der Registrierung wahrheitsgemäße Angaben zu machen und seine Daten aktuell zu halten.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Nutzungsbedingungen und Kreditsystem</h2>
            <p className="mb-4">
              4.1 Die Nutzung der Plattform erfolgt auf Basis eines Kreditsystems. Für das Sammeln von Leads werden Credits verbraucht, die der Nutzer zuvor erworben hat.
            </p>
            <p className="mb-4">
              4.2 Die jeweils aktuellen Preise für Credits sind auf der Website einsehbar.
            </p>
            <p className="mb-4">
              4.3 Erworbene Credits sind vom Umtausch ausgeschlossen. Eine Rückerstattung von gekauften Credits ist nicht möglich.
            </p>
            <p className="mb-4">
              4.4 Der Nutzer ist verpflichtet, die Plattform nur im Rahmen der geltenden Gesetze zu nutzen und nicht auf eine Weise, die den Betrieb der Plattform beeinträchtigen könnte.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Laufzeit und Kündigung</h2>
            <p className="mb-4">
              5.1 Der Nutzungsvertrag wird auf unbestimmte Zeit geschlossen und kann von beiden Seiten jederzeit ohne Angabe von Gründen gekündigt werden.
            </p>
            <p className="mb-4">
              5.2 Bei Kündigung verfallen nicht verbrauchte Credits ohne Erstattung.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Haftung</h2>
            <p className="mb-4">
              6.1 Der Anbieter haftet nicht für die Richtigkeit, Vollständigkeit und Aktualität der durch die Plattform gesammelten Daten.
            </p>
            <p className="mb-4">
              6.2 Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Schlussbestimmungen</h2>
            <p className="mb-4">
              7.1 Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
            </p>
            <p className="mb-4">
              7.2 Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}