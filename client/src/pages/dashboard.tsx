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
import { SearchIcon, LogOutIcon, DownloadIcon, PlayCircleIcon } from "lucide-react";
import type { Lead } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation(); // Added setLocation from wouter

  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const scrapeMutation = useMutation({
    mutationFn: async (data: { query: string; location: string }) => {
      const res = await apiRequest("POST", "/api/scrape", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Success",
        description: "Lead scraped successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleScrape = () => {
    if (!query || !location) {
      toast({
        title: "Error",
        description: "Please enter both query and location",
        variant: "destructive",
      });
      return;
    }

    scrapeMutation.mutate({ query, location });
  };

  const handleExport = () => {
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

  const purchaseMutation = useMutation({
    mutationFn: async (packageId: string) => {
      const packageMap = {
        "100": 100,
        "250": 200,
        "500": 350,
        "1000": 600,
      };
      setLocation(`/checkout/${packageMap[packageId as keyof typeof packageMap]}`);
      return { success: true };
    },
  });

  const creditPackages = [
    { id: "100", credits: 100, price: 100 },
    { id: "250", credits: 250, price: 200 },
    { id: "500", credits: 500, price: 350, recommended: true },
    { id: "1000", credits: 1000, price: 600 },
  ];

  return (
    <div className="min-h-screen">
      <nav className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2 md:gap-4">
            <span className="text-sm md:text-base">Credits: {user?.credits}</span>
            <Button variant="outline" size="sm" onClick={() => logoutMutation.mutate()}>
              <LogOutIcon className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Product Demo Video */}
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
          {/* Scrape Form */}
          <Card>
            <CardHeader>
              <CardTitle>Scrape New Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="query">Business Type</Label>
                  <Input
                    id="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. Restaurant"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Berlin"
                  />
                </div>
                <Button
                  onClick={handleScrape}
                  disabled={scrapeMutation.isPending || user?.credits === 0}
                  className="w-full"
                >
                  <SearchIcon className="w-4 h-4 mr-2" />
                  {scrapeMutation.isPending ? "Scraping..." : "Start Scraping"}
                </Button>
                {user?.credits === 0 && (
                  <p className="text-sm text-destructive text-center">
                    You need credits to scrape leads
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Credit Packages */}
          <Card>
            <CardHeader>
              <CardTitle>Buy Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {creditPackages.map((pkg) => (
                    <Button
                      key={pkg.id}
                      onClick={() => purchaseMutation.mutate(pkg.id as "100" | "250" | "500" | "1000")}
                      variant={pkg.recommended ? "default" : "outline"}
                      className={cn(
                        "relative flex flex-col items-center justify-center gap-2 p-4 md:p-6 h-auto min-h-[120px]",
                        pkg.recommended && "border-2 border-primary shadow-lg scale-105"
                      )}
                      disabled={purchaseMutation.isPending}
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

        {/* Leads Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Leads</CardTitle>
            <Button variant="outline" onClick={handleExport}>
              <DownloadIcon className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Export CSV</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left text-sm font-medium">Business Name</th>
                    <th className="p-2 text-left text-sm font-medium hidden md:table-cell">Address</th>
                    <th className="p-2 text-left text-sm font-medium">Phone</th>
                    <th className="p-2 text-left text-sm font-medium hidden md:table-cell">Email</th>
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
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}