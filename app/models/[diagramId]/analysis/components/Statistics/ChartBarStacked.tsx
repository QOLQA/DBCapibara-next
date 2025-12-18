"use client";

import { ChartConfig } from "@/components/ui/chart";
import { useCanvasStore } from "@/state/canvaStore";
import { getAccessPattern } from "@/lib/getAccessPattern";
import { getRedundancyMetrics } from "@/lib/getRedundancyMetrics";
import { getRecoveryCost } from "@/lib/getRecoveryCost";
import { useEffect, useState } from "react";
import { calculateHandledQueriesPercentage } from "@/lib/getHandledQueries";
import MetricsChart from "./MetricsChart";
import CompletudeChart from "./CompletudeChart";
import { TableMetrics } from "./TableMetrics";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const description = "A stacked bar chart with a legend";

const chartConfig = {
	redundancy: {
		label: "Redundancy",
		color: "#5243AA",
	},
	recovery_cost: {
		label: "Recovery Cost",
		color: "#00875A",
	},
	access_pattern: {
		label: "Access Pattern",
		color: "#0052CC",
	},
} satisfies ChartConfig;

export function ChartBarStacked() {
	const router = useRouter();
	const versions = useCanvasStore((state) => state.versions);
	const queries = useCanvasStore((state) => state.queries);
	const [metricsChartData, setMetricsChartData] = useState<any[]>([]);
	const [completudeChartData, setCompletudeChartData] = useState<any[]>([]);
	const [selectedSchemas, setSelectedSchemas] = useState<string[]>([]);

	console.log("versions", versions);

	const versionData = versions.map((version) => ({
		schema_name: version.description,
		nodes: version.nodes,
		edges: version.edges,
	}));

	useEffect(() => {
		const metricsData = versionData.map((version) => {
			console.log("version", version.schema_name);
			return {
				schema: version.schema_name,
				redundancy: getRedundancyMetrics(version.nodes),
				recovery_cost: getRecoveryCost(version.nodes, version.edges),
				access_pattern: getAccessPattern(version.nodes, version.edges),
			};
		});
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
	}, [versions]);

	// Filtrar datos basados en la selección
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
