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
      <div className={cn(
        "flex items-center justify-center mb-3",
        size === "sm" && "h-8",
        size === "default" && "h-12"
      )}>
        <img
          src="/images/dsgvo-logo.png"
          alt="DSGVO-konform"
          className="object-contain h-full"
        />
      </div>
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