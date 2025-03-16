import { useState } from 'react';
import { PriceCard } from "./price-card";
import { MollieCheckoutModal } from "./mollie-checkout-modal";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

export function PricingSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleSelect = (price: number) => {
    setSelectedPrice(price);
    setShowCheckoutModal(true);
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

        <MollieCheckoutModal
          isOpen={showCheckoutModal}
          onClose={handleCloseCheckout}
          amount={selectedPrice || 0}
        />

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