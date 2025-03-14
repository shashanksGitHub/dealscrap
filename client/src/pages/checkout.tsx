import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ArrowLeftIcon, CreditCard } from "lucide-react";
import { DSGVOBadge } from "@/components/ui/dsgvo-badge";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CREDIT_PACKAGES: Record<string, { credits: number; price: number }> = {
  '100': { credits: 100, price: 100 },
  '200': { credits: 250, price: 200 },
  '350': { credits: 500, price: 350 },
  '600': { credits: 1000, price: 600 }
};

const CheckoutForm = ({ amount, credits }: { amount: number; credits: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe oder Elements nicht initialisiert');
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        console.error('Zahlungsbestätigung fehlgeschlagen:', error);
        toast({
          title: "Zahlung fehlgeschlagen",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Fehler bei der Zahlungsverarbeitung:', error);
      toast({
        title: "Fehler",
        description: "Bei der Verarbeitung der Zahlung ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-border p-4 bg-muted/5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-medium">Ausgewähltes Paket</h3>
            <p className="text-sm text-muted-foreground">{credits} Credits</p>
          </div>
          <div className="text-right">
            <p className="font-medium">{amount}€</p>
            <p className="text-sm text-muted-foreground">inkl. MwSt.</p>
          </div>
        </div>
      </div>

      <PaymentElement />

      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Zahlung wird verarbeitet...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Jetzt {amount}€ bezahlen
          </>
        )}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [match, params] = useRoute("/checkout/:amount");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const initializePayment = async () => {
      if (!match || !params?.amount) {
        setError("Ungültiger Zahlungsbetrag");
        return;
      }

      const numAmount = parseInt(params.amount, 10);
      if (!CREDIT_PACKAGES[numAmount]) {
        setError("Ungültiges Kreditpaket ausgewählt");
        return;
      }

      setAmount(numAmount);

      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", { amount: numAmount });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Unbekannter Fehler" }));
          throw new Error(errorData.message || 'Fehler beim Erstellen der Zahlung');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error: any) {
        console.error('Fehler beim Erstellen der Zahlung:', error);
        setError(error.message);
        toast({
          title: "Fehler",
          description: "Die Zahlung konnte nicht initialisiert werden. Bitte versuchen Sie es später erneut.",
          variant: "destructive",
        });
      }
    };

    initializePayment();
  }, [match, params?.amount, toast]);

  if (error) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Fehler</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button className="mt-4">
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Zurück zum Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-md mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Kreditpaket kaufen</CardTitle>
            <CardDescription>
              Sicher bezahlen mit Stripe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Elements stripe={stripePromise} options={{ 
              clientSecret,
              appearance: { 
                theme: 'stripe',
                variables: {
                  colorPrimary: '#7c3aed',
                  colorBackground: '#ffffff',
                  colorText: '#1a1a1a',
                }
              } 
            }}>
              <CheckoutForm 
                amount={amount} 
                credits={CREDIT_PACKAGES[amount.toString()]?.credits || 0} 
              />
            </Elements>
          </CardContent>
        </Card>

        <DSGVOBadge />
      </div>
    </div>
  );
}