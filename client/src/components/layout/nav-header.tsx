import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CircleProgress } from "@/components/ui/circle-progress";

export function NavHeader() {
  const { user, logout } = useAuth();

  // Fetch fresh user data every 5 seconds
  const { data: freshUserData } = useQuery({
    queryKey: ['/api/user'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/user');
      const data = await response.json();
      return data;
    },
    enabled: !!user, // Only run query if user is logged in
    refetchInterval: 5000, // Refetch every 5 seconds while component is mounted
    staleTime: 0 // Consider data immediately stale
  });

  // Use the latest user data from the query
  const currentUser = freshUserData || user;

  // Log credit updates
  console.log('Current user credits:', currentUser?.credits);

  return (
    <header className="bg-background border-b">
      <div className="max-w-[1200px] mx-auto py-4 px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href={currentUser ? "/dashboard" : "/"} className="text-2xl lg:text-3xl font-bold text-primary hover:opacity-90 transition-opacity">
            LeadScraper
          </Link>
          <nav>
            <div className="flex items-center gap-4">
              {!currentUser && (
                <>
                  <Link href="/leads-kaufen" className="text-muted-foreground hover:text-primary">
                    Leads kaufen
                  </Link>
                  <Link href="/blog" className="text-muted-foreground hover:text-primary">
                    Ratgeber
                  </Link>
                </>
              )}
              {currentUser ? (
                <div className="flex items-center gap-4">
                  <CircleProgress 
                    value={currentUser.credits}
                    max={1000}
                    size="md"
                    showLabel
                    showMax={false}
                    className={currentUser.credits === 0 ? 'text-destructive' : 'text-primary'}
                  />
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOutIcon className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/auth">
                  <Button variant="outline" size="sm" className="ml-4">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default NavHeader;