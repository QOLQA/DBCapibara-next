"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { useCanvasStore } from "@/state/canvaStore";
import { getAccessPattern } from "@/lib/getAccessPattern";
import { getRedundancyMetrics } from "@/lib/getRedundancyMetrics";
import { getRecoveryCost } from "@/lib/getRecoveryCost";
import { useEffect, useState } from "react";
import { calculateHandledQueriesPercentage } from "@/lib/getHandledQueries";
import MetricsChart from "./MetricsChart";
import CompletudeChart from "./CompletudeChart";
import { TableMetrics } from "./TableMetrics";

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
				<h1 className="text-h3 font-normal">Estadísticas</h1>
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
