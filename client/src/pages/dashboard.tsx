import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { SearchIcon, LogOutIcon, DownloadIcon } from "lucide-react";
import type { Lead } from "@shared/schema";

export default function Dashboard() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

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
    mutationFn: async (packageId: "100" | "250") => {
      const res = await apiRequest("POST", "/api/credits/purchase", { packageId });
      return res.json();
    },
    onSuccess: (data) => {
      // Redirect to Mollie checkout
      window.location.href = data.checkoutUrl;
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen">
      <nav className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span>Credits: {user?.credits}</span>
            <Button variant="outline" onClick={() => logoutMutation.mutate()}>
              <LogOutIcon className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
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

          <Card>
            <CardHeader>
              <CardTitle>Buy Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => purchaseMutation.mutate("100")}
                    className="h-24"
                    disabled={purchaseMutation.isPending}
                  >
                    100 Credits
                    <br />
                    €100
                  </Button>
                  <Button
                    onClick={() => purchaseMutation.mutate("250")}
                    className="h-24"
                    disabled={purchaseMutation.isPending}
                  >
                    250 Credits
                    <br />
                    €200
                  </Button>
                </div>
                {purchaseMutation.isPending && (
                  <p className="text-sm text-muted-foreground text-center">
                    Redirecting to payment...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Leads</CardTitle>
            <Button variant="outline" onClick={handleExport}>
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left">Business Name</th>
                    <th className="p-2 text-left">Address</th>
                    <th className="p-2 text-left">Phone</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Website</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead: Lead) => (
                    <tr key={lead.id} className="border-b">
                      <td className="p-2">{lead.businessName}</td>
                      <td className="p-2">{lead.address}</td>
                      <td className="p-2">{lead.phone}</td>
                      <td className="p-2">{lead.email}</td>
                      <td className="p-2">{lead.website}</td>
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