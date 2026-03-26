"use client";

import { useQueriesStore } from "@fsd/entities/query";
import { useSolutionStore } from "@fsd/entities/solution";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";
import { calculateHandledQueriesPercentage } from "@fsd/entities/solution/lib/metrics";

export function useHandledQueriesPercentage(): number {
	const queries = useQueriesStore((state) => state.queries);
	
	const { nodes, edges, selectedVersionId } = useSolutionStore(
		useShallow((state) => ({
			nodes: state.nodes,
			edges: state.edges,
			selectedVersionId: state.selectedVersionId,
		}))
	);

	return useMemo(
		() => calculateHandledQueriesPercentage(queries, nodes, edges),
		[queries, nodes, edges, selectedVersionId]
	);
}
