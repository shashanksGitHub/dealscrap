import { useEffect } from 'react';
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeftIcon } from "lucide-react";
import { DSGVOBadge } from "@/components/ui/dsgvo-badge";
import { Footer } from "@/components/layout/footer";

// Temporary credit packages mapping until we implement new payment system
const CREDIT_PACKAGES: Record<string, { credits: number; price: number }> = {
  '100': { credits: 100, price: 100 },
  '200': { credits: 250, price: 200 },
  '350': { credits: 500, price: 350 },
  '600': { credits: 1000, price: 600 }
};

export default function Checkout() {
  const [match, params] = useRoute("/checkout/:amount");

  useEffect(() => {
    if (!match || !params?.amount || !CREDIT_PACKAGES[params.amount]) {
      // Redirect to dashboard if amount is invalid
      window.location.href = "/dashboard";
    }
  }, [match, params?.amount]);

  const amount = params?.amount ? parseInt(params.amount) : 0;
  const package = CREDIT_PACKAGES[amount];

  if (!package) {
    return null;
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
                Zahlungsabwicklung temporär deaktiviert
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border p-4 bg-muted/5">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Ausgewähltes Paket</h3>
                    <p className="text-sm text-muted-foreground">{package.credits} Credits</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{amount}€</p>
                    <p className="text-sm text-muted-foreground">zzgl. MwSt.</p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-center text-muted-foreground">
                Die Zahlungsabwicklung wird derzeit überarbeitet. Bitte versuchen Sie es später erneut.
              </p>
            </CardContent>
          </Card>

          <DSGVOBadge />
        </div>
      </div>
      <Footer />
    </div>
  );
}