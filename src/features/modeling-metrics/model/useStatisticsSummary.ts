"use client";

import { useSolutionStore, type StatType } from "@fsd/entities/solution";
import {
	getAccessPattern,
	getRecoveryCost,
	getRedundancyMetrics,
} from "@fsd/entities/solution/lib/analytics";

export function useStatisticsSummary(): StatType[] {
	return useSolutionStore((state) => [
		{
			name: "Access Pattern",
			value: getAccessPattern(state.nodes, state.edges),
			color: "#0052CC",
		},
		{
			name: "Recovery Cost",
			value: getRecoveryCost(state.nodes, state.edges),
			color: "#00875A",
		},
		{
			name: "Redundancy",
			value: getRedundancyMetrics(state.nodes),
			color: "#5243AA",
		},
	]);
}
