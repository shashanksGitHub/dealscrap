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
            <div className="flex flex-col items-center gap-2 px-4 py-2">
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center">
                  <img 
                    src="/images/dsgvo-grey-523x480.png" 
                    alt="DSGVO konform" 
                    className="h-12" 
                  />
                  <span className="text-lg font-semibold">DSGVO-konform</span>
                  <span className="text-sm text-gray-600">Höchste Sicherheitsstandards</span>
                </div>
                <div className="flex flex-col items-center">
                  <img 
                    src="/images/DEU_Hamburg_COA.svg.png" 
                    alt="Hamburg" 
                    className="h-12" 
                  />
                  <span className="text-lg font-semibold">Hamburg</span>
                  <span className="text-sm text-gray-600">Entwickelt für den DACH-Raum</span>
                </div>
              </div>
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