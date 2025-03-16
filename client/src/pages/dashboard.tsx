import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { SearchIcon, DownloadIcon, PlayCircleIcon, Loader2 } from "lucide-react";
import type { Lead } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [leadCount, setLeadCount] = useState(1); 
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { data: leads = [], isLoading: isLeadsLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
    initialData: [],
    refetchOnWindowFocus: false,
    // Stellen Sie sicher, dass die Leads nach der Scraping-Operation neu geladen werden
    refetchInterval: 5000,
    staleTime: 0 // Consider data immediately stale
  });

  const scrapeMutation = useMutation({
    mutationFn: async (data: { query: string; location: string; count: number }) => {
      if (!data.query.trim() || !data.location.trim()) {
        throw new Error("Suchbegriff und Standort dürfen nicht leer sein");
      }

      if (data.count < 1 || data.count > 100) {
        throw new Error("Bitte wählen Sie zwischen 1 und 100 Leads");
      }

      if (user && user.credits < data.count) {
        throw new Error(`Sie benötigen ${data.count} Credits für diese Suche. Bitte kaufen Sie weitere Credits.`);
      }

      const res = await apiRequest("POST", "/api/scrape", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Erfolgreich",
        description: "Leads erfolgreich gefunden",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleExport = () => {
    if (!leads.length) return;

    const csv = leads.map((lead: Lead) =>
      Object.values(lead).join(",")
    ).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
  };

  const creditPackages = [
    { id: "100", credits: 100, price: 100 },
    { id: "250", credits: 250, price: 200 },
    { id: "500", credits: 500, price: 350, recommended: true },
    { id: "1000", credits: 1000, price: 600 },
  ];

  const handlePurchase = async (price: number) => {
    setIsProcessingPayment(true);
    try {
      console.log('Initiating payment for amount:', price);
      const response = await apiRequest("POST", "/api/create-payment", {
        amount: price
      });

      const data = await response.json();
      console.log('Payment response:', data);

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('Keine Checkout-URL erhalten');
      }
    } catch (error: any) {
      console.error('Error initiating payment:', error);
      toast({
        title: "Fehler",
        description: error.message || "Bei der Zahlungsvorbereitung ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-[1200px] px-6 lg:px-8 py-12 space-y-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <PlayCircleIcon className="w-6 h-6 text-primary" />
              Sehen Sie, wie einfach die Lead-Generierung funktioniert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                src="https://www.loom.com/embed/caafc64aed3a46d1b83262c5e843b7d4?sid=c3c6fcee-4802-4418-bfa8-2b6bde0ef4dc"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <p className="mt-6 text-lg text-muted-foreground text-center">
              In diesem kurzen Video zeige ich Ihnen persönlich, wie Sie mit unserem Tool effizient Business-Leads generieren können.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold tracking-tight">Neue Leads finden</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="query">Unternehmensart</Label>
                  <Input
                    id="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="z.B. Restaurant"
                    disabled={scrapeMutation.isPending}
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Standort</Label>
                  <Input
                    id="location"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="z.B. Berlin"
                    disabled={scrapeMutation.isPending}
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leadCount">Anzahl der Leads</Label>
                  <Input
                    id="leadCount"
                    type="number"
                    min={1}
                    max={100}
                    value={leadCount}
                    onChange={(e) => setLeadCount(parseInt(e.target.value) || 1)}
                    disabled={scrapeMutation.isPending}
                    className="text-base"
                  />
                  <p className="text-sm text-muted-foreground">
                    1 Lead = 1 Credit
                  </p>
                </div>
                <Button
                  onClick={() => scrapeMutation.mutate({ query, location: searchLocation, count: leadCount })}
                  disabled={scrapeMutation.isPending || !user?.credits}
                  className="w-full text-base py-6"
                  size="lg"
                >
                  {scrapeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Suche läuft...
                    </>
                  ) : (
                    <>
                      <SearchIcon className="mr-2 h-5 w-5" />
                      {leadCount} Lead{leadCount !== 1 ? 's' : ''} finden
                    </>
                  )}
                </Button>
                {user?.credits === 0 ? (
                  <p className="text-base text-destructive text-center">
                    Bitte wählen Sie eines der Credit-Pakete
                  </p>
                ) : (
                  <p className="text-base text-muted-foreground text-center">
                    Sie haben noch {user?.credits} Credits verfügbar
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold tracking-tight">Credits kaufen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {creditPackages.map((pkg) => (
                  <Button
                    key={pkg.id}
                    onClick={() => handlePurchase(pkg.price)}
                    variant="outline"
                    className={cn(
                      "relative flex flex-col items-center justify-center gap-2 p-6 h-auto min-h-[140px]",
                      pkg.recommended && "border-2 border-primary shadow-lg"
                    )}
                    disabled={isProcessingPayment}
                  >
                    {pkg.recommended && (
                      <Badge
                        variant="secondary"
                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground"
                      >
                        Empfohlen
                      </Badge>
                    )}
                    <span className="text-2xl font-bold">{pkg.credits} Credits</span>
                    <span className="text-3xl font-bold text-primary">€{pkg.price}</span>
                    {isProcessingPayment && (
                      <Loader2 className="h-4 w-4 animate-spin absolute bottom-2 right-2" />
                    )}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold tracking-tight">Ihre Leads</CardTitle>
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={isLeadsLoading || leads.length === 0}
              size="lg"
            >
              <DownloadIcon className="w-5 h-5 mr-2" />
              Als CSV exportieren
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border">
              {isLeadsLoading ? (
                <div className="p-16 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">Leads werden geladen...</p>
                </div>
              ) : leads.length === 0 ? (
                <div className="p-16 text-center">
                  <p className="text-lg text-muted-foreground">Keine Leads gefunden</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-4 text-left text-base font-medium">Firmenname</th>
                      <th className="p-4 text-left text-base font-medium hidden md:table-cell">Adresse</th>
                      <th className="p-4 text-left text-base font-medium">Telefon</th>
                      <th className="p-4 text-left text-base font-medium hidden md:table-cell">E-Mail</th>
                      <th className="p-4 text-left text-base font-medium hidden lg:table-cell">Website</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead: Lead) => (
                      <tr key={lead.id} className="border-b">
                        <td className="p-4 text-base">{lead.businessName}</td>
                        <td className="p-4 text-base hidden md:table-cell">{lead.address}</td>
                        <td className="p-4 text-base">{lead.phone}</td>
                        <td className="p-4 text-base hidden md:table-cell">{lead.email}</td>
                        <td className="p-4 text-base hidden lg:table-cell">{lead.website}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}