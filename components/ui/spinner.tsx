import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  color?: "default" | "primary" | "white";
}

export function Spinner({
  className,
  size = "md",
  color = "default",
  ...props
}: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const colorClasses = {
    default: "text-foreground",
    primary: "text-golf-600",
    white: "text-white",
  };

  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      {...props}
    >
      <span className="sr-only">読み込み中...</span>
    </div>
  );
}