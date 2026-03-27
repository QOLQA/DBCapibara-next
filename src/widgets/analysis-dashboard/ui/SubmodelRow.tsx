import { getSubmodelColor } from "@fsd/shared/lib/xyflow/colors";
import type { MetricChartRow } from "@fsd/features/analysis";

interface SubmodelRowProps {
	metric: MetricChartRow;
	completude?: number;
}

export function SubmodelRow({ metric, completude }: SubmodelRowProps) {
	const color =
		metric.submodelIndex !== undefined
			? getSubmodelColor(metric.submodelIndex)
			: undefined;
	const metricsTotal =
		metric.access_pattern + metric.recovery_cost + metric.redundancy;

	return (
		<div className="w-full flex flex-col gap-4 ">
			<div className="w-full flex flex-row items-center">
				<div className="w-[10%] flex justify-center items-center gap-3"></div>
				<div className="w-[30%] flex justify-start items-center gap-2">
					{color && (
						<div
							className="size-3 rounded-full"
							style={{ backgroundColor: color }}
						/>
					)}
					<h3
						className="text-[20px] font-bold"
						style={color ? { color } : undefined}
					>
						{metric.schema}
					</h3>
				</div>
				<div className="w-[12%] flex justify-center items-center">
					<div className="w-[70px] h-[26px] flex justify-center items-center bg-[#0052CC]/10 rounded-lg">
						<h3 className="text-[16px] font-bold text-[#0052CC]">
							{metric.access_pattern}
						</h3>
					</div>
				</div>
				<div className="w-[12%] flex justify-center items-center">
					<div className="w-[70px] h-[26px] flex justify-center items-center bg-[#00875A]/10 rounded-lg">
						<h3 className="text-[16px] font-bold text-[#00875A]">
							{metric.recovery_cost}
						</h3>
					</div>
				</div>
				<div className="w-[12%] flex justify-center items-center">
					<div className="w-[70px] h-[26px] flex justify-center items-center bg-[#5243AA]/10 rounded-lg">
						<h3 className="text-[16px] font-bold text-[#5243AA]">
							{metric.redundancy}
						</h3>
					</div>
				</div>
				<div className="w-[12%] flex justify-center items-center">
					<div className="w-[70px] h-[26px] flex justify-center items-center bg-secondary-gray/80 rounded-lg border border-none">
						<h3 className="text-[16px] font-bold text-secondary-white">
							{parseFloat(metricsTotal.toFixed(2))}
						</h3>
					</div>
				</div>
				<div className="w-[12%] flex justify-center items-center">
					{/* <div className="w-[70px] h-[26px] flex justify-center items-center bg-[#E93544]/10 rounded-lg">
						<h3 className="text-[16px] font-bold text-[#E93544]">
							{completude}
						</h3>
					</div> */}
				</div>
			</div>
		</div>
	);
}
