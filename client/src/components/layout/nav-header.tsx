import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function NavHeader() {
  const { user } = useAuth();

  // Calculate the percentage of used credits
  // Assuming a user starts with 100 credits
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
                <div className="relative w-12 h-12">
                  <Progress 
                    value={creditsPercentage} 
                    className="absolute inset-0 h-full w-full rounded-full [&>div]:bg-primary/20"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {user.credits}
                    </span>
                  </div>
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