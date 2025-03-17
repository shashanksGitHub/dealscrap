import { ApifyClient } from 'apify-client';

if (!process.env.APIFY_TOKEN) {
  throw new Error('Missing required Apify secret: APIFY_TOKEN');
}

export const apifyClient = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});