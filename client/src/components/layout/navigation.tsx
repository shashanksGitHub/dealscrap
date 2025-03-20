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
              <img 
                src="/images/dsgvo-grey-523x480.png" 
                alt="DSGVO konform" 
                className="h-8" 
              />
              <img 
                src="/images/DEU_Hamburg_COA.svg.png" 
                alt="Hamburg" 
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