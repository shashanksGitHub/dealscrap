import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-hot-toast';
import { apiRequest } from "@/lib/queryClient";

interface ScrapeParams {
  query: string;
  location: string;
  count: number;
}

export function useScrape() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ScrapeParams) => {
      // Step 1: Input validation
      console.log('🔍 Step 1: Validating inputs', {
        query: data.query,
        location: data.location,
        count: data.count
      });

      if (!data.query.trim() || !data.location.trim()) {
        console.error('❌ Input validation failed: Empty query or location');
        throw new Error("Suchbegriff und Standort dürfen nicht leer sein");
      }

      if (data.count < 1 || data.count > 100) {
        console.error('❌ Input validation failed: Invalid count', data.count);
        throw new Error("Bitte wählen Sie zwischen 1 und 100 Leads");
      }

      console.log('✅ Input validation passed');

      // Step 2: Making API request
      console.log('🚀 Step 2: Initiating API request to /api/scrape');
      
      try {
        const response = await apiRequest('/api/scrape', 'POST', {
          query: data.query,
          location: data.location,
          count: data.count
        }, {
          stream: true,
          onProgress: (progressData) => {
            // Step 3: Processing stream data
            console.log('📊 Step 3: Received stream data', progressData);
            
            if (progressData.type === 'progress') {
              console.log('Progress update:', {
                current: progressData.current,
                total: progressData.total,
                newLeadsCount: progressData.leads?.length
              });
              return progressData;
            }
          }
        }) as Response;

        // Check if response is HTML (error case)
        const contentType = response.headers?.get('content-type');
        if (contentType?.includes('text/html')) {
          console.error('❌ Received HTML response instead of JSON', {
            status: response.status,
            contentType
          });
          throw new Error('Der Server ist nicht erreichbar. Bitte versuchen Sie es später erneut.');
        }

        // Step 4: Request completed
        console.log('✅ Step 4: Scraping completed successfully', response);
        return response;

      } catch (error: unknown) {
        // Step 5: Error handling
        const err = error as Error;
        console.error('❌ Step 5: Error occurred during scraping', {
          name: err.name,
          message: err.message,
          stack: err.stack
        });

        if (err.name === 'AbortError') {
          throw new Error("Die Anfrage hat zu lange gedauert. Bitte versuchen Sie es mit einer kleineren Anzahl an Leads.");
        }

        // If we got an HTML response, it means the server is not responding correctly
        if (err.message.includes('text/html')) {
          throw new Error('Der Server ist nicht erreichbar. Bitte versuchen Sie es später erneut.');
        }

        throw err;
      }
    },
    onSuccess: (data) => {
      // Step 6: Post-success operations
      console.log('🎉 Step 6: Running post-success operations');
      
      console.log('Invalidating queries...');
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/searches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });

      console.log('✅ All queries invalidated');
      toast.success('Leads erfolgreich gefunden!');
    },
    onError: (error: Error) => {
      // Step 7: Error notification
      console.error('❌ Step 7: Handling error notification', error);
      toast.error(error.message || 'Es ist ein Fehler aufgetreten');
    }
  });
} 