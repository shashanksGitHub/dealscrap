import { useState } from 'react';
import { useAuth } from "@/hooks/auth"; // Fixed import path
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export function PricingSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [credits, setCredits] = useState<number>(50);

  // Berechne den Preis basierend auf der Credit-Anzahl
  const calculatePrice = (credits: number) => {
    // Staffelung: Je mehr Credits, desto günstiger pro Credit
    if (credits <= 100) return credits * 1; // 1€ pro Credit
    if (credits <= 250) return credits * 0.8; // 0.80€ pro Credit
    if (credits <= 500) return credits * 0.7; // 0.70€ pro Credit
    return credits * 0.6; // 0.60€ pro Credit ab 500
  };
  console.log('Calculating price for:', credits);
  const price = Math.round(calculatePrice(credits));
  console.log('Calculated price:', price);

  const handleSelect = async () => {
    if (!user) {
      toast({
        title: "Login erforderlich",
        description: "Bitte melden Sie sich an, um Credits zu kaufen.",
      });
      navigate("/auth");
      return;
    }

    try {
      setIsProcessing(true);
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: price, credits })
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 503) {
          toast({
            title: "Service nicht verfügbar",
            description: "Das Zahlungssystem ist derzeit nicht verfügbar. Bitte versuchen Sie es später erneut.",
            variant: "destructive"
          });
          return;
        }
        throw new Error(data.message || 'Ein Fehler ist aufgetreten');
      }

      if (data.checkoutUrl) {
        // Add success message before redirect
        toast({
          title: "Weiterleitung",
          description: "Sie werden zum sicheren Zahlungsformular weitergeleitet..."
        });
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('Keine Checkout-URL erhalten');
      }
    } catch (error: any) {
      console.log('error-----', error);
      console.error('Payment error:', error);
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Credits kaufen</h2>
          <p className="text-lg text-muted-foreground">
            Wählen Sie die gewünschte Anzahl an Credits
          </p>
        </div>

        <Card className="p-8">
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium mb-2">
                Anzahl Credits: {credits}
              </label>
              <Slider
                value={[credits]}
                onValueChange={(values) => setCredits(values[0])}
                min={50}
                max={1000}
                step={50}
                className="w-full"
                disabled={isProcessing}
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>50</span>
                <span>1000</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {price} €
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                {(price / credits).toFixed(2)}€ pro Credit
              </p>

              <button
                onClick={handleSelect}
                disabled={isProcessing}
                className="w-full bg-primary text-primary-foreground rounded-lg px-6 py-3 font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 relative"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" />
                    <span>Verarbeitung...</span>
                  </div>
                ) : (
                  `${credits} Credits für ${price}€ kaufen`
                )}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}