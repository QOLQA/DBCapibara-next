import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
} from "@/components/ui/chart";
import { ChartTooltipContent } from "@/components/ui/chart";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

const MetricsChart = ({ metricsChartData }: { metricsChartData: any[] }) => {
	return (
		<div className="min-h-[100px] w-[48%] flex flex-col gap-20 ">
			{/* Rotulo de la grafica */}
			<div className="flex gap-2 flex-row justify-between pl-10">
				<div className=" text-[#0052CC] flex items-center gap-2">
					<div className="size-4 bg-[#0052CC] rounded-sm"></div>
					<p>Access Pattern</p>
				</div>
				<div className=" text-[#00875A] flex items-center gap-2">
					<div className="size-4 bg-[#00875A] rounded-sm"></div>
					<p>Recovery Cost</p>
				</div>
				<div className=" text-[#5243AA] flex items-center gap-2">
					<div className="size-4 bg-[#5243AA] rounded-sm"></div>
					<p>Redundancy</p>
				</div>
			</div>
			<ChartContainer config={chartConfig} className="w-full h-full">
				<BarChart accessibilityLayer barSize={20} data={metricsChartData}>
					<CartesianGrid vertical={false} />
					<XAxis
						dataKey="schema"
						tickLine={false}
						tickMargin={10}
						axisLine={false}
						tickFormatter={(value) => value}
						padding={{ left: 40, right: 40 }}
					/>
					<YAxis tickLine={false} tickMargin={10} axisLine={false} />
					<ChartTooltip
						content={
							<ChartTooltipContent hideLabel className="min-w-[10rem]" />
						}
					/>
					{/* <ChartLegend content={<ChartLegendContent />} /> */}
					<Bar
						dataKey="redundancy"
						stackId="a"
						fill="#5243AA"
						radius={[0, 0, 4, 4]}
					/>
					<Bar
						dataKey="recovery_cost"
						stackId="a"
						fill="#00875A"
						radius={[4, 4, 0, 0]}
					/>
					<Bar
						dataKey="access_pattern"
						stackId="a"
						fill="#0052CC"
						radius={[4, 4, 0, 0]}
					/>
				</BarChart>
			</ChartContainer>
		</div>
	);
};

export default MetricsChart;
