import { useState, useRef, useEffect } from 'react';
import { useInView } from 'framer-motion';

/**
 * Custom hook for animating a number count-up effect when element comes into view
 * @param end - The final number to count to
 * @param duration - Animation duration in milliseconds (default: 2000)
 * @returns Object with count value and ref to attach to the element
 */
export function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, isInView]);

  return { count, ref };
}
