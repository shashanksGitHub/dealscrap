import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOutIcon, PlayCircleIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { VideoTutorialDialog } from "@/components/ui/video-tutorial-dialog";

export function NavHeader() {
  const { user, logout } = useAuth();
  const [showTutorial, setShowTutorial] = useState(() => {
    return localStorage.getItem("tutorialWatched") !== "true";
  });

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
                  <Link href="/blog" className="text-muted-foreground hover:text-primary">
                    Ratgeber
                  </Link>
                </>
              )}
              {currentUser ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center px-3 py-1.5 bg-muted rounded-full">
                    <span className="text-sm font-medium mr-2">Credits:</span>
                    <span className={`text-lg font-bold ${currentUser.credits === 0 ? 'text-destructive' : 'text-primary'}`}>
                      {currentUser.credits}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTutorial(true)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <PlayCircleIcon className="w-4 h-4 mr-2" />
                    Anleitung
                  </Button>
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
      <VideoTutorialDialog open={showTutorial} onOpenChange={setShowTutorial} />
    </header>
  );
}

export default NavHeader;