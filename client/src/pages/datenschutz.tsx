import { Link } from "wouter";
import { ArrowLeftIcon } from "lucide-react";
import { Helmet } from "react-helmet";

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="container mx-auto py-12 px-4">
        <Link href="/" className="inline-flex items-center text-primary hover:underline mb-8">
          <ArrowLeftIcon className="h-4 w-4 mr-2" /> Zurück zur Startseite
        </Link>

        <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>

        <div className="space-y-6 max-w-3xl">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Datenschutz auf einen Blick</h2>
            <p className="mb-4">
              Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. In dieser Datenschutzerklärung informieren wir Sie über die Verarbeitung Ihrer personenbezogenen Daten auf unserer Website.
            </p>
            <h3 className="text-lg font-medium mb-2">1.1 Verantwortliche Stelle</h3>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br />
              LeadScraper GmbH<br />
              Musterstraße 123<br />
              12345 Musterstadt<br />
              Deutschland<br />
              E-Mail: datenschutz@leadscaper.example
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Datenerfassung auf unserer Website</h2>
            <h3 className="text-lg font-medium mb-2">2.1 Cookies</h3>
            <p className="mb-4">
              Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden. Sie richten keinen Schaden an und enthalten keine Viren. Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
            </p>
            <p className="mb-4">
              Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschließen sowie das automatische Löschen der Cookies beim Schließen des Browsers aktivieren.
            </p>
            <h3 className="text-lg font-medium mb-2">2.2 Nutzerdaten</h3>
            <p className="mb-4">
              Wenn Sie ein Konto bei uns erstellen, erheben wir folgende Daten:<br />
              - E-Mail-Adresse<br />
              - Name<br />
              - Unternehmen (optional)<br />
              - Passwort (verschlüsselt)
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Ihre Rechte</h2>
            <p className="mb-4">
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
            </p>
            <p>
              Bei Fragen zum Datenschutz können Sie sich jederzeit an uns wenden.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}