import { useEffect, useState } from 'react';
import { useRoute, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessInfoSchema, type BusinessInfo } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftIcon } from "lucide-react";
import { DSGVOBadge } from "@/components/ui/dsgvo-badge";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";

const CREDIT_PACKAGES: Record<string, { credits: number; price: number }> = {
  '100': { credits: 100, price: 100 },
  '200': { credits: 250, price: 200 },
  '350': { credits: 500, price: 350 },
  '600': { credits: 1000, price: 600 }
};

const COUNTRIES = [
  { value: 'DE', label: 'Deutschland' },
  { value: 'AT', label: 'Österreich' },
  { value: 'CH', label: 'Schweiz' }
];

export default function Checkout() {
  const [match, params] = useRoute("/checkout/:amount");
  const { user } = useAuth();
  const [showBusinessForm, setShowBusinessForm] = useState(true); 

  const form = useForm<BusinessInfo>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      companyName: "",
      vatId: "",
      street: "",
      city: "",
      postalCode: "",
      country: "DE"
    }
  });

  useEffect(() => {
    if (!match || !params?.amount || !CREDIT_PACKAGES[params.amount]) {
      window.location.href = "/dashboard";
    }
  }, [match, params?.amount]);

  const amount = params?.amount ? parseInt(params.amount) : 0;
  const creditPackage = CREDIT_PACKAGES[amount];

  if (!creditPackage) {
    return null;
  }

  const onSubmit = async (data: BusinessInfo) => {
    console.log("Business data:", data);
  };

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
                Bitte geben Sie Ihre Unternehmensdaten für die Rechnung ein
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border p-4 bg-muted/5 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Ausgewähltes Paket</h3>
                    <p className="text-sm text-muted-foreground">{creditPackage.credits} Credits</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{amount}€</p>
                    <p className="text-sm text-muted-foreground">zzgl. MwSt.</p>
                  </div>
                </div>
              </div>

              {showBusinessForm && (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Firmenname</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vatId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>USt-IdNr. (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Straße und Hausnummer</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PLZ</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stadt</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Land</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Wählen Sie ein Land" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {COUNTRIES.map(country => (
                                <SelectItem key={country.value} value={country.value}>
                                  {country.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      Weiter zur Zahlung
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>

          <DSGVOBadge />
        </div>
      </div>
      <Footer />
    </div>
  );
}