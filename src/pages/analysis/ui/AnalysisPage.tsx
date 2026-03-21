"use client";

import { useDiagramSessionHydration } from "@fsd/features/solution-modeling";
import {
	AnalysisLayout,
	AnalysisHeader,
	AnalysisDashboard,
} from "@fsd/features/analysis";
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
		<AnalysisLayout
			title={loaderData.name}
			headerSlot={<AnalysisHeader title={loaderData.name} />}
		>
			<AnalysisDashboard />
		</AnalysisLayout>
	);
}
