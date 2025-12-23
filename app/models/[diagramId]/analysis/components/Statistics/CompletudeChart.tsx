import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
	completude: {
		label: "Completude",
		color: "#E93544",
	},
} satisfies ChartConfig;

const CompletudeChart = ({
	completudeChartData,
}: {
	completudeChartData: any[];
}) => {
	return (
		<div className="min-h-[100px] w-[45%] flex flex-col gap-20 ">
			{/* Rotulo de la grafica */}
			<div className="flex gap-2 flex-row justify-center">
				<div className=" text-[#E93544] flex items-center gap-2">
					<div className="size-4 bg-[#E93544] rounded-sm"></div>
					<p>Completude (Queries Handled)</p>
				</div>
			</div>
			<ChartContainer config={chartConfig} className="w-full h-full">
				<BarChart accessibilityLayer barSize={20} data={completudeChartData}>
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
						dataKey="completude"
						stackId="a"
						fill="#E93544"
						radius={[0, 0, 4, 4]}
					/>
				</BarChart>
			</ChartContainer>
		</div>
	);
};

export default CompletudeChart;
