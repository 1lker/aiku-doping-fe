// src/features/mind-map/types/mindMap.ts
import { ForceGraph2D } from 'react-force-graph';

// Base types
interface BaseNode {
  id: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface BaseLink {
  source: string | BaseNode;
  target: string | BaseNode;
}

// Node data interface
interface NodeData {
  size?: number;
  type?: 'root' | 'branch' | 'leaf';
  color?: string;
  fontStyle?: 'normal' | 'bold' | 'italic';
  fontSize?: number;
  connections?: Array<{
    target: string;
    strength: number;
  }>;
  // Yeni özellikler
  importance?: 'high' | 'medium' | 'low';
  isExpanded?: boolean;
  animation?: {
    duration?: number;
    delay?: number;
    type?: 'bounce' | 'spring' | 'fade';
  };
}

// Link data interface
interface LinkData {
  level?: number;
  isMainBranch?: boolean;
  isSecondary?: boolean;
  strength?: number;
  curvature?: number;
  particleSpeed?: number;
  particleSize?: number;
  style?: 'solid' | 'dashed' | 'dotted';
  animation?: {
    enabled?: boolean;
    speed?: number;
    particleCount?: number;
  };
}

export interface MindMapNode extends BaseNode {
  label: string;
  level: number;
  parentId: string | null;
  children: MindMapNode[];
  color?: string;
  expanded?: boolean;
  data?: NodeData;
  // Ek özellikler
  highlight?: boolean;
  selected?: boolean;
  visible?: boolean;
  draggable?: boolean;
  fixed?: boolean;
  // Animasyon durumu
  __animState?: {
    scale: number;
    opacity: number;
    rotation: number;
  };
}

export interface MindMapLink extends BaseLink {
  source: string | MindMapNode;
  target: string | MindMapNode;
  strength?: number;
  color?: string;
  data?: LinkData;
  // Ek özellikler
  highlight?: boolean;
  visible?: boolean;
  width?: number;
  opacity?: number;
  // Animasyon durumu
  __animState?: {
    dashOffset: number;
    particleOffset: number;
  };
}

export interface MindMapData {
  nodes: MindMapNode[];
  links: MindMapLink[];
  rootId: string;
  // Ek metadata
  metadata?: {
    title?: string;
    description?: string;
    created?: Date;
    modified?: Date;
    version?: string;
    author?: string;
    tags?: string[];
  };
  // İstatistikler
  stats?: {
    totalNodes: number;
    totalLinks: number;
    maxDepth: number;
    branchCount: number;
  };
}

// Force Graph instance tipi
export type ForceGraphInstance = {
  centerAt: (x: number, y: number, ms: number) => void;
  zoom: (k: number, ms: number) => void;
  zoomToFit: (ms: number, padding?: number) => void;
  d3Force: (forceName: string, force?: any) => any;
  getGraphBbox: () => { x: [number, number]; y: [number, number] };
  // Ek metodlar
  pauseAnimation: () => void;
  resumeAnimation: () => void;
  refresh: () => void;
  screen2GraphCoords: (x: number, y: number) => { x: number; y: number };
  graph2ScreenCoords: (x: number, y: number) => { x: number; y: number };
};
