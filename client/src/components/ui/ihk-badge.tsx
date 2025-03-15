import { cn } from "@/lib/utils";

type BadgeProps = {
  size?: "sm" | "md";
  className?: string;
};

export function IHKBadge({ size = "md", className }: BadgeProps) {
  return (
    <div className={cn(
      "flex flex-col items-center gap-2 p-4 rounded-lg bg-white shadow-sm border",
      size === "sm" ? "max-w-[160px]" : "max-w-[200px]",
      className
    )}>
      <img
        src="/Logo_570px_ihk.png"
        alt="IHK Logo"
        className={cn(
          "h-auto",
          size === "sm" ? "w-16" : "w-20"
        )}
      />
      <div className="text-center">
        <p className={cn(
          "text-gray-700 font-medium",
          size === "sm" ? "text-sm" : "text-base"
        )}>
          IHK-zertifiziertes Unternehmen
        </p>
      </div>
    </div>
  );
}
