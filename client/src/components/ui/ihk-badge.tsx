import { cn } from "@/lib/utils";

type BadgeProps = {
  size?: "sm" | "default";
  className?: string;
};

export function IHKBadge({ size = "default", className }: BadgeProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-4 text-center bg-white rounded-xl border border-border/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
      size === "sm" && "w-[160px]",
      size === "default" && "w-[200px]",
      className
    )}>
      <img
        src="/Logo_570px_ihk.png"
        alt="IHK Logo"
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
        IHK-zertifiziertes Unternehmen
      </p>
      <p className={cn(
        size === "sm" && "text-xs",
        size === "default" && "text-sm",
        "text-muted-foreground"
      )}>
        Geprüfte Qualität
      </p>
    </div>
  );
}