import { Link } from "wouter";
import { ArrowLeftIcon, ShieldCheck } from "lucide-react";
import { Helmet } from "react-helmet";
import { Footer } from "@/components/layout/footer";

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

        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Datenschutzerklärung</h1>
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">🔒 Unsere Verpflichtung zum Datenschutz</h2>
          <p className="text-muted-foreground">
            Die Deim. Consulting UG legt höchsten Wert auf den Schutz Ihrer personenbezogenen Daten. Wir verarbeiten Ihre Daten ausschließlich im Einklang mit der DSGVO und den geltenden deutschen Datenschutzgesetzen. Unsere Plattform wurde von Grund auf nach den Prinzipien "Privacy by Design" und "Privacy by Default" entwickelt.
          </p>
        </div>

        <div className="space-y-8 max-w-3xl">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Überblick und DSGVO-Konformität</h2>
            <div className="space-y-4">
              <p>
                Wir bei der Deim. Consulting UG haben umfassende Maßnahmen implementiert, um die vollständige Konformität mit der DSGVO sicherzustellen:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Verschlüsselte Datenübertragung (SSL/TLS)</li>
                <li>Regelmäßige Sicherheitsaudits</li>
                <li>Zertifizierte Rechenzentren in der EU</li>
                <li>Dokumentierte Löschkonzepte</li>
                <li>Auftragsverarbeitungsverträge mit allen Dienstleistern</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Verantwortliche Stelle</h2>
            <p>
              Deim. Consulting UG<br />
              Randstraße 75<br />
              22525 Hamburg<br />
              Deutschland
            </p>
            <p className="mt-4">
              Datenschutzbeauftragter:<br />
              E-Mail: info@leadscraper.de
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Verarbeitung personenbezogener Daten</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">3.1 Registrierungsdaten</h3>
              <p>Bei der Registrierung erheben wir folgende Daten:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>E-Mail-Adresse (zur Kontaktaufnahme und Authentifizierung)</li>
                <li>Passwort (verschlüsselt gespeichert)</li>
                <li>Name (optional, für personalisierte Ansprache)</li>
                <li>Unternehmensdaten (optional, für B2B-Funktionalitäten)</li>
              </ul>
              <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Datenverarbeitung bei der Lead-Generierung</h2>
            <div className="space-y-4">
              <p>
                Bei der Lead-Generierung verarbeiten wir ausschließlich öffentlich zugängliche Unternehmensdaten. Diese werden:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ausschließlich aus legalen, öffentlichen Quellen bezogen</li>
                <li>Regelmäßig auf Aktualität überprüft</li>
                <li>Mit Quellenangaben versehen</li>
                <li>Nur nach Prüfung der Rechtmäßigkeit gespeichert</li>
              </ul>
              <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Technische Sicherheitsmaßnahmen</h2>
            <div className="space-y-4">
              <p>Zum Schutz Ihrer Daten setzen wir folgende Maßnahmen ein:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>SSL/TLS-Verschlüsselung für alle Datenübertragungen</li>
                <li>Mehrstufige Firewall-Systeme</li>
                <li>Regelmäßige Sicherheitsupdates</li>
                <li>Verschlüsselte Datenspeicherung</li>
                <li>Zugriffskontrollen und Protokollierung</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Ihre Rechte</h2>
            <div className="space-y-4">
              <p>Nach der DSGVO stehen Ihnen folgende Rechte zu:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
                <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
                <li>Recht auf Löschung (Art. 17 DSGVO)</li>
                <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
              </ul>
              <p>
                Zur Ausübung Ihrer Rechte kontaktieren Sie uns bitte unter:<br />
                info@leadscraper.de
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. Auftragsverarbeiter und Datentransfers</h2>
            <div className="space-y-4">
              <p>
                Wir arbeiten nur mit sorgfältig ausgewählten Dienstleistern zusammen, die alle:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ihren Sitz in der EU haben oder angemessene Garantien bieten</li>
                <li>Einen Auftragsverarbeitungsvertrag nach Art. 28 DSGVO abgeschlossen haben</li>
                <li>Regelmäßig auf Einhaltung der DSGVO überprüft werden</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">8. Datenspeicherung und Löschung</h2>
            <div className="space-y-4">
              <p>
                Ihre Daten werden nur so lange gespeichert, wie es für die genannten Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen dies vorschreiben. Nach Ablauf dieser Fristen werden Ihre Daten automatisch und sicher gelöscht.
              </p>
            </div>
          </section>

          <section className="bg-muted/5 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">Kontakt bei Datenschutzfragen</h2>
            <p>
              Bei Fragen zum Datenschutz können Sie sich jederzeit an unseren Datenschutzbeauftragten wenden:<br /><br />
              Datenschutzbeauftragter<br />
              Deim. Consulting UG<br />
              E-Mail: info@leadscraper.de
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}