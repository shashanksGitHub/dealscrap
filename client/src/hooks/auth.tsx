import { createContext, useContext, useState, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  name?: string;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: any;
  registerMutation: any;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [error, setError] = useState<Error | null>(null);

  // Optimize the initial auth check
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['/api/user'],
    queryFn: () => apiRequest<User | null>('/api/user', 'GET'),
    retry: 0,
    staleTime: 5000,
    cacheTime: 300000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    initialData: null,
    // Add a short timeout to prevent hanging
    networkMode: 'online',
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiRequest<User>('/api/login', 'POST', credentials);
      await refetch();
      return response;
    },
    onError: (error: Error) => {
      toast({
        title: "Login fehlgeschlagen",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiRequest<User>('/api/register', 'POST', data);
      await refetch();
      return response;
    },
    onError: (error: Error) => {
      toast({
        title: "Registrierung fehlgeschlagen",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const logout = async () => {
    try {
      await apiRequest('/api/logout', 'POST');
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Logout failed'));
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    loginMutation,
    registerMutation,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}