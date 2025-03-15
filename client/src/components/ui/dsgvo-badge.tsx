import { cn } from "@/lib/utils";

interface DSGVOBadgeProps {
  className?: string;
  size?: "sm" | "default";
}

export function DSGVOBadge({ className, size = "default" }: DSGVOBadgeProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-4 text-center bg-white rounded-xl border border-border/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
      size === "sm" && "w-[160px]",
      size === "default" && "w-[200px]",
      className
    )}>
      <img
        src="/images/dsgvo-logo.png"
        alt="DSGVO-konform"
        className={cn(
          "object-contain mb-3",
          size === "sm" && "h-12",
          size === "default" && "h-16"
        )}
      />
      <p className={cn(
        "font-medium mb-1",
        size === "sm" && "text-sm",
        size === "default" && "text-base"
      )}>
        DSGVO-konform & sicher
      </p>
      <p className={cn(
        size === "sm" && "text-xs",
        size === "default" && "text-sm",
        "text-muted-foreground"
      )}>
        Höchste Sicherheitsstandards
      </p>
    </div>
  );
}