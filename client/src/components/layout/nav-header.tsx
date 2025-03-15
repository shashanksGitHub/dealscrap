import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function NavHeader() {
  const { user, logout } = useAuth();

  // Berechne den Prozentsatz der verbrauchten Credits
  // Annahme: Ein Nutzer startet mit 100 Credits
  const maxCredits = 100;
  const creditsPercentage = ((maxCredits - (user?.credits || 0)) / maxCredits) * 100;

  return (
    <header className="bg-background border-b">
      <div className="max-w-[1200px] mx-auto py-4 px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl lg:text-3xl font-bold text-primary hover:opacity-90 transition-opacity">
            LeadScraper
          </Link>
          <nav>
            <div className="flex items-center gap-4">
              {!user && (
                <>
                  <Link href="/leads-kaufen" className="text-muted-foreground hover:text-primary">
                    Leads kaufen
                  </Link>
                  <Link href="/blog" className="text-muted-foreground hover:text-primary">
                    Ratgeber
                  </Link>
                </>
              )}
              {user ? (
                <>
                  <Link href="/dashboard" className="text-muted-foreground hover:text-primary">
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8">
                      <Progress 
                        value={creditsPercentage} 
                        className="absolute inset-0 h-full w-full rounded-full [&>div]:bg-primary"
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                        {user.credits}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <span 
                        onClick={logout}
                        className="text-muted-foreground hover:text-primary"
                      >
                        Logout
                      </span>
                    </Button>
                  </div>
                </>
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