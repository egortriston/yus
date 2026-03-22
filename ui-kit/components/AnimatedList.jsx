import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

/**
 * Wraps a single list item and reveals it with a scale+fade animation
 * as it enters the viewport. Drop-in replacement for a plain <div>.
 */
export function AnimatedItem({ children, index = 0, className = '', ...rest }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.15, once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.97, y: 6 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.97, y: 6 }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.03, 0.25), ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Container for a list of AnimatedItems. Adds optional top/bottom
 * gradient overlays when the content is scrollable.
 *
 * Usage:
 *   <AnimatedList>
 *     {items.map((item, i) => (
 *       <AnimatedItem key={item.id} index={i}> ... </AnimatedItem>
 *     ))}
 *   </AnimatedList>
 */
export function AnimatedList({ children, className = '', showGradients = false }) {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
}
