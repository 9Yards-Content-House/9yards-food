import { useState, useRef, useEffect, ImgHTMLAttributes } from "react";
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
 * OptimizedImage - Performance-optimized image component
 * 
 * Features:
 * - Lazy loading with IntersectionObserver
 * - Blur placeholder while loading
 * - Responsive srcset for Unsplash images
 * - Loading state management
 * - Priority loading for above-the-fold images
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate responsive srcset for Unsplash images
  const generateSrcSet = (url: string): string | undefined => {
    if (!url.includes("unsplash.com")) return undefined;
    
    // Remove existing width parameter and add responsive widths
    const baseUrl = url.replace(/[?&]w=\d+/, "").replace(/[?&]q=\d+/, "");
    const separator = baseUrl.includes("?") ? "&" : "?";
    const widths = [320, 480, 640, 768, 1024, 1280, 1536];
    
    return widths
      .map((w) => `${baseUrl}${separator}w=${w}&q=${quality}&auto=format ${w}w`)
      .join(", ");
  };

  // Generate optimized src
  const getOptimizedSrc = (url: string): string => {
    if (!url.includes("unsplash.com")) return url;
    
    const baseUrl = url.replace(/[?&]w=\d+/, "").replace(/[?&]q=\d+/, "");
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}w=${width || 800}&q=${quality}&auto=format`;
  };

  // Generate blur placeholder for Unsplash
  const getBlurPlaceholder = (url: string): string => {
    if (blurDataURL) return blurDataURL;
    if (!url.includes("unsplash.com")) return "";
    
    const baseUrl = url.replace(/[?&]w=\d+/, "").replace(/[?&]q=\d+/, "");
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}w=10&q=10&blur=50`;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "200px", // Start loading 200px before in view
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const srcSet = generateSrcSet(src);
  const optimizedSrc = getOptimizedSrc(src);
  const blurSrc = placeholder === "blur" ? getBlurPlaceholder(src) : "";

  return (
    <div
      ref={imgRef}
      className={cn(
        "relative overflow-hidden",
        className
      )}
      style={{
        aspectRatio: width && height ? `${width}/${height}` : undefined,
      }}
    >
      {/* Blur placeholder */}
      {placeholder === "blur" && blurSrc && !isLoaded && (
        <img
          src={blurSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-lg"
        />
      )}
      
      {/* Loading skeleton for empty placeholder */}
      {placeholder === "empty" && !isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}

      {/* Main image */}
      {isInView && (
        <img
          src={optimizedSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          {...props}
        />
      )}
    </div>
  );
}

export default OptimizedImage;
