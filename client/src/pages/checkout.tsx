/// <reference types="vite/client" />

import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeftIcon, CreditCard } from "lucide-react";
import { DSGVOBadge } from "@/components/ui/dsgvo-badge";
import { Footer } from "@/components/layout/footer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

const billingSchema = z.object({
  companyName: z.string().min(1, "Firmenname ist erforderlich"),
  street: z.string().min(1, "Straße ist erforderlich"),
  city: z.string().min(1, "Stadt ist erforderlich"),
  postalCode: z.string().min(5, "PLZ muss mindestens 5 Zeichen lang sein"),
  vatId: z.string().optional()
});

type BillingFormData = z.infer<typeof billingSchema>;

const CheckoutForm = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const form = useForm<BillingFormData>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      companyName: "",
      street: "",
      city: "",
      postalCode: "",
      vatId: ""
    }
  });

  const onSubmitBilling = async (data: BillingFormData) => {
    try {
      const response = await apiRequest("POST", "/api/save-billing-info", data);
      if (response.ok) {
        setShowPayment(true);
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Billing-Informationen konnten nicht gespeichert werden",
        variant: "destructive",
      });
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
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
        toast({
          title: "Zahlung fehlgeschlagen",
          description: error.message || "Ein Fehler ist aufgetreten",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: "Bei der Verarbeitung der Zahlung ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!showPayment) {
    return (
      <form onSubmit={form.handleSubmit(onSubmitBilling)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="companyName">Firmenname *</Label>
            <Input 
              id="companyName"
              {...form.register("companyName")}
              placeholder="Ihre Firma GmbH"
            />
            {form.formState.errors.companyName && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.companyName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="street">Straße und Hausnummer *</Label>
            <Input 
              id="street"
              {...form.register("street")}
              placeholder="Musterstraße 123"
            />
            {form.formState.errors.street && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.street.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postalCode">PLZ *</Label>
              <Input 
                id="postalCode"
                {...form.register("postalCode")}
                placeholder="12345"
              />
              {form.formState.errors.postalCode && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.postalCode.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="city">Ort *</Label>
              <Input 
                id="city"
                {...form.register("city")}
                placeholder="Berlin"
              />
              {form.formState.errors.city && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.city.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="vatId">USt-IdNr. (optional)</Label>
            <Input 
              id="vatId"
              {...form.register("vatId")}
              placeholder="DE123456789"
            />
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg">
          Weiter zur Zahlung
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handlePayment} className="space-y-6">
      <div className="rounded-lg border border-border p-4 bg-muted/5">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">Ausgewähltes Paket</h3>
            <p className="text-sm text-muted-foreground">{CREDIT_PACKAGES[amount]?.credits} Credits</p>
          </div>
          <div className="text-right">
            <p className="font-medium">{amount}€</p>
            <p className="text-sm text-muted-foreground">zzgl. MwSt.</p>
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

      <p className="text-xs text-center text-muted-foreground">
        Mit der Zahlung akzeptieren Sie unsere AGB und Datenschutzbestimmungen
      </p>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [match, params] = useRoute("/checkout/:amount");
  const { toast } = useToast();

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
        const data = await response.json();

        if (!data.clientSecret) {
          throw new Error('Keine Client Secret in der Antwort');
        }

        setClientSecret(data.clientSecret);
      } catch (error: any) {
        console.error('Fehler beim Erstellen der Zahlung:', error);
        setError('Fehler beim Erstellen der Zahlung');
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
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow py-20 px-4">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Fehler</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard">
                  <Button className="w-full">
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Zurück zum Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow py-20 px-4">
        <div className="max-w-md mx-auto space-y-8">
          <Link href="/dashboard">
            <Button variant="outline" className="w-full">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Zurück zum Dashboard
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Kreditpaket kaufen</CardTitle>
              <CardDescription>
                Bitte geben Sie Ihre Rechnungsinformationen ein
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
                <CheckoutForm amount={amount} />
              </Elements>
            </CardContent>
          </Card>

          <DSGVOBadge />
        </div>
      </div>
      <Footer />
    </div>
  );
}