"use client";

import { DiagramSessionHydrator } from "@fsd/widgets/diagram-session";
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
	return (
		<>
			<DiagramSessionHydrator
				loaderData={{
					solutionId: loaderData.solutionId,
					versions: loaderData.versions,
					last_version_saved: loaderData.last_version_saved,
				}}
			/>
			<AnalysisLayout
				title={loaderData.name}
				headerSlot={<AnalysisHeader title={loaderData.name} />}
			>
				<AnalysisDashboard />
			</AnalysisLayout>
		</>
	);
}
