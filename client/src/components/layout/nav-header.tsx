import { Link } from "wouter";
import { useAuth } from "@/hooks/auth";
import { Button } from "@/components/ui/button";
import { LogOutIcon, PlayCircleIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { VideoTutorialDialog } from "@/components/ui/video-tutorial-dialog";
import { useLocation } from "wouter";

interface User {
  id: string;
  email: string;
  credits: number;
}

export function NavHeader() {
  const { user, logout } = useAuth();
  const [showTutorial, setShowTutorial] = useState(() => {
    return localStorage.getItem("tutorialWatched") !== "true";
  });
  const [, navigate] = useLocation();

  // Fetch fresh user data every 5 seconds
  const { data: freshUserData } = useQuery<User>({
    queryKey: ['/api/user'],
    queryFn: () => apiRequest('/api/user', 'GET'),
    enabled: !!user,
    refetchInterval: 5000,
    staleTime: 0
  });

  // Use the latest user data from the query
  const currentUser = freshUserData || user;

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Set localStorage flag to indicate logo click
    localStorage.setItem('isLogoClick', 'true');
    
    // Redirect to dashboard if user is logged in, otherwise to landing page
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <header className="bg-background border-b">
      <div className="max-w-[1200px] mx-auto py-4 px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/?fromLogo=true" className="flex items-center">
            <a href="/" onClick={handleLogoClick} className="flex items-center">
              <img 
                src="/images/logo-blue.png" 
                alt="LeadScraper Logo" 
                className="h-8 w-auto object-contain"
                width={160}
                height={32}
                loading="eager"
              />
            </a>
          </Link>
          <nav>
            <div className="flex items-center gap-4">
              {!currentUser && <Link href="/blog" className="text-muted-foreground hover:text-primary">
                Ratgeber
              </Link>}
              {currentUser ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center px-3 py-1.5 bg-muted rounded-full">
                    <span className="text-sm font-medium mr-2">Credits:</span>
                    <span className={`text-lg font-bold ${currentUser.credits === 0 ? 'text-destructive' : 'text-primary'}`}>
                      {currentUser.credits}
                    </span>
                  </div>
                  {/* <Link href="/impressum" className="text-muted-foreground hover:text-primary">
                    Impressum
                  </Link> */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTutorial(true)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <PlayCircleIcon className="w-4 h-4 mr-2" />
                    Anleitung
                  </Button>
                  <Button variant="outline" size="sm" onClick={async () => {
                    await logout();
                    navigate('/auth');
                  }}>
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