import React, { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ForceGraph2D } from 'react-force-graph';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ZoomIn, ZoomOut, Maximize2, Search } from 'lucide-react';
import type {
  MindMapNode,
  MindMapData,
  ForceGraphInstance
} from '@/types/mindMap';
import { nodeVariants, getNodeColor } from '@/utils/colorScheme';
import { useMindMapState } from '@/hooks/useMindMapState';
import { ErrorBoundary } from './ErrorBoundary';

interface MindMapProps {
  data: MindMapData;
  width: number;
  height: number;
  onNodeClick?: (node: MindMapNode) => void;
}

export const MindMap = React.forwardRef<any, MindMapProps>((props, ref) => {
  const { data, width, height, onNodeClick } = props;

  const {
    hoveredNode,
    selectedNode,
    searchTerm,
    highlightedNodes,
    handleNodeHover,
    handleNodeSelect,
    handleSearch
  } = useMindMapState();

  const handleNodeClick = useCallback(
    (node: MindMapNode) => {
      handleNodeSelect(node);
      onNodeClick?.(node);
    },
    [handleNodeSelect, onNodeClick]
  );

  const graphData = {
    nodes: data.nodes.map((node) => ({
      ...node,
      fx: node.fixed ? node.x : undefined,
      fy: node.fixed ? node.y : undefined
    })),
    links: data.links
  };

  return (
    <ErrorBoundary>
      <Card className='relative'>
        <div className='absolute left-4 top-4 z-10 flex gap-4'>
          <div className='relative'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
            <Input
              className='w-64 pl-8'
              placeholder='Kavram ara...'
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value, data)}
            />
          </div>
        </div>

        <ForceGraph2D
          ref={ref as any}
          graphData={graphData as any}
          width={width}
          height={height}
          nodeLabel={(node: any) => (node as MindMapNode).label}
          nodeColor={(node: any) => {
            const n = node as MindMapNode;
            return !searchTerm || highlightedNodes.has(n.id)
              ? getNodeColor(n)
              : '#e5e7eb';
          }}
          nodeRelSize={1}
          nodeVal={(node: any) => {
            const n = node as MindMapNode;
            const baseSize = n.data?.size || 8;
            return selectedNode?.id === n.id
              ? baseSize * 1.5
              : hoveredNode?.id === n.id
                ? baseSize * 1.2
                : baseSize;
          }}
          linkWidth={(link: any) => {
            if (link.data?.isSecondary) return 0.5;
            if (link.data?.isMainBranch) return 3;
            return Math.max(3 - (link.data?.level || 0) * 0.5, 1);
          }}
          linkColor={(link: any) => {
            if (link.data?.isSecondary) return 'rgba(203, 213, 225, 0.2)';
            if (link.data?.isMainBranch) return 'rgba(59, 130, 246, 0.5)';
            return `rgba(148, 163, 184, ${0.8 - (link.data?.level || 0) * 0.1})`;
          }}
          onNodeClick={(node: any) => handleNodeClick(node as MindMapNode)}
          onNodeHover={(node: any) =>
            handleNodeHover(node as MindMapNode | null)
          }
          nodeCanvasObject={(
            node: any,
            ctx: CanvasRenderingContext2D,
            globalScale: number
          ) => {
            const n = node as MindMapNode;
            const isHighlighted = !searchTerm || highlightedNodes.has(n.id);
            const isSelected = selectedNode?.id === n.id;

            const label = n.label;
            const fontSize = Math.max((n.data?.size || 16) / globalScale, 12);
            ctx.font = `${n.data?.fontStyle || 'normal'} ${fontSize}px Inter, sans-serif`;

            const textWidth = ctx.measureText(label).width;
            const padding = fontSize * 0.4;
            const boxWidth = textWidth + padding * 2;
            const boxHeight = fontSize + padding * 2;

            // Background with gradient
            const gradient = ctx.createRadialGradient(
              n.x!,
              n.y!,
              0,
              n.x!,
              n.y!,
              boxWidth / 2
            );

            if (n.level === 0) {
              gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
              gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
            } else if (isSelected) {
              gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
              gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
            } else if (isHighlighted) {
              gradient.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
              gradient.addColorStop(1, 'rgba(99, 102, 241, 0.05)');
            } else {
              gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
              gradient.addColorStop(1, 'rgba(255, 255, 255, 0.6)');
            }

            // Box shadow
            const shadowBlur = fontSize * 0.2;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
            ctx.shadowBlur = shadowBlur;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 2;

            // Draw rounded rectangle
            const borderRadius = fontSize * 0.3;
            const x = n.x! - boxWidth / 2;
            const y = n.y! - boxHeight / 2;

            ctx.beginPath();
            ctx.moveTo(x + borderRadius, y);
            ctx.lineTo(x + boxWidth - borderRadius, y);
            ctx.quadraticCurveTo(
              x + boxWidth,
              y,
              x + boxWidth,
              y + borderRadius
            );
            ctx.lineTo(x + boxWidth, y + boxHeight - borderRadius);
            ctx.quadraticCurveTo(
              x + boxWidth,
              y + boxHeight,
              x + boxWidth - borderRadius,
              y + boxHeight
            );
            ctx.lineTo(x + borderRadius, y + boxHeight);
            ctx.quadraticCurveTo(
              x,
              y + boxHeight,
              x,
              y + boxHeight - borderRadius
            );
            ctx.lineTo(x, y + borderRadius);
            ctx.quadraticCurveTo(x, y, x + borderRadius, y);
            ctx.closePath();

            ctx.fillStyle = gradient;
            ctx.fill();

            // Border
            ctx.shadowColor = 'transparent';
            ctx.strokeStyle = isSelected
              ? '#3b82f6'
              : isHighlighted
                ? 'rgba(99, 102, 241, 0.3)'
                : 'rgba(203, 213, 225, 0.5)';
            ctx.lineWidth = isSelected ? 2 / globalScale : 1 / globalScale;
            ctx.stroke();

            // Text
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = isHighlighted ? '#1e40af' : '#1e293b';
            ctx.fillText(label, n.x!, n.y!);
          }}
          linkDirectionalParticles={4}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleSpeed={0.004}
          linkCurvature={0.2}
          d3AlphaDecay={0.01}
          d3VelocityDecay={0.3}
          cooldownTime={3000}
          enableNodeDrag={false}
          enablePanInteraction={true}
          minZoom={0.5}
          maxZoom={2.5}
        />
      </Card>
    </ErrorBoundary>
  );
});

MindMap.displayName = 'MindMap';
