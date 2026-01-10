import { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
}

/**
 * OptimizedImage - Simple image component
 * 
 * All images load immediately - no lazy loading
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = "blur",
  blurDataURL,
  sizes = "100vw",
  quality = 80,
  ...props
}: OptimizedImageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        className
      )}
      style={{
        aspectRatio: width && height ? `${width}/${height}` : undefined,
      }}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="eager"
        decoding="sync"
        fetchPriority="high"
        className="w-full h-full object-cover"
        {...props}
      />
    </div>
  );
}

export default OptimizedImage;
