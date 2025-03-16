import { useEffect, useState } from 'react';
import { useRoute, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessInfoSchema, type BusinessInfo } from "@shared/schema";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftIcon, CreditCard, Loader2 } from "lucide-react";
import { DSGVOBadge } from "@/components/ui/dsgvo-badge";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Only initialize Stripe if public key is available
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const CREDIT_PACKAGES: Record<string, { credits: number; price: number }> = {
  '100': { credits: 100, price: 100 },
  '200': { credits: 250, price: 200 },
  '350': { credits: 500, price: 350 },
  '600': { credits: 1000, price: 600 }
};

const COUNTRIES = [
  { value: 'DE', label: 'Deutschland' },
  { value: 'AT', label: 'Österreich' },
  { value: 'CH', label: 'Schweiz' }
];

const CheckoutForm = ({ customerId, amount }: { customerId: string; amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { refreshUserData } = useAuth();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe or elements not initialized');
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
        redirect: 'if_required',
      });

      if (error) {
        console.error('Payment confirmation error:', error);
        toast({
          title: "Zahlung fehlgeschlagen",
          description: error.message || "Ein Fehler ist aufgetreten",
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment successful:', paymentIntent);

        await refreshUserData();

        toast({
          title: "Zahlung erfolgreich",
          description: "Ihre Credits wurden gutgeschrieben",
        });

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      }
    } catch (error: any) {
      console.error('Payment processing error:', error);
      toast({
        title: "Fehler",
        description: "Bei der Verarbeitung der Zahlung ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-6">
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
  const [match, params] = useRoute("/checkout/:amount");
  const { user } = useAuth();
  const { toast } = useToast();
  const [showBusinessForm, setShowBusinessForm] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);

  const form = useForm<BusinessInfo>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      companyName: "",
      vatId: "",
      street: "",
      city: "",
      postalCode: "",
      country: "DE"
    }
  });

  useEffect(() => {
    if (!match || !params?.amount || !CREDIT_PACKAGES[params.amount]) {
      window.location.href = "/dashboard";
    }
  }, [match, params?.amount]);

  const amount = params?.amount ? parseInt(params.amount) : 0;
  const creditPackage = CREDIT_PACKAGES[amount];

  if (!creditPackage) {
    return null;
  }

  const onSubmit = async (data: BusinessInfo) => {
    try {
      if (!stripePromise) {
        toast({
          title: "Zahlungssystem nicht verfügbar",
          description: "Das Zahlungssystem ist temporär nicht verfügbar. Bitte versuchen Sie es später erneut.",
          variant: "destructive"
        });
        return;
      }

      // First, save business information and get Stripe customer
      const response = await apiRequest("POST", "/api/business-info", data);
      const { customerId } = await response.json();
      setCustomerId(customerId);

      // Then create payment intent
      const paymentResponse = await apiRequest("POST", "/api/create-payment-intent", {
        amount,
        customerId
      });
      const { clientSecret } = await paymentResponse.json();

      setClientSecret(clientSecret);
      setShowBusinessForm(false);
    } catch (error: any) {
      console.error('Error setting up payment:', error);
      toast({
        title: "Fehler",
        description: error.response?.data?.message || "Die Zahlungsvorbereitung ist fehlgeschlagen. Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
    }
  };

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
              <CardTitle>{showBusinessForm ? "Kreditpaket kaufen" : "Bezahlung"}</CardTitle>
              <CardDescription>
                {showBusinessForm 
                  ? "Bitte geben Sie Ihre Unternehmensdaten für die Rechnung ein"
                  : "Bitte schließen Sie die Zahlung ab"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border p-4 bg-muted/5 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Ausgewähltes Paket</h3>
                    <p className="text-sm text-muted-foreground">{creditPackage.credits} Credits</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{amount}€</p>
                    <p className="text-sm text-muted-foreground">zzgl. MwSt.</p>
                  </div>
                </div>
              </div>

              {showBusinessForm ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Firmenname</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vatId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>USt-IdNr. (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Straße und Hausnummer</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PLZ</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stadt</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Land</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Wählen Sie ein Land" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {COUNTRIES.map(country => (
                                <SelectItem key={country.value} value={country.value}>
                                  {country.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      Weiter zur Zahlung
                    </Button>
                  </form>
                </Form>
              ) : clientSecret && customerId && stripePromise ? (
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
                  <CheckoutForm amount={amount} customerId={customerId} />
                </Elements>
              ) : (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
            </CardContent>
          </Card>

          <DSGVOBadge />
        </div>
      </div>
      <Footer />
    </div>
  );
}