// hooks/useMindMapAnimation.ts
import { useCallback } from 'react';
import { MindMapNode } from '../types/mindMap';

export const useMindMapAnimation = () => {
  const getNodeTransition = useCallback((node: MindMapNode) => {
    return {
      duration: 0.3,
      delay: node.level * 0.1
    };
  }, []);

  const getLinkTransition = useCallback(() => {
    return {
      duration: 0.5,
      ease: 'easeInOut'
    };
  }, []);

  return {
    getNodeTransition,
    getLinkTransition
  };
};
