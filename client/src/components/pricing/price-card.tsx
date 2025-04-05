import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PriceCardProps {
  credits: number;
  price: number;
  isRecommended?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

export function PriceCard({ credits, price, isRecommended, disabled, onSelect }: PriceCardProps) {
  return (
    <Card className={cn(
      "relative transition-all duration-200 hover:shadow-lg",
      isRecommended && "border-primary shadow-md scale-105"
    )}>
      {isRecommended && (
        <Badge 
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground"
        >
          Empfohlen
        </Badge>
      )}
      <CardHeader className="space-y-2 text-center pt-8">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">{credits} Leads</h3>
          <p className="text-4xl font-bold text-primary">€{price}</p>
        </div>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground">
          {isRecommended ? "Bester Preis pro Credit" : `${(price/credits).toFixed(2)}€ pro Credit`}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onSelect}
          className="w-full" 
          variant={isRecommended ? "default" : "outline"}
          disabled={disabled}
        >
          Leads kaufen
        </Button>
      </CardFooter>
    </Card>
  );
}