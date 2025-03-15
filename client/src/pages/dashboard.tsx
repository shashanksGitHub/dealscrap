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
import { SearchIcon, LogOutIcon, DownloadIcon, PlayCircleIcon, Loader2 } from "lucide-react";
import type { Lead } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [, setLocation] = useLocation();

  const { data: leads = [], isLoading: isLeadsLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
    initialData: [],
    refetchOnWindowFocus: false
  });

  const scrapeMutation = useMutation({
    mutationFn: async (data: { query: string; location: string }) => {
      if (!data.query.trim() || !data.location.trim()) {
        throw new Error("Suchbegriff und Standort dürfen nicht leer sein");
      }

      const locationRegex = /^[a-zA-Z\s-]+$/;
      if (!locationRegex.test(data.location)) {
        throw new Error("Ungültiges Standortformat");
      }

      const res = await apiRequest("POST", "/api/scrape", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Erfolgreich",
        description: "Lead erfolgreich gefunden",
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

  const handlePurchase = (price: number) => {
    setLocation(`/checkout/${price}`);
  };

  return (
    <div className="min-h-screen">
      <nav className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2 md:gap-4">
            <span className="text-sm md:text-base">Credits: {user?.credits}</span>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              <LogOutIcon className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Abmelden</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
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
            <p className="mt-4 text-sm md:text-base text-muted-foreground text-center">
              In diesem kurzen Video zeige ich Ihnen persönlich, wie Sie mit unserem Tool effizient Business-Leads generieren können.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Neue Leads finden</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="query">Unternehmensart</Label>
                  <Input
                    id="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="z.B. Restaurant"
                    disabled={scrapeMutation.isPending}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Standort</Label>
                  <Input
                    id="location"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="z.B. Berlin"
                    disabled={scrapeMutation.isPending}
                  />
                </div>
                <Button
                  onClick={() => scrapeMutation.mutate({ query, location: searchLocation })}
                  disabled={scrapeMutation.isPending || user?.credits === 0}
                  className="w-full"
                >
                  <SearchIcon className="w-4 h-4 mr-2" />
                  {scrapeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Suche läuft...
                    </>
                  ) : (
                    "Suche starten"
                  )}
                </Button>
                {user?.credits === 0 && (
                  <p className="text-sm text-destructive text-center">
                    Sie benötigen Credits für die Lead-Suche
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Credits kaufen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {creditPackages.map((pkg) => (
                    <Button
                      key={pkg.id}
                      onClick={() => handlePurchase(pkg.price)}
                      variant={pkg.recommended ? "default" : "outline"}
                      className={cn(
                        "relative flex flex-col items-center justify-center gap-2 p-4 md:p-6 h-auto min-h-[120px]",
                        pkg.recommended && "border-2 border-primary shadow-lg scale-105"
                      )}
                    >
                      {pkg.recommended && (
                        <Badge
                          variant="secondary"
                          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs"
                        >
                          Empfohlen
                        </Badge>
                      )}
                      <span className="text-lg md:text-2xl font-bold">{pkg.credits} Credits</span>
                      <span className="text-xl md:text-3xl font-bold text-primary">€{pkg.price}</span>
                      {pkg.recommended && (
                        <span className="text-xs md:text-sm text-muted-foreground mt-1">Bester Preis pro Credit</span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ihre Leads</CardTitle>
            <Button 
              variant="outline" 
              onClick={handleExport}
              disabled={isLeadsLoading || leads.length === 0}
            >
              <DownloadIcon className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Als CSV exportieren</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border">
              {isLeadsLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Leads werden geladen...</p>
                </div>
              ) : leads.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">Keine Leads gefunden</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left text-sm font-medium">Firmenname</th>
                      <th className="p-2 text-left text-sm font-medium hidden md:table-cell">Adresse</th>
                      <th className="p-2 text-left text-sm font-medium">Telefon</th>
                      <th className="p-2 text-left text-sm font-medium hidden md:table-cell">E-Mail</th>
                      <th className="p-2 text-left text-sm font-medium hidden lg:table-cell">Website</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead: Lead) => (
                      <tr key={lead.id} className="border-b">
                        <td className="p-2 text-sm">{lead.businessName}</td>
                        <td className="p-2 text-sm hidden md:table-cell">{lead.address}</td>
                        <td className="p-2 text-sm">{lead.phone}</td>
                        <td className="p-2 text-sm hidden md:table-cell">{lead.email}</td>
                        <td className="p-2 text-sm hidden lg:table-cell">{lead.website}</td>
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