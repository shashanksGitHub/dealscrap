import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <img 
            src="/leadscraper-logo.png" 
            alt="LeadScraper Logo" 
            className="h-8"
            width={160}
            height={32}
          />
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/ratgeber">
            <Button variant="ghost">Ratgeber</Button>
          </Link>
          <Link href="/auth">
            <Button>Login</Button>
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}