import { ReactNode, useRef } from 'react';
import { motion, PanInfo, useMotionValue, useTransform, animate } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { vibrate } from '@/lib/utils/ui';

interface SwipeableItemProps {
  children: ReactNode;
  onDelete: () => void;
  disabled?: boolean;
  deleteThreshold?: number;
  className?: string;
}

/**
 * SwipeableItem - Swipe to delete functionality for list items
 * 
 * Features:
 * - Swipe left to reveal delete action
 * - Haptic feedback on threshold cross
 * - Smooth spring animation
 * - Visual feedback with red background
 * 
 * Only active on touch devices (mobile/tablet)
 */
export default function SwipeableItem({
  children,
  onDelete,
  disabled = false,
  deleteThreshold = 100,
  className = '',
}: SwipeableItemProps) {
  const x = useMotionValue(0);
  const hasTriggeredHaptic = useRef(false);
  
  // Transform for the delete background opacity
  const deleteOpacity = useTransform(x, [-deleteThreshold * 1.5, -deleteThreshold, 0], [1, 0.8, 0]);
  const deleteScale = useTransform(x, [-deleteThreshold * 1.5, -deleteThreshold, 0], [1.1, 1, 0.8]);
  
  // Icon animation
  const iconOpacity = useTransform(x, [-60, -30, 0], [1, 0.5, 0]);
  const iconX = useTransform(x, [-deleteThreshold, -50, 0], [0, 10, 30]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const shouldDelete = info.offset.x < -deleteThreshold;
    
    if (shouldDelete) {
      // Animate off screen then delete
      animate(x, -500, {
        type: 'spring',
        stiffness: 400,
        damping: 30,
        onComplete: () => {
          vibrate([50, 30, 50]); // Success vibration pattern
          onDelete();
        },
      });
    } else {
      // Snap back
      animate(x, 0, {
        type: 'spring',
        stiffness: 500,
        damping: 30,
      });
    }
    
    hasTriggeredHaptic.current = false;
  };

  const handleDrag = (_: any, info: PanInfo) => {
    // Trigger haptic when crossing threshold
    if (info.offset.x < -deleteThreshold && !hasTriggeredHaptic.current) {
      vibrate(30);
      hasTriggeredHaptic.current = true;
    } else if (info.offset.x > -deleteThreshold && hasTriggeredHaptic.current) {
      hasTriggeredHaptic.current = false;
    }
  };

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Delete background */}
      <motion.div 
        className="absolute inset-y-0 right-0 flex items-center justify-end pr-4 bg-gradient-to-l from-red-500 to-red-400"
        style={{ 
          opacity: deleteOpacity,
          width: '50%',
        }}
      >
        <motion.div 
          className="flex items-center gap-2 text-white"
          style={{ 
            scale: deleteScale,
            x: iconX,
            opacity: iconOpacity,
          }}
        >
          <Trash2 className="w-5 h-5" />
          <span className="text-sm font-bold">Delete</span>
        </motion.div>
      </motion.div>

      {/* Swipeable content */}
      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -deleteThreshold * 1.5, right: 0 }}
        dragElastic={{ left: 0.3, right: 0 }}
        onDragEnd={handleDragEnd}
        onDrag={handleDrag}
        style={{ x }}
        className="relative bg-background touch-pan-y"
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * SwipeHint - Visual hint showing users they can swipe
 * 
 * Shows a subtle animation on first view
 */
export function SwipeHint({ className = '' }: { className?: string }) {
  return (
    <motion.div 
      className={`flex items-center justify-center gap-2 text-xs text-muted-foreground py-2 ${className}`}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.3 }}
    >
      <motion.span
        animate={{ x: [-5, 0, -5] }}
        transition={{ 
          repeat: 3, 
          duration: 0.6,
          delay: 1,
        }}
      >
        ←
      </motion.span>
      <span>Swipe to delete</span>
    </motion.div>
  );
}
