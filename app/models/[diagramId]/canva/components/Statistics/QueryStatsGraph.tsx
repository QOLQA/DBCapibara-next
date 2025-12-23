'use client'

'use client'

import { useCanvasStore } from "@/state/canvaStore"
import { calculateHandledQueriesPercentage } from "@/lib/getHandledQueries"
import {
	Label,
	PolarGrid,
	PolarRadiusAxis,
	RadialBar,
	RadialBarChart,
	ResponsiveContainer,
} from "recharts"


export const QueryStatsGraph = () => {

	const handledPercentage = useCanvasStore((state) =>
		calculateHandledQueriesPercentage(state.queries, state.nodes, state.edges),
	);

	const porcentageAngle = (handledPercentage * 360) / 100

	const chartData = [
		{
			porcentage: handledPercentage,
			fill: "var(--color-red)",
		}
	]
	return (
		<ResponsiveContainer
			width="100%"
			height="100%"
			className="aspect-square max-h-[250px]"
		>
			<RadialBarChart
				data={chartData}
				startAngle={0}
				endAngle={porcentageAngle}
				innerRadius={77}
				outerRadius={98}
			>
				<defs>
					<filter id="glow">
						<feGaussianBlur stdDeviation="4" result="coloredBlur" />
						<feMerge>
							<feMergeNode in="coloredBlur" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>
				<PolarGrid
					gridType="circle"
					radialLines={false}
					stroke="none"
					className="first:fill-[#3C4254] last:fill-cuartenary-gray"
					style={{ filter: 'url(#glow)' }}
					polarRadius={[80, 73]}
				/>
				<RadialBar
					dataKey="porcentage"
					className="fill-cuartenary-gray"
					cornerRadius={10}
					style={{ filter: 'url(#glow)' }}
				/>
				<PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
					<Label
						content={({ viewBox }) => {
							if (viewBox && "cx" in viewBox && "cy" in viewBox) {
								return (
									<text
										x={viewBox.cx}
										y={viewBox.cy}
										textAnchor="middle"
										dominantBaseline="middle"
									>
										<tspan
											x={viewBox.cx}
											y={(viewBox.cy || 0) - 2}
											className="fill-white text-4xl font-bold"
										>
											{handledPercentage}%
										</tspan>
										<tspan
											x={viewBox.cx}
											y={(viewBox.cy || 0) + 32}
											className="fill-white text-p"
										>
											Completude
										</tspan>
									</text>
								)
							}
						}}
					/>
				</PolarRadiusAxis>
			</RadialBarChart>
		</ResponsiveContainer>
	)
}
