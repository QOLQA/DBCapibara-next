"use client";

import { useAnalysisChartData } from "@fsd/features/analysis";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ComparativeTable } from "./ComparativeTable";
import { ModelIntrinsicMetrics } from "./ModelIntrinsicMetrics";
import { WorkloadDrivenMetric } from "./WorkloadDrivenMetric";

export function AnalysisDashboard() {
	const router = useRouter();
	const {
		metricsChartData,
		completudeChartData,
		filteredMetricsData,
		filteredCompletudeData,
		setSelectedSchemas,
	} = useAnalysisChartData();

	return (
		<section className="flex flex-col h-full w-full items-center justify-center gap-10 bg-primary-gray rounded-xl p-4">
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
					<ModelIntrinsicMetrics metricsChartData={filteredMetricsData} />
					<WorkloadDrivenMetric completudeChartData={filteredCompletudeData} />
				</div>

				<ComparativeTable
					metricsChartData={metricsChartData}
					completudeChartData={completudeChartData}
					onSelectionChange={setSelectedSchemas}
				/>
			</div>
		</section>
	);
}
