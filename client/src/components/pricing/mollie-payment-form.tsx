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
}

export function MolliePaymentForm({ amount, onSuccess, onError }: MolliePaymentFormProps) {
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
      const mollie = window.Mollie(process.env.MOLLIE_PROFILE_ID, {
        locale: 'de_DE',
        testmode: true // Set to false in production
      });

      // Initialize payment methods
      const methods = ['ideal', 'creditcard', 'bancontact', 'sofort'];
      methods.forEach(method => {
        mollie.createComponent(method);
      });

      setIsLoading(false);
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
      // Your payment processing logic here
      onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      onError(error as Error);
    } finally {
      setIsLoading(false);
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
