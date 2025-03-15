import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export function NavHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-primary">
            LeadScraper
          </Link>
          <nav>
            <div className="flex items-center gap-4">
              {!user && (
                <Link href="/blog" className="text-muted-foreground hover:text-primary">
                  Ratgeber für Leadgenerierung
                </Link>
              )}
              {user ? (
                <>
                  <Link href="/dashboard" className="text-muted-foreground hover:text-primary">
                    Dashboard
                  </Link>
                  <button onClick={logout} className="text-muted-foreground hover:text-primary">
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/auth" className="text-muted-foreground hover:text-primary">
                  Login
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