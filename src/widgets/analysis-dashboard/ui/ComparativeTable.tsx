"use client";

import type {
	CompletudeChartRow,
	MetricChartRow,
} from "@fsd/features/analysis";
import { useSchemaMetricsSelection } from "@fsd/features/analysis";
import { ComparativeTableRow } from "./ComparativeTableRow";

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
				<div className="w-[10%] flex justify-center items-center text-white gap-3">
					<div className="w-5" />
					<div
						className={`size-5 border rounded-md transition-colors cursor-pointer ${
							allSelected
								? "border-white bg-white"
								: "border-white bg-transparent"
						}`}
						onClick={() => handleSelectAll(!allSelected)}
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
				<div className="w-[12%] flex justify-center items-center">
					<h3 className="text-[20px] font-bold ">Access Pattern</h3>
				</div>
				<div className="w-[12%] flex justify-center items-center">
					<h3 className="text-[20px] font-bold">Recovery Cost</h3>
				</div>
				<div className="w-[12%] flex justify-center items-center">
					<h3 className="text-[20px] font-bold ">Redundancy</h3>
				</div>
				<div className="w-[12%] flex justify-center items-center">
					<h3 className="px-6 py-1 text-[20px] font-bold bg-cuartenary-gray/80 rounded-lg border border-none text-white">
						Total
					</h3>
				</div>
				<div className="w-[12%] flex justify-center items-center">
					<h3 className="text-[20px] font-bold">Completude</h3>
				</div>
			</div>
			<div className="w-full h-[2px] bg-gray"></div>
			{metricsChartData.map((metric) => (
				<ComparativeTableRow
					key={metric.schema}
					metric={metric}
					completudeRow={completudeChartData.find(
						(c) => c.schema === metric.schema,
					)}
					isSelected={selectedSchemas.has(metric.schema)}
					onToggleSelection={() => handleToggleSchema(metric.schema)}
				/>
			))}
		</div>
	);
}
