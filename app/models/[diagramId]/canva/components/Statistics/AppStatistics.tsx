'use client'

import { QueryStatsGraph } from "./QueryStatsGraph"
import { SquadStats } from "./SquadStats"
import type { StastType } from "../../types"
import { StatsLineTotal } from "./StatsLineTotal"
import { useCanvasStore } from "@/state/canvaStore"
import { getAccessPattern } from "@/lib/getAccessPattern"
import { getRecoveryCost } from "@/lib/getRecoveryCost"
import { getRedundancyMetrics } from "@/lib/getRedundancyMetrics"

export const AppStatistics = () => {
	const accessPatternValue = useCanvasStore((state) =>
		getAccessPattern(state.nodes, state.edges)
	);

	const recoveryCostValue = useCanvasStore((state) =>
		getRecoveryCost(state.nodes, state.edges)
	);

	const redundancyValue = useCanvasStore((state) =>
		getRedundancyMetrics(state.nodes)
	);

	const data: StastType[] = [
		{ name: "Access Pattern", value: accessPatternValue, color: "#0052CC" },
		{ name: "Recovery Cost", value: recoveryCostValue, color: "#00875A" },
		{ name: "Redundancy", value: redundancyValue, color: "#5243AA" },
	]
	return (
		<div className="flex flex-col h-full w-full items-center justify-between gap-10">
			<div className="w-full">
				<QueryStatsGraph />
			</div>
			<div className="flex items-center justify-between w-full h-full pb-9 gap-3.5">
				<SquadStats data={data} />
				<StatsLineTotal data={data} />
			</div>
		</div>
	)
}
