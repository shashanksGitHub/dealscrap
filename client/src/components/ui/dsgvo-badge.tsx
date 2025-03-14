import { cn } from "@/lib/utils";

interface DSGVOBadgeProps {
  className?: string;
}

export function DSGVOBadge({ className }: DSGVOBadgeProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-4 sm:p-6 text-center",
      className
    )}>
      <img
        src="/assets/dsgvo-grey-523x480.png"
        alt="DSGVO-konform"
        className="w-24 h-24 sm:w-32 sm:h-32 mb-3"
      />
      <p className="text-sm sm:text-base text-muted-foreground font-medium">
        DSGVO-konform & sicher
      </p>
    </div>
  );
}
