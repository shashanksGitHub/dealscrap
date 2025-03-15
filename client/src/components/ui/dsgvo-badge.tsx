import { cn } from "@/lib/utils";

interface DSGVOBadgeProps {
  className?: string;
  size?: "sm" | "default";
}

export function DSGVOBadge({ className, size = "default" }: DSGVOBadgeProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-3 text-center bg-white/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm",
      size === "sm" && "max-w-[280px]",
      size === "default" && "max-w-[400px]",
      className
    )}>
      <img
        src="/assets/dsgvo-grey-523x480.png"
        alt="DSGVO-konform"
        className={cn(
          "object-contain",
          size === "sm" && "w-16 h-16",
          size === "default" && "w-24 h-24 sm:w-32 sm:h-32"
        )}
      />
      <p className={cn(
        "font-medium",
        size === "sm" && "text-sm",
        size === "default" && "text-sm sm:text-base",
        "text-muted-foreground mt-2"
      )}>
        DSGVO-konform & sicher
      </p>
      <p className={cn(
        size === "sm" && "text-xs",
        size === "default" && "text-xs",
        "text-muted-foreground mt-1"
      )}>
        Ihre Daten werden nach höchsten Sicherheitsstandards verarbeitet
      </p>
    </div>
  );
}