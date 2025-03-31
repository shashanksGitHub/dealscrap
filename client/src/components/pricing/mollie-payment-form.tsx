import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    Mollie: any;
  }
}

interface MolliePaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: Error) => void;
  creditAmount: number;
}

export function MolliePaymentForm({ creditAmount, amount, onSuccess, onError }: MolliePaymentFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    // Load Mollie Components
    const script = document.createElement('script');
    script.src = 'https://js.mollie.com/v1/mollie.js';
    script.async = true;
    script.onload = initializeMollie;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeMollie = async () => {
    try {
      // Vite-Umgebungsvariablen für Mollie
      const isDev = window.location.hostname.includes('replit') || window.location.hostname === 'localhost';
      let mollieProfileId = undefined;
      
      // In einer echten Produktionsumgebung sollte dies aus den Umgebungsvariablen kommen
      try {
        mollieProfileId = (window as any).__ENV?.VITE_MOLLIE_PROFILE_ID;
      } catch (e) {
        console.warn('Konnte VITE_MOLLIE_PROFILE_ID nicht abrufen');
      }
      
      if (!mollieProfileId) {
        console.warn('Mollie Profil-ID nicht gefunden. Mollie wird im Test-Modus initialisiert.');
      }
      
      // Temporär deaktiviere tatsächliche Mollie-Komponente Initialisierung
      console.log('Initialisiere Mollie-Komponenten (Test-Modus)');
      
      // Wir simulieren das erfolgreiche Laden der Komponenten
      // In einer echten Umgebung mit Mollie Profil-ID würden wir die Mollie-Komponenten initialisieren:
      /*
      const mollie = window.Mollie(mollieProfileId || 'test_profile_id', {
        locale: 'de_DE',
        testmode: isDev
      });

      // Zahlungsmethoden initialisieren
      const methods = ['ideal', 'creditcard', 'bancontact', 'sofort'];
      methods.forEach(method => {
        mollie.createComponent(method);
      });
      */

      // Nach kurzer Verzögerung für die Simulation laden beenden
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error initializing Mollie:', error);
      onError(error as Error);
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie eine Zahlungsmethode",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // API zur Erstellung einer Mollie-Zahlung aufrufen
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          description: `${creditAmount} Guthaben auf LeadScraper`,
          method: selectedMethod,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(await response.text() || 'Zahlungsfehler');
      }

      const { checkoutUrl } = await response.json();
      
      if (checkoutUrl) {
        // Benutzer zur Mollie Checkout-Seite weiterleiten
        window.location.href = checkoutUrl;
      } else {
        throw new Error('Keine Checkout-URL erhalten');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      onError(error as Error);
      setIsLoading(false); // Setze Loading nur zurück, wenn ein Fehler auftritt
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={selectedMethod === 'ideal' ? 'default' : 'outline'}
            onClick={() => setSelectedMethod('ideal')}
          >
            iDEAL
          </Button>
          <Button
            variant={selectedMethod === 'creditcard' ? 'default' : 'outline'}
            onClick={() => setSelectedMethod('creditcard')}
          >
            Kreditkarte
          </Button>
          <Button
            variant={selectedMethod === 'bancontact' ? 'default' : 'outline'}
            onClick={() => setSelectedMethod('bancontact')}
          >
            Bancontact
          </Button>
          <Button
            variant={selectedMethod === 'sofort' ? 'default' : 'outline'}
            onClick={() => setSelectedMethod('sofort')}
          >
            SOFORT
          </Button>
        </div>

        <div id="mollie-payment-component"></div>

        <Button
          onClick={handlePayment}
          className="w-full"
          disabled={!selectedMethod || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verarbeitung...
            </>
          ) : (
            `${amount}€ bezahlen`
          )}
        </Button>
      </div>
    </Card>
  );
}
