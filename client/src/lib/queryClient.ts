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
  path: string,
  method: string = 'GET',
  data?: unknown,
  options: RequestInit = {}
): Promise<T> {
  // Stellen Sie sicher, dass der Pfad mit einem Slash beginnt
  const normalizedPath = path.startsWith('/') || path.startsWith('http') 
    ? path 
    : `/${path}`;
  
  // Verwenden Sie die aktuelle Origin-URL für relative Pfade
  const url = normalizedPath.startsWith('http') 
    ? normalizedPath 
    : `${window.location.origin}${normalizedPath}`;
  
  console.debug(`API Request: ${method} ${url}`);
  
  const response = await fetch(url, {
    method,
    headers: {
      ...data ? { 'Content-Type': 'application/json' } : {},
      ...options.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include',
    ...options,
  });

  if (!response.ok) {
    console.error(`API Error: ${response.status} ${response.statusText}`);
    throw new Error(await response.text() || response.statusText);
  }

  return response.json();
}