import { useAuth } from "@/hooks/auth"; // Fixed import path
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { SearchIcon, DownloadIcon, Loader2, CheckCircle2Icon, Sparkles } from "lucide-react";
import type { Lead } from "@shared/schema";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SEO } from "@/components/layout/seo";
import { Footer } from "@/components/layout/footer";
import { VideoTutorialDialog } from "@/components/ui/video-tutorial-dialog";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [leadCount, setLeadCount] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [searchStatus, setSearchStatus] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Show tutorial only on first login
    const tutorialWatched = localStorage.getItem("tutorialWatched");
    if (!tutorialWatched && user) { // Only show tutorial if user is logged in
      setShowTutorial(true);
      localStorage.setItem("tutorialWatched", "true");
    }
  }, [user]); // Add user as dependency

  const searchStatuses = [
    "Neue Unternehmen werden gesucht...",
    "Spannendes Unternehmen gefunden! 🎯",
    "Daten werden angereichert...",
    "Leaddaten werden extrahiert...",
    "Tiefergehende Recherche läuft..."
  ];

  const { data: searches = [], isLoading: isSearchesLoading } = useQuery({
    queryKey: ['/api/searches'],
  });

  const { data: leads = [] } = useQuery({
    queryKey: ['/api/leads'],
    initialData: [],
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

      let currentStatus = 0;
      const statusInterval = setInterval(() => {
        setSearchStatus(searchStatuses[currentStatus]);
        currentStatus = (currentStatus + 1) % searchStatuses.length;
      }, 2000);

      try {
        const res = await apiRequest("POST", "/api/scrape", data);
        clearInterval(statusInterval);
        return res.json();
      } catch (error) {
        clearInterval(statusInterval);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/searches"] });

      toast({
        title: (
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
            >
              <CheckCircle2Icon className="w-5 h-5 text-green-500" />
            </motion.div>
            Leads erfolgreich gefunden! 🎉
          </div>
        ),
        description: (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            <p>
              Es wurden <span className="font-medium">{data.leads.length} neue Leads</span> für
              <span className="font-medium"> {data.search.query}</span> in
              <span className="font-medium"> {data.search.location}</span> gefunden.
            </p>
            <p className="text-sm text-muted-foreground">
              Sie können die Leads jetzt in der untenstehenden Liste einsehen oder als CSV-Datei exportieren.
            </p>
          </motion.div>
        ),
        duration: 6000,
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

  const handleExport = (searchId: number) => {
    const searchLeads = leads.filter((lead: Lead) => lead.searchId === searchId);
    if (!searchLeads.length) return;

    const csv = searchLeads.map((lead: Lead) =>
      Object.values(lead).join(",")
    ).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${searchId}.csv`;
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
      const response = await apiRequest("POST", "/api/payments/create", {
        amount: price
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
              >
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>
              Credits erfolgreich aufgeladen! ⭐
            </div>
          ),
          description: (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <p>
                <span className="font-medium">Vielen Dank für Ihren Einkauf!</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Sie werden jetzt zur sicheren Zahlungsabwicklung weitergeleitet.
              </p>
            </motion.div>
          ),
          duration: 4000,
        });

        setTimeout(() => {
          window.location.href = data.checkoutUrl;
        }, 1500);
      } else {
        throw new Error('Keine Checkout-URL erhalten');
      }
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message || "Bei der Zahlungsvorbereitung ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const markSearchAsRead = useMutation({
    mutationFn: async (searchId: number) => {
      const response = await apiRequest("PATCH", `/api/searches/${searchId}/mark-read`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/searches"] });
    }
  });

  return (
    <>
      <SEO 
        title="Dashboard - LeadScraper"
        noindex={true} 
      />
      <VideoTutorialDialog open={showTutorial} onOpenChange={setShowTutorial} />
      <div className="min-h-screen bg-background">
        <main className="container mx-auto max-w-[1200px] px-6 lg:px-8 py-12 space-y-12">
          {user?.credits === 0 && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold tracking-tight text-center">
                  Wählen Sie Ihr Credit-Paket
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {creditPackages.map((pkg) => (
                    <Button
                      key={pkg.id}
                      onClick={() => handlePurchase(pkg.price)}
                      variant="outline"
                      className={cn(
                        "relative flex flex-col items-center justify-center gap-2 p-6 h-auto min-h-[140px] bg-background",
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
          )}

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
                    placeholder="z.B. Restaurant, Rechtsanwalt, Steuerberater"
                    disabled={scrapeMutation.isPending}
                    className="text-base"
                    list="query-suggestions"
                  />
                  <datalist id="query-suggestions">
                    <option value="Restaurant">Restaurants & Gaststätten</option>
                    <option value="Rechtsanwalt">Rechtsanwaltskanzlei</option>
                    <option value="Steuerberater">Steuerberatung</option>
                    <option value="Zahnarzt">Zahnarztpraxis</option>
                    <option value="Architekt">Architekturbüro</option>
                    <option value="Versicherungsmakler">Versicherungsmakler</option>
                    <option value="Immobilienmakler">Immobilienmakler</option>
                    <option value="Fitnessstudio">Fitnessstudio</option>
                    <option value="Autowerkstatt">KFZ-Werkstatt</option>
                    <option value="Physiotherapie">Physiotherapiepraxis</option>
                  </datalist>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Standort</Label>
                  <Input
                    id="location"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="z.B. Berlin, Hamburg, München"
                    disabled={scrapeMutation.isPending}
                    className="text-base"
                    list="location-suggestions"
                  />
                  <datalist id="location-suggestions">
                    <option value="Berlin">Berlin</option>
                    <option value="Hamburg">Hamburg</option>
                    <option value="München">München</option>
                    <option value="Köln">Köln</option>
                    <option value="Frankfurt">Frankfurt am Main</option>
                    <option value="Stuttgart">Stuttgart</option>
                    <option value="Düsseldorf">Düsseldorf</option>
                    <option value="Leipzig">Leipzig</option>
                    <option value="Dortmund">Dortmund</option>
                    <option value="Essen">Essen</option>
                  </datalist>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leadCount">Anzahl der Leads (1 Lead = 1 Credit)</Label>
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
                </div>
                <Button
                  onClick={() => scrapeMutation.mutate({ query, location: searchLocation, count: leadCount })}
                  disabled={scrapeMutation.isPending || !user?.credits}
                  className="w-full text-base py-6"
                  size="lg"
                >
                  {scrapeMutation.isPending ? (
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{searchStatus}</span>
                    </div>
                  ) : (
                    <>
                      <SearchIcon className="mr-2 h-5 w-5" />
                      {leadCount} Lead{leadCount !== 1 ? 's' : ''} finden
                    </>
                  )}
                </Button>
                {user?.credits > 0 && (
                  <p className="text-base text-muted-foreground text-center">
                    Sie haben noch {user?.credits} Credits verfügbar
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold tracking-tight">Ihre Leads</CardTitle>
            </CardHeader>
            <CardContent>
              {isSearchesLoading ? (
                <div className="p-16 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">Suchen werden geladen...</p>
                </div>
              ) : searches.length === 0 ? (
                <div className="p-16 text-center">
                  <p className="text-lg text-muted-foreground">Keine Suchen gefunden</p>
                </div>
              ) : (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  onValueChange={(value) => {
                    if (value) {
                      markSearchAsRead.mutate(parseInt(value));
                    }
                  }}
                >
                  {searches.map((search: any) => (
                    <AccordionItem key={search.id} value={search.id.toString()}>
                      <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-4">
                            {!search.isRead && (
                              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                            )}
                            <div className="flex items-baseline gap-3">
                              <h3 className="font-semibold text-base">{search.query} in {search.location}</h3>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(search.createdAt), "dd. MMMM yyyy, HH:mm 'Uhr'", { locale: de })}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">{search.count} Leads</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 pb-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExport(search.id)}
                            className="mb-3"
                          >
                            <DownloadIcon className="w-3 h-3 mr-2" />
                            Als CSV exportieren
                          </Button>
                        </div>
                        <div className="overflow-x-auto rounded-md border">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b bg-muted/50">
                                <th className="p-2 text-left font-medium">Firmenname</th>
                                <th className="p-2 text-left font-medium hidden md:table-cell">Adresse</th>
                                <th className="p-2 text-left font-medium">Telefon</th>
                                <th className="p-2 text-left font-medium hidden md:table-cell">E-Mail</th>
                                <th className="p-2 text-left font-medium hidden lg:table-cell">Website</th>
                              </tr>
                            </thead>
                            <tbody className="text-sm">
                              {leads
                                .filter((lead: Lead) => lead.searchId === search.id)
                                .map((lead: Lead) => (
                                  <tr key={lead.id} className="border-b hover:bg-muted/50">
                                    <td className="p-2">{lead.businessName}</td>
                                    <td className="p-2 hidden md:table-cell text-muted-foreground">{lead.address}</td>
                                    <td className="p-2">{lead.phone}</td>
                                    <td className="p-2 hidden md:table-cell text-muted-foreground">{lead.email}</td>
                                    <td className="p-2 hidden lg:table-cell text-muted-foreground">
                                      {lead.website && (
                                        <a
                                          href={lead.website}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-primary hover:underline"
                                        >
                                          {lead.website}
                                        </a>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
}