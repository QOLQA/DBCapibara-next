import { LayoutAnalysis } from "./LayoutAnalysis";
import AppStatistics from "./components/Statistics/AppStatistics";
import { DiagramSessionHydrator } from "@fsd/features/solution-modeling";

const AnalysisView = ({ loaderData }: { loaderData: any }) => {
	return (
		<LayoutAnalysis title={loaderData.name}>
			<DiagramSessionHydrator
				loaderData={{
					solutionId: loaderData.solutionId,
					versions: loaderData.versions,
					last_version_saved: loaderData.last_version_saved,
				}}
			/>
			<AppStatistics />
		</LayoutAnalysis>
	);
};

export default AnalysisView;
