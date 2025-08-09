"use client";

import React from "react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";

export function AnimatedGrid({ children }: { children: React.ReactNode }) {
    const reduce = useReducedMotion();

    const easeOutBezier = [0.22, 1, 0.36, 1] as const;
    
    const container = {
        hidden: {},
        show: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.06,
        },
        },
    };

    const item = {
        hidden: {
        opacity: 0,
        y: 24,
        rotateX: reduce ? 0 : -12, // subtle flip in
        },
        show: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
            duration: 0.5,
            ease: easeOutBezier,
        },
        },
    };

  return (
    <MotionConfig reducedMotion="user">
      <motion.ul
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        style={{ perspective: 1000 }}
      >
        {React.Children.map(children, (child, i) => (
          <motion.li
            key={i}
            variants={item}
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              willChange: "transform, opacity",
            }}
          >
            {child}
          </motion.li>
        ))}
      </motion.ul>
    </MotionConfig>
  );
}