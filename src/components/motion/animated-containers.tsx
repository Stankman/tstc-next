'use client';

import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedContainer({ children, className = '', delay = 0 }: AnimatedContainerProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedFadeIn({ children, className = '', delay = 0 }: AnimatedContainerProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedSlideUp({ children, className = '', delay = 0 }: AnimatedContainerProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.7, 
        delay,
        type: "spring",
        stiffness: 80,
        damping: 12
      }}
    >
      {children}
    </motion.div>
  );
}
