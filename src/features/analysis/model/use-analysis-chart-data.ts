"use client";

import { useMemo, useState } from "react";
import { useSolutionStore } from "@fsd/entities/solution";
import { useQueriesStore } from "@fsd/entities/query";
import {
	getAccessPattern,
	getRedundancyMetrics,
	getRecoveryCost,
	calculateHandledQueriesPercentage,
} from "@fsd/entities/solution/lib/metrics";
import type { CompletudeChartRow, MetricChartRow } from "./types";

export function useAnalysisChartData() {
	const versions = useSolutionStore((state) => state.versions);
	const queries = useQueriesStore((state) => state.queries);
	const [selectedSchemas, setSelectedSchemas] = useState<string[]>([]);

	const { metricsChartData, completudeChartData } = useMemo(() => {
		const versionData = versions.map((version) => ({
			schema_name: version.description,
			nodes: version.nodes,
			edges: version.edges,
		}));

		const metricsChartData: MetricChartRow[] = versionData.map((version) => ({
			schema: version.schema_name,
			redundancy: getRedundancyMetrics(version.nodes),
			recovery_cost: getRecoveryCost(version.nodes, version.edges),
			access_pattern: getAccessPattern(version.nodes, version.edges),
		}));

		const completudeChartData: CompletudeChartRow[] = versionData.map(
			(version) => ({
				schema: version.schema_name,
				completude: calculateHandledQueriesPercentage(
					queries,
					version.nodes,
					version.edges,
				),
			}),
		);

		return { metricsChartData, completudeChartData };
	}, [versions, queries]);

	const filteredMetricsData = useMemo(() => {
		if (selectedSchemas.length === 0) {
			return metricsChartData;
		}
		return metricsChartData.filter((metric) =>
			selectedSchemas.includes(metric.schema),
		);
	}, [metricsChartData, selectedSchemas]);

	const filteredCompletudeData = useMemo(() => {
		if (selectedSchemas.length === 0) {
			return completudeChartData;
		}
		return completudeChartData.filter((row) =>
			selectedSchemas.includes(row.schema),
		);
	}, [completudeChartData, selectedSchemas]);

	return {
		metricsChartData,
		completudeChartData,
		filteredMetricsData,
		filteredCompletudeData,
		setSelectedSchemas,
	};
}
