import { PriceCard } from "./price-card";

export function PricingSection() {
  const handleSelect = (credits: number) => {
    // Handle selection logic
    console.log(`Selected ${credits} credits`);
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
          />
          <PriceCard
            credits={250}
            price={200}
            onSelect={() => handleSelect(250)}
          />
          <PriceCard
            credits={500}
            price={350}
            isRecommended
            onSelect={() => handleSelect(500)}
          />
          <PriceCard
            credits={1000}
            price={600}
            onSelect={() => handleSelect(1000)}
          />
        </div>
      </div>
    </div>
  );
}
