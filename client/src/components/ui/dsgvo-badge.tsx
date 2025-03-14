import { cn } from "@/lib/utils";

interface DSGVOBadgeProps {
  className?: string;
}

export function DSGVOBadge({ className }: DSGVOBadgeProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-4 sm:p-6 text-center bg-white/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm",
      className
    )}>
      <img
        src="/assets/dsgvo-grey-523x480.png"
        alt="DSGVO-konform"
        className="w-24 h-24 sm:w-32 sm:h-32 mb-3 object-contain"
      />
      <p className="text-sm sm:text-base text-muted-foreground font-medium">
        DSGVO-konform & sicher
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        Ihre Daten werden nach höchsten Sicherheitsstandards verarbeitet
      </p>
    </div>
  );
}