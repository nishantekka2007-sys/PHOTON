import { Variants, Transition } from 'framer-motion';

export const springSlow: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 30,
};

export const springSmooth: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 35,
};

export const springTactile: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 28,
};

export const springBouncy: Transition = {
  type: 'spring',
  stiffness: 280,
  damping: 20,
};

export const easeEditorial: Transition = {
  duration: 0.6,
  ease: [0.16, 1, 0.3, 1],
};

export const floatSlow = (delay = 0, yOffset = 8, duration = 6) => ({
  animate: {
    y: [0, -yOffset, 0, yOffset, 0],
    rotate: [0, 0.6, 0, -0.6, 0],
  },
  transition: {
    duration,
    repeat: Infinity,
    ease: 'easeInOut',
    delay,
  },
});

export const floatOpposite = (delay = 0.5, yOffset = 7, duration = 6.5) => ({
  animate: {
    y: [0, yOffset, 0, -yOffset, 0],
    rotate: [0, -0.5, 0, 0.5, 0],
  },
  transition: {
    duration,
    repeat: Infinity,
    ease: 'easeInOut',
    delay,
  },
});

export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

export const staggerEditorial: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerCascade: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const itemFadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export const spatialFadeUp: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export const photoReveal: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } },
};

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
};
