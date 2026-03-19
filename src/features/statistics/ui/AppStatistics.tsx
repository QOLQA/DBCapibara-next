"use client";

import { QueryStatsGraph } from "./QueryStatsGraph";
import { SquadStats } from "./SquadStats";
import type { StastType } from "@fsd/entities/solution";
import { StatsLineTotal } from "./StatsLineTotal";
import { useSolutionStore } from "@fsd/entities/solution";
import {
	getAccessPattern,
	getRecoveryCost,
	getRedundancyMetrics,
} from "@fsd/entities/solution/lib/analytics";

export const AppStatistics = () => {
	const accessPatternValue = useSolutionStore((state) =>
		getAccessPattern(state.nodes, state.edges),
	);

	const recoveryCostValue = useSolutionStore((state) =>
		getRecoveryCost(state.nodes, state.edges),
	);

	const redundancyValue = useSolutionStore((state) =>
		getRedundancyMetrics(state.nodes),
	);

	const data: StastType[] = [
		{ name: "Access Pattern", value: accessPatternValue, color: "#0052CC" },
		{
			name: "Recovery Cost",
			value: recoveryCostValue,
			color: "#00875A",
		},
		{ name: "Redundancy", value: redundancyValue, color: "#5243AA" },
	];
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
};
