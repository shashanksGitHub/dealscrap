import { QueryClient } from "@tanstack/react-query";

// Custom error class for API errors
export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// API request helper function with streaming support
export async function apiRequest<T>(
  path: string,
  method: string = "GET",
  body?: any,
  options: { stream?: boolean; onProgress?: (data: any) => void } = {}
): Promise<T> {
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Use current origin for relative paths
  const url = normalizedPath.startsWith('http') 
    ? normalizedPath 
    : `${window.location.origin}${normalizedPath}`;

  console.log('Making API request:', {
    url,
    method,
    body,
    options
  });

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept": options.stream ? "text/plain" : "application/json"
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Ein Fehler ist aufgetreten" }));
      throw new ApiError(errorData.message || "Ein Fehler ist aufgetreten");
    }

    // Handle streaming responses
    if (options.stream && response.body && options.onProgress) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      console.log('Starting to read stream...');

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            console.log('Stream complete');
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          console.log('Received chunk:', chunk);
          
          buffer += chunk;

          // Split on delimiter and process each complete message
          const parts = buffer.split('\n---MESSAGE---\n');
          
          // Process all complete messages
          while (parts.length > 1) {
            const message = parts.shift();
            if (message && message.trim()) {
              try {
                const data = JSON.parse(message);
                options.onProgress(data);
              } catch (e) {
                console.error('Error parsing message:', e);
              }
            }
          }
          
          // Keep the remaining partial message
          buffer = parts[0] || '';
        }

        // Process any remaining complete messages
        const parts = buffer.split('\n---MESSAGE---\n');
        for (const message of parts) {
          if (message && message.trim()) {
            try {
              const data = JSON.parse(message);
              options.onProgress(data);
            } catch (e) {
              console.error('Error parsing message:', e);
            }
          }
        }

        return {} as T;
      } catch (error) {
        console.error('Error reading stream:', error);
        throw error;
      }
    }

    // Handle regular JSON responses
    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error instanceof ApiError ? error : new ApiError(error instanceof Error ? error.message : String(error));
  }
}

// Configure the query client with optimized settings
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 60000, // 1 minute
      cacheTime: 300000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      suspense: false,
      refetchInterval: (query) => {
        // Only refetch leads and searches every 2 minutes
        if (query.queryKey[0] === '/api/leads' || query.queryKey[0] === '/api/searches') {
          return 120000;
        }
        return false;
      },
      networkMode: 'online',
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
      networkMode: 'online',
    },
  },
});