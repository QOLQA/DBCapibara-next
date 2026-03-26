"use client";

import { useMemo } from "react";
import { useSolutionStore } from "@fsd/entities/solution";
import { useShallow } from "zustand/react/shallow";
import {
  getAccessPattern,
  getRecoveryCost,
  getRedundancyMetrics,
} from "@fsd/entities/solution/lib/metrics";
import { QueryStatsGraph } from "./QueryStatsGraph";
import { SquadStats } from "./SquadStats";
import { StatsLineTotal } from "./StatsLineTotal";

export function MetricsPanel() {
  // 1. Select RAW data. This selector is stable and won't cause loops.
  const { nodes, edges, selectedVersionId } = useSolutionStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      selectedVersionId: state.selectedVersionId,
    }))
  );

  // 2. Compute the statistics ONLY when nodes, edges, or version changes.
  const data = useMemo(() => {
    return [
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
    ];
  }, [nodes, edges, selectedVersionId]);

  return (
    <div className="flex flex-col h-full w-full items-center justify-between gap-6 overflow-auto custom-scrollbar">
      <div className="w-full">
        <QueryStatsGraph />
      </div>
      <div className="flex items-center justify-between w-full h-full pb-9 gap-2">
        <SquadStats data={data} />
        <StatsLineTotal data={data} />
      </div>
    </div>
  );
}
