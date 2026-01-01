import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

/**
 * Skeleton - Loading placeholder component
 * 
 * Use for content placeholders during loading states
 */
export function Skeleton({
  className,
  variant = "text",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) {
  const baseStyles = "bg-muted";
  
  const variantStyles = {
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };
  
  const animationStyles = {
    pulse: "animate-pulse",
    wave: "animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]",
    none: "",
  };

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
}

/**
 * CardSkeleton - Skeleton loader for card layouts
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card rounded-2xl overflow-hidden shadow-card", className)}>
      <Skeleton variant="rectangular" className="aspect-[4/3] w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" className="w-3/4 h-5" />
        <Skeleton variant="text" className="w-1/2 h-4" />
        <div className="flex justify-between pt-2">
          <Skeleton variant="text" className="w-20 h-6" />
          <Skeleton variant="circular" className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}

/**
 * TextSkeleton - Multi-line text skeleton
 */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={i === lines - 1 ? "w-2/3" : "w-full"}
        />
      ))}
    </div>
  );
}

export default Skeleton;
