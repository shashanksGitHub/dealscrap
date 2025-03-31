import React, { useState } from 'react';
import { useScrape } from '../mutations/useScrape';
import { toast } from 'react-hot-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';

export function ScrapeForm() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [count, setCount] = useState(100);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  const { mutate: scrape, isPending } = useScrape();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Log the form data being sent
    console.log('Submitting form with data:', {
      query,
      location,
      count
    });

    // Reset progress
    setProgress(null);

    // Start scraping
    scrape(
      {
        query: query.trim(),
        location: location.trim(),
        count: Number(count)
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
        <label htmlFor="query">Suchbegriff</label>
        <Input
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="z.B. Restaurant"
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="location">Standort</label>
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
        <label htmlFor="count">Anzahl der Leads (1-100)</label>
        <Input
          id="count"
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value, 10))}
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
        disabled={isPending || !query || !location}
        className="w-full"
      >
        {isPending ? 'Leads werden generiert...' : 'Leads generieren'}
      </Button>
    </form>
  );
} 