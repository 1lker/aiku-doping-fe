// hooks/useMindMapState.ts
import { useState, useCallback } from 'react';
import { MindMapNode, MindMapData } from '../types/mindMap';

export const useMindMapState = () => {
  const [hoveredNode, setHoveredNode] = useState<MindMapNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(
    new Set()
  );

  const handleNodeHover = useCallback((node: MindMapNode | null) => {
    setHoveredNode(node);
  }, []);

  const handleNodeSelect = useCallback((node: MindMapNode | null) => {
    setSelectedNode(node);
  }, []);

  const handleSearch = useCallback((term: string, data: MindMapData) => {
    setSearchTerm(term);
    if (!term) {
      setHighlightedNodes(new Set());
      return;
    }

    const searchResults = new Set<string>();
    const termLower = term.toLowerCase();

    const searchNode = (node: MindMapNode) => {
      if (node.label.toLowerCase().includes(termLower)) {
        searchResults.add(node.id);
        let currentNode = node;
        while (currentNode.parentId) {
          searchResults.add(currentNode.parentId);
          const parent = data.nodes.find((n) => n.id === currentNode.parentId);
          if (parent) currentNode = parent as MindMapNode;
          else break;
        }
      }
      node.children.forEach(searchNode);
    };

    data.nodes
      .filter((n) => !n.parentId)
      .forEach((node) => searchNode(node as MindMapNode));
    setHighlightedNodes(searchResults);
  }, []);

  return {
    hoveredNode,
    selectedNode,
    searchTerm,
    highlightedNodes,
    handleNodeHover,
    handleNodeSelect,
    handleSearch
  };
};
