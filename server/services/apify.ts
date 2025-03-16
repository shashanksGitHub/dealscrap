import { ApifyClient } from 'apify-client';

if (!process.env.APIFY_API_KEY) {
  throw new Error('Missing required Apify secret: APIFY_API_KEY');
}

export const apifyClient = new ApifyClient({
  token: process.env.APIFY_API_KEY,
});
