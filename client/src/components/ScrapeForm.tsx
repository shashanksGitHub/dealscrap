import React, { useState } from 'react';
import { useScrape } from '../mutations/useScrape';
import { toast } from 'react-hot-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';

export function ScrapeForm() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [maxResults, setMaxResults] = useState(100);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  const { mutate: scrape, isPending } = useScrape();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Log the form data being sent
    console.log('Submitting form with data:', {
      searchTerm,
      location,
      maxResults
    });

    // Reset progress
    setProgress(null);

    // Start scraping
    scrape(
      {
        searchTerm: searchTerm.trim(),
        location: location.trim(),
        maxResults: Number(maxResults)
      },
      {
        onSuccess: (response: any) => {
          if (response.type === 'progress') {
            setProgress({
              current: response.current,
              total: response.total
            });
          }
        },
        onError: (error: Error) => {
          console.error('Scrape error:', error);
          toast.error(error.message);
          setProgress(null);
        }
      }
    );
  };

  const progressPercentage = progress 
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="searchTerm" className="block text-sm font-medium">
          Suchbegriff
        </label>
        <Input
          id="searchTerm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="z.B. Restaurant"
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="location" className="block text-sm font-medium">
          Standort
        </label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="z.B. Berlin"
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="maxResults" className="block text-sm font-medium">
          Anzahl der Leads (1-100)
        </label>
        <Input
          id="maxResults"
          type="number"
          min={1}
          max={100}
          value={maxResults}
          onChange={(e) => setMaxResults(parseInt(e.target.value, 10))}
          required
          disabled={isPending}
        />
      </div>

      {progress && (
        <div className="space-y-2">
          <Progress value={progressPercentage} />
          <p className="text-sm text-gray-500">
            {progress.current} von {progress.total} Leads gefunden
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending || !searchTerm || !location}
        className="w-full"
      >
        {isPending ? 'Leads werden generiert...' : 'Leads generieren'}
      </Button>
    </form>
  );
} 