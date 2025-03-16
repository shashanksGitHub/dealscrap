import { useState } from 'react';
import { PriceCard } from "./price-card";
import { MollieCheckoutModal } from "./mollie-checkout-modal";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export function PricingSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleSelect = async (price: number) => {
    try {
      setIsProcessing(true);
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: price })
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.message.includes('Payment service is not available')) {
          toast({
            title: "Service nicht verfügbar",
            description: "Das Zahlungssystem ist derzeit nicht verfügbar. Bitte versuchen Sie es später erneut.",
            variant: "destructive"
          });
          return;
        }
        throw new Error(data.message);
      }

      setSelectedPrice(price);
      setShowCheckoutModal(true);
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message || "Ein unerwarteter Fehler ist aufgetreten",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseCheckout = () => {
    setShowCheckoutModal(false);
    setSelectedPrice(null);
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

        {showCheckoutModal && (
          <MollieCheckoutModal
            isOpen={showCheckoutModal}
            onClose={handleCloseCheckout}
            amount={selectedPrice || 0}
          />
        )}

        {isProcessing && (
          <div className="mt-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-2 text-muted-foreground">Zahlungsvorgang wird vorbereitet...</p>
          </div>
        )}
      </div>
    </div>
  );
}