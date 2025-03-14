import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function NavHeader() {
  const { user, logout } = useAuth();

  const PublicNavLinks = () => (
    <>
      <Link href="#features">
        <a className="text-muted-foreground hover:text-foreground transition-colors">Funktionen</a>
      </Link>
      <Link href="#benefits">
        <a className="text-muted-foreground hover:text-foreground transition-colors">Vorteile</a>
      </Link>
      <Link href="/blog">
        <a className="text-muted-foreground hover:text-foreground transition-colors">Blog</a>
      </Link>
      <Link href="#faq">
        <a className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
      </Link>
      <Link href="/kontakt">
        <a className="text-muted-foreground hover:text-foreground transition-colors">Kontakt</a>
      </Link>
    </>
  );

  const AuthenticatedNavLinks = () => (
    <>
      <Link href="/dashboard">
        <a className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</a>
      </Link>
      <Link href="/blog">
        <a className="text-muted-foreground hover:text-foreground transition-colors">Blog</a>
      </Link>
      <Link href="/kontakt">
        <a className="text-muted-foreground hover:text-foreground transition-colors">Kontakt</a>
      </Link>
      <button
        onClick={() => logout()}
        className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Abmelden
      </button>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center py-4">
        <Link href="/">
          <a className="text-2xl font-bold text-primary">LeadScraper</a>
        </Link>
        <div className="flex items-center gap-6">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {user ? <AuthenticatedNavLinks /> : <PublicNavLinks />}
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {user ? <AuthenticatedNavLinks /> : <PublicNavLinks />}
              </nav>
            </SheetContent>
          </Sheet>

          {!user && (
            <Link href="/auth">
              <a>
                <Button size="sm">Kostenloses Konto</Button>
              </a>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}