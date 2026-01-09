import { useState, useCallback, useRef, useEffect } from 'react';
import { haptics } from '@/lib/utils/ui';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPull?: number;
  disabled?: boolean;
}

interface UsePullToRefreshReturn {
  pullDistance: number;
  isRefreshing: boolean;
  isPulling: boolean;
  progress: number;
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
}

/**
 * usePullToRefresh - Native-like pull to refresh hook
 * 
 * Usage:
 * ```tsx
 * const { pullDistance, isRefreshing, progress, handlers } = usePullToRefresh({
 *   onRefresh: async () => {
 *     await fetchData();
 *   }
 * });
 * 
 * return (
 *   <div {...handlers}>
 *     <PullToRefreshIndicator distance={pullDistance} progress={progress} isRefreshing={isRefreshing} />
 *     {content}
 *   </div>
 * );
 * ```
 */
export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  maxPull = 120,
  disabled = false,
}: UsePullToRefreshOptions): UsePullToRefreshReturn {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  
  const startY = useRef(0);
  const currentY = useRef(0);
  const hasTriggeredHaptic = useRef(false);

  const progress = Math.min(pullDistance / threshold, 1);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    
    // Only activate if at top of scroll
    const element = e.currentTarget as HTMLElement;
    if (element.scrollTop > 0) return;
    
    startY.current = e.touches[0].clientY;
    setIsPulling(true);
  }, [disabled, isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || disabled || isRefreshing) return;
    
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;
    
    // Only pull down, not up
    if (diff < 0) {
      setPullDistance(0);
      return;
    }
    
    // Apply resistance as pull increases
    const resistance = 1 - Math.min(diff / (maxPull * 3), 0.6);
    const newDistance = Math.min(diff * resistance, maxPull);
    
    setPullDistance(newDistance);
    
    // Haptic feedback when crossing threshold
    if (newDistance >= threshold && !hasTriggeredHaptic.current) {
      haptics.threshold();
      hasTriggeredHaptic.current = true;
    } else if (newDistance < threshold && hasTriggeredHaptic.current) {
      hasTriggeredHaptic.current = false;
    }
  }, [isPulling, disabled, isRefreshing, threshold, maxPull]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;
    
    setIsPulling(false);
    hasTriggeredHaptic.current = false;
    
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(threshold * 0.6); // Keep indicator visible
      
      haptics.refresh();
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh]);

  return {
    pullDistance,
    isRefreshing,
    isPulling,
    progress,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}

/**
 * PullToRefreshIndicator - Visual feedback for pull to refresh
 */
interface PullToRefreshIndicatorProps {
  distance: number;
  progress: number;
  isRefreshing: boolean;
  className?: string;
}

export function PullToRefreshIndicator({
  distance,
  progress,
  isRefreshing,
  className = '',
}: PullToRefreshIndicatorProps) {
  if (distance === 0 && !isRefreshing) return null;

  return (
    <div 
      className={`flex justify-center items-center overflow-hidden transition-all duration-200 ${className}`}
      style={{ height: distance }}
    >
      <div 
        className={`w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center transition-transform ${
          isRefreshing ? 'animate-spin' : ''
        }`}
        style={{ 
          transform: isRefreshing ? undefined : `rotate(${progress * 360}deg)`,
          opacity: Math.min(progress + 0.3, 1),
        }}
      >
        {isRefreshing ? (
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg 
            className="w-4 h-4 text-primary"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            style={{ 
              transform: `rotate(${progress >= 1 ? 180 : 0}deg)`,
              transition: 'transform 0.2s ease',
            }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        )}
      </div>
    </div>
  );
}

export default usePullToRefresh;
