import { interpolateRgb } from 'd3-interpolate';

const BASE_COLORS = {
  root: '#2563eb', // blue-600
  primary: '#3b82f6', // blue-500
  secondary: '#ec4899', // pink-500
  tertiary: '#8b5cf6', // violet-500
  quaternary: '#10b981', // emerald-500
  leaf: '#6366f1' // indigo-500
};

export const generateGradientColors = (steps: number): string[] => {
  const colors: string[] = [];
  const interpolator = interpolateRgb(
    BASE_COLORS.primary,
    BASE_COLORS.secondary
  );

  for (let i = 0; i < steps; i++) {
    colors.push(interpolator(i / (steps - 1)));
  }

  return colors;
};

export const getNodeColor = (node: {
  level: number;
  data?: { type?: string };
}): string => {
  if (node.data?.type === 'root') return BASE_COLORS.root;
  if (node.data?.type === 'leaf') return BASE_COLORS.leaf;

  const levelColors = [
    BASE_COLORS.primary,
    BASE_COLORS.secondary,
    BASE_COLORS.tertiary,
    BASE_COLORS.quaternary
  ];

  return levelColors[node.level % levelColors.length];
};

export const getLinkGradient = (startColor: string, endColor: string) => {
  return {
    from: startColor,
    to: endColor,
    id: `gradient-${startColor.slice(1)}-${endColor.slice(1)}`
  };
};

export const nodeVariants = {
  hidden: {
    scale: 0,
    opacity: 0
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  },
  hover: {
    scale: 1.1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.95
  }
};

export const linkVariants = {
  hidden: {
    pathLength: 0,
    opacity: 0
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  }
};
