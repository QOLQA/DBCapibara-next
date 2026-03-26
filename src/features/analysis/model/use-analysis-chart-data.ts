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
		const versionData = versions.map((version) => {
			const submodelsDataMap = new Map<number, { nodes: typeof version.nodes; edges: typeof version.edges }>();

			version.nodes.forEach((node) => {
				const idx = node.data?.submodelIndex as number | undefined;
				if (idx !== undefined && idx !== null) {
					if (!submodelsDataMap.has(idx)) {
						submodelsDataMap.set(idx, { nodes: [], edges: [] });
					}
					submodelsDataMap.get(idx)!.nodes.push(node);
				}
			});

			version.edges.forEach((edge) => {
				const sourceNode = version.nodes.find((n) => n.id === edge.source);
				const targetNode = version.nodes.find((n) => n.id === edge.target);

				if (sourceNode && targetNode) {
					const sIdx = sourceNode.data?.submodelIndex as number | undefined;
					const tIdx = targetNode.data?.submodelIndex as number | undefined;
					if (sIdx !== undefined && sIdx === tIdx) {
						submodelsDataMap.get(sIdx)?.edges.push(edge);
					}
				}
			});

			const submodelsData = Array.from(submodelsDataMap.entries())
				.map(([idx, data]) => ({
					submodelIndex: idx,
					nodes: data.nodes,
					edges: data.edges,
				}))
				.sort((a, b) => a.submodelIndex - b.submodelIndex);

			return {
				schema_name: version.description,
				nodes: version.nodes,
				edges: version.edges,
				submodelsData,
			};
		});

		const metricsChartData: MetricChartRow[] = versionData.map((version) => ({
			schema: version.schema_name,
			redundancy: getRedundancyMetrics(version.nodes),
			recovery_cost: getRecoveryCost(version.nodes, version.edges),
			access_pattern: getAccessPattern(version.nodes, version.edges),
			submodels:
				version.submodelsData.length > 0
					? version.submodelsData.map((sm) => ({
							schema: `e${sm.submodelIndex + 1}`,
							submodelIndex: sm.submodelIndex,
							redundancy: getRedundancyMetrics(sm.nodes),
							recovery_cost: getRecoveryCost(sm.nodes, sm.edges),
							access_pattern: getAccessPattern(sm.nodes, sm.edges),
						}))
					: undefined,
		}));

		const completudeChartData: CompletudeChartRow[] = versionData.map(
			(version) => ({
				schema: version.schema_name,
				completude: calculateHandledQueriesPercentage(
					queries,
					version.nodes,
					version.edges,
				),
				submodels:
					version.submodelsData.length > 0
						? version.submodelsData.map((sm) => ({
								schema: `e${sm.submodelIndex + 1}`,
								submodelIndex: sm.submodelIndex,
								completude: calculateHandledQueriesPercentage(
									queries,
									sm.nodes,
									sm.edges,
								),
							}))
						: undefined,
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
