import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessInfoSchema, type BusinessInfo } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {Label} from "@/components/ui/label"; // Added missing import

const COUNTRIES = [
  { value: 'DE', label: 'Deutschland' },
  { value: 'AT', label: 'Österreich' },
  { value: 'CH', label: 'Schweiz' }
];

interface BusinessInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BusinessInfo) => Promise<void>;
  isProcessing: boolean;
}

export function BusinessInfoModal({ isOpen, onClose, onSubmit, isProcessing }: BusinessInfoModalProps) {
  // Lade gespeicherte Business-Informationen
  const { data: savedBusinessInfo, isLoading } = useQuery({ //Renamed isLoading for clarity
    queryKey: ['/api/user/business-info'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/user/business-info');
      return response.json();
    },
    enabled: isOpen // Nur laden, wenn Modal geöffnet ist
  });

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

  // Automatisch Formular mit gespeicherten Daten füllen
  useEffect(() => {
    if (savedBusinessInfo) {
      Object.entries(savedBusinessInfo).forEach(([key, value]) => {
        form.setValue(key as keyof BusinessInfo, value);
      });
    }
  }, [savedBusinessInfo, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {savedBusinessInfo ? "Gespeicherte Unternehmensdaten" : "Unternehmensdaten für die Rechnung"}
          </DialogTitle>
        </DialogHeader>

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

            <Button type="submit" className="w-full" disabled={isProcessing || isLoading}> {/* Added isLoading to disable button during loading */}
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verarbeitung...
                </>
              ) : savedBusinessInfo ? (
                "Mit gespeicherten Daten fortfahren"
              ) : (
                "Weiter zur Zahlung"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}