"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/**
 * The only route-level animation in the app (see README motion policy):
 * a brief fade + 8px slide between the four bottom-nav sections. Nothing
 * fancier - no stagger, no spring/bounce easing.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
