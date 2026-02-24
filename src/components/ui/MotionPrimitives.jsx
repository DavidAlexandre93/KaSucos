import { motion } from "../../lib/motion";

export function MotionSection({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export const cardMotion = {
  whileHover: { y: -8, scale: 1.015 },
  whileTap: { scale: 0.985 },
  transition: { type: "spring", stiffness: 280, damping: 20 },
};

export const buttonMotion = {
  whileHover: { scale: 1.03, y: -2 },
  whileTap: { scale: 0.97 },
  transition: { type: "spring", stiffness: 340, damping: 18 },
};
