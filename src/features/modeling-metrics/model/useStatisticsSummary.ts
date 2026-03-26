"use client";

import { useSolutionStore, type StatType } from "@fsd/entities/solution";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";
import {
  getAccessPattern,
  getRecoveryCost,
  getRedundancyMetrics,
} from "@fsd/entities/solution/lib/metrics";

export function useStatisticsSummary(): StatType[] {
  const { nodes, edges, selectedVersionId } = useSolutionStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      selectedVersionId: state.selectedVersionId,
    }))
  );

  return useMemo(
    () => [
      {
        name: "Access Pattern",
        value: getAccessPattern(nodes, edges),
        color: "#0052CC",
      },
      {
        name: "Recovery Cost",
        value: getRecoveryCost(nodes, edges),
        color: "#00875A",
      },
      {
        name: "Redundancy",
        value: getRedundancyMetrics(nodes),
        color: "#5243AA",
      },
    ],
    [nodes, edges, selectedVersionId]
  );
}
