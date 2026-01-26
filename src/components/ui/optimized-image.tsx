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
 * OptimizedImage - Image component with lazy loading
 * 
 * Uses native browser lazy loading for images below the fold.
 * Set priority={true} for above-the-fold images that should load immediately.
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder,
  blurDataURL,
  sizes,
  quality,
  ...props
}: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      className={cn("w-full h-full object-cover", className)}
      {...props}
    />
  );
}

export default OptimizedImage;
