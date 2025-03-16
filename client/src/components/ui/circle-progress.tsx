import * as React from "react";
import { cn } from "@/lib/utils";

interface CircleProgressProps {
  value: number;
  max: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showMax?: boolean;
  className?: string;
}

export function CircleProgress({
  value,
  max,
  size = "md",
  showLabel = true,
  showMax = false,
  className
}: CircleProgressProps) {
  const percentage = Math.min(100, (value / max) * 100);

  const sizeClasses = {
    sm: "w-12 h-12 text-sm",
    md: "w-16 h-16 text-base",
    lg: "w-20 h-20 text-lg"
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Hintergrundkreis */}
      <div className="absolute inset-0 rounded-full border-4 border-muted"></div>

      {/* Fortschrittskreis */}
      <div 
        className="absolute inset-0 rounded-full border-4 border-primary"
        style={{
          clipPath: `polygon(50% 50%, 50% 0%, ${percentage > 75 ? '100% 0%' : '50% 0%'}, ${percentage > 50 ? '100% 100%' : '50% 0%'}, ${percentage > 25 ? '0% 100%' : '50% 0%'}, ${percentage > 0 ? '0% 0%' : '50% 0%'}, 50% 0%)`
        }}
      ></div>

      {/* Zentrale Anzeige */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-medium">
            {value}{showMax && `/${max}`}
          </span>
        </div>
      )}
    </div>
  );
}