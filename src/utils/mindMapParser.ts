// src/features/mind-map/utils/mindMapParser.ts
import * as d3 from 'd3';
import { MindMapNode, MindMapLink, MindMapData } from '../types/mindMap';

const generateUniqueId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

const countIndentation = (line: string): number => {
  const match = line.match(/^\s*/);
  return match ? match[0].length / 2 : 0;
};

export const parseMindMapString = (input: string): MindMapData => {
  const lines = input
    .replace(/^mindmap\s+/, '')
    .split('\n')
    .filter((line) => line.trim().length > 0);

  const nodes: MindMapNode[] = [];
  const links: MindMapLink[] = [];
  const stack: { node: MindMapNode; level: number }[] = [];

  lines.forEach((line, index) => {
    const level = line.search(/\S|\$/);
    const label = line.trim();
    const nodeId = `node_\${index}`;

    const node: MindMapNode = {
      id: nodeId,
      label,
      level: level / 2,
      parentId: null,
      children: [],
      data: {
        size: Math.max(30 - level, 15),
        type: level === 0 ? 'root' : level === 2 ? 'branch' : 'leaf'
      }
    };

    while (stack.length > 0 && stack[stack.length - 1].level >= level / 2) {
      stack.pop();
    }

    if (stack.length > 0) {
      const parent = stack[stack.length - 1].node;
      node.parentId = parent.id;
      parent.children.push(node);

      links.push({
        source: parent.id,
        target: node.id,
        data: {
          level: level / 2,
          isMainBranch: level === 2
        }
      });
    }

    nodes.push(node);
    stack.push({ node, level: level / 2 });
  });

  return layoutMindMap({ nodes, links, rootId: nodes[0].id });
};

export const layoutMindMap = (data: MindMapData): MindMapData => {
  const { nodes, links, rootId } = data;

  // Add circular layout positioning
  const angleStep = (2 * Math.PI) / nodes.filter((n) => n.level === 1).length;
  let currentAngle = 0;

  nodes.forEach((node) => {
    if (node.level === 0) {
      // Root node at center
      node.x = 0;
      node.y = 0;
      node.fx = 0;
      node.fy = 0;
    } else if (node.level === 1) {
      // Main branches in a circle
      const radius = 300;
      node.x = Math.cos(currentAngle) * radius;
      node.y = Math.sin(currentAngle) * radius;
      // Soft fix position for main branches
      node.fx = node.x * 0.8;
      node.fy = node.y * 0.8;
      currentAngle += angleStep;
    } else {
      // Sub-branches with slight positioning based on parent
      const parent = nodes.find((n) => n.id === node.parentId);
      if (parent) {
        const angle = Math.random() * 2 * Math.PI;
        const radius = 100 / node.level;
        node.x = (parent.x || 0) + Math.cos(angle) * radius;
        node.y = (parent.y || 0) + Math.sin(angle) * radius;
      }
    }
  });

  // Calculate statistics
  const stats = {
    totalNodes: nodes.length,
    totalLinks: links.length,
    maxDepth: Math.max(...nodes.map((n) => n.level)),
    branchCount: nodes.filter((n) => n.level === 1).length
  };

  return {
    nodes,
    links,
    rootId,
    stats
  };
};
