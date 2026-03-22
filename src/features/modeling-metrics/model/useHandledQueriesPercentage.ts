"use client";

import { useQueriesStore } from "@fsd/entities/query";
import { useSolutionStore } from "@fsd/entities/solution";
import { calculateHandledQueriesPercentage } from "@fsd/entities/solution/lib/metrics";

export function useHandledQueriesPercentage(): number {
	const queries = useQueriesStore((state) => state.queries);

	return useSolutionStore((state) =>
		calculateHandledQueriesPercentage(queries, state.nodes, state.edges),
	);
}
