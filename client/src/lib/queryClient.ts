import { QueryClient } from "@tanstack/react-query";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Helper function for API requests
export async function apiRequest<T>(
  method: string,
  path: string,
  data?: unknown
): Promise<T> {
  const response = await fetch(path, {
    method,
    headers: {
      ...data ? { 'Content-Type': 'application/json' } : {},
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(await response.text() || response.statusText);
  }

  return response.json();
}