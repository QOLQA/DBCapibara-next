"use client";

import { useSolutionStore } from "@fsd/entities/solution";
import { useQueriesStore } from "@fsd/features/manage-queries";
import {
	getAccessPattern,
	getRedundancyMetrics,
	getRecoveryCost,
	calculateHandledQueriesPercentage,
} from "@fsd/entities/solution/lib/analytics";
import { useEffect, useState } from "react";
import { MetricsChart } from "./MetricsChart";
import { CompletudeChart } from "./CompletudeChart";
import { TableMetrics } from "./TableMetrics";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function ChartBarStacked() {
	const router = useRouter();
	const versions = useSolutionStore((state) => state.versions);
	const queries = useQueriesStore((state) => state.queries);
	const [metricsChartData, setMetricsChartData] = useState<
		{ schema: string; redundancy: number; recovery_cost: number; access_pattern: number }[]
	>([]);
	const [completudeChartData, setCompletudeChartData] = useState<
		{ schema: string; completude: number }[]
	>([]);
	const [selectedSchemas, setSelectedSchemas] = useState<string[]>([]);

	const versionData = versions.map((version) => ({
		schema_name: version.description,
		nodes: version.nodes,
		edges: version.edges,
	}));

	useEffect(() => {
		const metricsData = versionData.map((version) => ({
			schema: version.schema_name,
			redundancy: getRedundancyMetrics(version.nodes),
			recovery_cost: getRecoveryCost(version.nodes, version.edges),
			access_pattern: getAccessPattern(version.nodes, version.edges),
		}));
		setMetricsChartData(metricsData);

		const completudeData = versionData.map((version) => ({
			schema: version.schema_name,
			completude: calculateHandledQueriesPercentage(
				queries,
				version.nodes,
				version.edges
			),
		}));
		setCompletudeChartData(completudeData);
	}, [versions, queries]);

	const filteredMetricsData =
		selectedSchemas.length > 0
			? metricsChartData.filter((metric) =>
					selectedSchemas.includes(metric.schema)
			  )
			: metricsChartData;

	const filteredCompletudeData =
		selectedSchemas.length > 0
			? completudeChartData.filter((completude) =>
					selectedSchemas.includes(completude.schema)
			  )
			: completudeChartData;

	return (
		<div className="flex flex-col w-full h-auto overflow-y-auto justify-start items-center gap-12 custom-scrollbar ">
			<div className="flex flex-col w-full justify-start items-start gap-4 p-4">
				<div className="flex flex-row items-center gap-6">
					<ArrowLeft
						className="text-white cursor-pointer hover:text-secondary-white transition-all duration-300"
						onClick={() => router.back()}
					/>
					<h1 className="text-h3 font-normal">Estadísticas</h1>
				</div>
				<div className="w-full h-[2px] bg-gray" />
			</div>

			<div className="flex flex-row w-[70%] justify-between">
				<MetricsChart metricsChartData={filteredMetricsData} />
				<CompletudeChart completudeChartData={filteredCompletudeData} />
			</div>

			<TableMetrics
				metricsChartData={metricsChartData}
				completudeChartData={completudeChartData}
				onSelectionChange={setSelectedSchemas}
			/>
		</div>
	);
}
