import { ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * PageTransition - Wrapper for smooth page transitions
 * 
 * Uses framer-motion for iOS-like slide transitions on mobile
 * and subtle fade on desktop for a native app feel.
 * 
 * Usage: Wrap your page content with this component in App.tsx
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();

  const pageVariants: Variants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * MobileSlideTransition - iOS-style slide transition for mobile navigation
 * 
 * Use for modals, drawers, and sub-pages that should slide in from right
 */
export function MobileSlideTransition({ 
  children, 
  direction = 'right' 
}: { 
  children: ReactNode; 
  direction?: 'left' | 'right' | 'up' | 'down';
}) {
  const getTransform = () => {
    switch (direction) {
      case 'left': return { x: '-100%' };
      case 'right': return { x: '100%' };
      case 'up': return { y: '-100%' };
      case 'down': return { y: '100%' };
      default: return { x: '100%' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getTransform() }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, ...getTransform() }}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 300,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * FadeTransition - Simple fade in/out for content areas
 */
export function FadeTransition({ 
  children,
  delay = 0,
}: { 
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.2,
        delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * SlideUpTransition - Content that slides up and fades in
 * 
 * Great for lists, cards, and content that loads dynamically
 */
export function SlideUpTransition({ 
  children,
  delay = 0,
}: { 
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        duration: 0.3,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerChildren - Stagger animation for list items
 */
export function StaggerContainer({ 
  children,
  staggerDelay = 0.05,
}: { 
  children: ReactNode;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.25,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
