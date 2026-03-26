"use client";

import { useDiagramSessionHydration } from "@fsd/features/modeling-solution";
import { AnalysisDashboard } from "@fsd/widgets/analysis-dashboard";
import { AnalysisHeader } from "@fsd/widgets/analysis-header";
import type { VersionFrontend } from "@fsd/entities/solution";

interface AnalysisPageProps {
	loaderData: {
		name: string;
		solutionId: string;
		versions: VersionFrontend[];
		last_version_saved: string;
	};
}

export function AnalysisPage({ loaderData }: AnalysisPageProps) {
	useDiagramSessionHydration({
		solutionId: loaderData.solutionId,
		versions: loaderData.versions,
		last_version_saved: loaderData.last_version_saved,
	});

	return (
		<div className="flex flex-col h-screen w-screen z-50 overflow-hidden">
			<AnalysisHeader title={loaderData.name} />
			<div className="h-full w-full overflow-hidden bg-secondary-gray px-3 pb-3 ">
				<AnalysisDashboard />
			</div>
		</div>
	);
}
