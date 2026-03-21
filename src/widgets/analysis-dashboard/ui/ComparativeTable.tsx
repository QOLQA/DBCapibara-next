"use client";

import type {
	CompletudeChartRow,
	MetricChartRow,
} from "@fsd/features/analysis";
import { useSchemaMetricsSelection } from "@fsd/features/analysis";

interface ComparativeTableProps {
	metricsChartData: MetricChartRow[];
	completudeChartData: CompletudeChartRow[];
	onSelectionChange?: (selectedSchemas: string[]) => void;
}

export function ComparativeTable({
	metricsChartData,
	completudeChartData,
	onSelectionChange,
}: ComparativeTableProps) {
	const { allSelected, handleSelectAll, handleToggleSchema, selectedSchemas } =
		useSchemaMetricsSelection(metricsChartData, onSelectionChange);

	return (
		<div className="flex flex-col w-[70%] h-auto border border-gray rounded-2xl p-6 gap-6 my-16">
			<div className="w-full flex flex-row items-center">
				<div
					className="w-[10%] flex justify-center items-center text-white cursor-pointer"
					onClick={() => handleSelectAll(!allSelected)}
				>
					<div
						className={`size-5 border rounded-md transition-colors ${
							allSelected
								? "border-white bg-white"
								: "border-white bg-transparent"
						}`}
					>
						{allSelected && (
							<svg
								className="w-full h-full text-gray"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={3}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						)}
					</div>
				</div>
				<div className="w-[30%] flex justify-start items-center">
					<h3 className="text-[20px] font-bold ">Solution name</h3>
				</div>
				<div className="w-[15%] flex justify-center items-center">
					<h3 className="text-[20px] font-bold ">Access Pattern</h3>
				</div>
				<div className="w-[15%] flex justify-center items-center">
					<h3 className="text-[20px] font-bold">Recovery Cost</h3>
				</div>
				<div className="w-[15%] flex justify-center items-center">
					<h3 className="text-[20px] font-bold ">Redundancy</h3>
				</div>
				<div className="w-[15%] flex justify-center items-center">
					<h3 className="text-[20px] font-bold">Completude</h3>
				</div>
			</div>
			<div className="w-full h-[2px] bg-gray"></div>
			{metricsChartData.map((metric) => {
				const isSelected = selectedSchemas.has(metric.schema);
				return (
					<div
						key={metric.schema}
						className="w-full flex flex-row items-center "
					>
						<div
							className="w-[10%] flex justify-center items-center cursor-pointer"
							onClick={() => handleToggleSchema(metric.schema)}
						>
							<div
								className={`size-5 border rounded-md transition-colors ${
									isSelected
										? "border-secondary-white bg-secondary-white"
										: "border-secondary-white bg-transparent"
								}`}
							>
								{isSelected && (
									<svg
										className="w-full h-full text-gray"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={3}
											d="M5 13l4 4L19 7"
										/>
									</svg>
								)}
							</div>
						</div>
						<div className="w-[30%] flex justify-start items-center">
							<h3 className="text-[20px] font-bold text-secondary-white">
								{metric.schema}
							</h3>
						</div>
						<div className="w-[15%] flex justify-center items-center">
							<div className="w-[90px] h-[32px] flex justify-center items-center bg-[#0052CC]/10 rounded-lg">
								<h3 className="text-[20px] font-bold text-[#0052CC]">
									{metric.access_pattern}
								</h3>
							</div>
						</div>
						<div className="w-[15%] flex justify-center items-center">
							<div className="w-[90px] h-[32px] flex justify-center items-center bg-[#00875A]/10 rounded-lg">
								<h3 className="text-[20px] font-bold text-[#00875A]">
									{metric.recovery_cost}
								</h3>
							</div>
						</div>
						<div className="w-[15%] flex justify-center items-center">
							<div className="w-[90px] h-[32px] flex justify-center items-center bg-[#5243AA]/10 rounded-lg">
								<h3 className="text-[20px] font-bold text-[#5243AA]">
									{metric.redundancy}
								</h3>
							</div>
						</div>
						<div className="w-[15%] flex justify-center items-center">
							<div className="w-[90px] h-[32px] flex justify-center items-center bg-[#E93544]/10 rounded-lg">
								<h3 className="text-[20px] font-bold text-[#E93544]">
									{
										completudeChartData.find(
											(completude) => completude.schema === metric.schema,
										)?.completude
									}
								</h3>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
