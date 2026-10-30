import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export const ProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-majorelle via-saffron to-majorelle dark:from-majorelle-dark dark:via-saffron-dark dark:to-majorelle-dark origin-left z-[100]"
      style={{ scaleX }}
    />
  );
};
