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
 * No optimization, no lazy loading - just a plain img tag
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority,
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
      className={cn("w-full h-full object-cover", className)}
      {...props}
    />
  );
}

export default OptimizedImage;
