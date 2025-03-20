
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function Navigation() {
  const { user } = useAuth();

  return (
    <NavigationMenu className="mx-auto max-w-screen-xl px-4">
      <NavigationMenuList className="gap-2">
        <NavigationMenuItem>
          <Link href="/">
            <div className="flex items-center px-4 py-2">
              <img 
                src="/images/leadscraper-black.png" 
                alt="LeadScraper" 
                className="h-8" 
              />
            </div>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/leads-kaufen">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Leads kaufen
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/blog">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Blog
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {user ? (
          <>
            <NavigationMenuItem>
              <Link href="/dashboard">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/account">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Konto
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </>
        ) : (
          <NavigationMenuItem>
            <Link href="/auth">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Anmelden
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
