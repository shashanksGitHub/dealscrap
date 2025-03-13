
import { Link } from "wouter";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Kontakt() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4">
        <Link href="/" className="inline-flex items-center text-primary hover:underline mb-8">
          <ArrowLeftIcon className="h-4 w-4 mr-2" /> Zurück zur Startseite
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">Kontakt</h1>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Unsere Kontaktdaten</h2>
              <p className="mb-4">
                LeadScraper GmbH<br />
                Musterstraße 123<br />
                12345 Musterstadt<br />
                Deutschland
              </p>
              <p className="mb-4">
                Telefon: +49 123 456789<br />
                E-Mail: info@leadscaper.example
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Geschäftszeiten</h2>
              <p className="mb-1">Montag - Freitag: 9:00 - 17:00 Uhr</p>
              <p>Samstag & Sonntag: Geschlossen</p>
            </section>
          </div>
          
          <div className="bg-card p-6 rounded-xl border border-muted/30">
            <h2 className="text-xl font-semibold mb-4">Kontaktformular</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full p-2 rounded-md border border-muted/50 bg-background" 
                  placeholder="Ihr Name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">E-Mail</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full p-2 rounded-md border border-muted/50 bg-background" 
                  placeholder="ihre.email@beispiel.de"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">Betreff</label>
                <input 
                  type="text" 
                  id="subject" 
                  className="w-full p-2 rounded-md border border-muted/50 bg-background" 
                  placeholder="Betreff Ihrer Nachricht"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Nachricht</label>
                <textarea 
                  id="message" 
                  rows={5} 
                  className="w-full p-2 rounded-md border border-muted/50 bg-background" 
                  placeholder="Ihre Nachricht an uns"
                ></textarea>
              </div>
              
              <Button type="submit" className="w-full">Nachricht senden</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
