import Link from "next/link";
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
  return (
    <NavigationMenu className="mx-auto max-w-screen-xl px-4">
      <NavigationMenuList className="gap-2">
        <NavigationMenuItem>
          <Link href="/">
            <div className="flex items-center gap-4 px-4 py-2">
              <h1 className="text-2xl font-bold text-black tracking-tighter">LeadScraper</h1>
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

        <NavigationMenuItem>
          <Link href="/auth">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Anmelden
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}