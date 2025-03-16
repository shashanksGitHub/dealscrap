import { useState } from 'react';
import { PriceCard } from "./price-card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

export function PricingSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelect = async (price: number) => {
    setIsProcessing(true);
    try {
      console.log('Initiating payment for amount:', price);
      const response = await apiRequest("POST", "/api/business-info", {
        amount: price,
        companyName: user?.companyName || "",
        vatId: user?.vatId || "",
        street: user?.street || "",
        city: user?.city || "",
        postalCode: user?.postalCode || "",
        country: user?.country || "DE"
      });

      const { checkoutUrl } = await response.json();
      console.log('Received checkout URL:', checkoutUrl);

      if (checkoutUrl) {
        // Direkt zum Mollie Checkout weiterleiten
        window.location.href = checkoutUrl;
      } else {
        throw new Error('Keine Checkout-URL erhalten');
      }
    } catch (error: any) {
      console.error('Error initiating payment:', error);
      toast({
        title: "Fehler",
        description: "Bei der Zahlungsvorbereitung ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Credits kaufen</h2>
          <p className="text-lg text-muted-foreground">
            Wählen Sie das passende Paket für Ihre Bedürfnisse
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <PriceCard
            credits={100}
            price={100}
            onSelect={() => handleSelect(100)}
            disabled={isProcessing}
          />
          <PriceCard
            credits={250}
            price={200}
            onSelect={() => handleSelect(200)}
            disabled={isProcessing}
          />
          <PriceCard
            credits={500}
            price={350}
            isRecommended
            onSelect={() => handleSelect(350)}
            disabled={isProcessing}
          />
          <PriceCard
            credits={1000}
            price={600}
            onSelect={() => handleSelect(600)}
            disabled={isProcessing}
          />
        </div>

        {isProcessing && (
          <div className="mt-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2 text-muted-foreground">Zahlungsvorgang wird vorbereitet...</p>
          </div>
        )}
      </div>
    </div>
  );
}