import { cn } from "@/lib/utils";

type BadgeProps = {
  size?: "sm" | "default";
  className?: string;
};

export function HamburgBadge({ size = "default", className }: BadgeProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-4 text-center bg-white rounded-xl border border-border/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
      size === "sm" && "w-[160px]",
      size === "default" && "w-[200px]",
      className
    )}>
      <div className={cn(
        "flex items-center justify-center mb-3",
        size === "sm" && "h-8",
        size === "default" && "h-12"
      )}>
        <img
          src="/DEU_Hamburg_COA.png"
          alt="Hamburg Wappen"
          className="object-contain h-full"
        />
      </div>
      <p className={cn(
        "font-medium mb-1",
        size === "sm" && "text-sm",
        size === "default" && "text-base"
      )}>
        Aus Hamburg
      </p>
      <p className={cn(
        size === "sm" && "text-xs",
        size === "default" && "text-sm",
        "text-muted-foreground"
      )}>
        Entwickelt für den DACH-Raum
      </p>
    </div>
  );
}