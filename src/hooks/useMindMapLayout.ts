// src/features/mind-map/hooks/useMindMapLayout.ts
import { useRef, useCallback, useState } from 'react';
import * as d3 from 'd3';
import { MindMapData, MindMapNode } from '@/types/mindMap';

export const useMindMapLayout = (width: number, height: number) => {
  const simulationRef = useRef<
    d3.Simulation<d3.SimulationNodeDatum, undefined>
  >(null!);
  const [centerForce, setCenterForce] =
    useState<d3.ForceCenter<d3.SimulationNodeDatum>>();

  const initializeSimulation = useCallback(() => {
    if (simulationRef.current) simulationRef.current.stop();

    const simulation = d3
      .forceSimulation()
      .force(
        'link',
        d3
          .forceLink()
          .id((d: any) => d.id)
          .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    simulationRef.current = simulation;
    setCenterForce(
      simulation.force('center') as d3.ForceCenter<d3.SimulationNodeDatum>
    );

    return simulation;
  }, [width, height]);

  return {
    centerForce,
    initializeSimulation
  };
};
