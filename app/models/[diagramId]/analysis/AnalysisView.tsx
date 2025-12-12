import { LayoutAnalysis } from "./LayoutAnalysis";
import AppStatistics from "./components/Statistics/AppStatistics";

const AnalysisView = ({ loaderData }: { loaderData: any }) => {
	return (
		<LayoutAnalysis title={loaderData.name}>
			<AppStatistics />
		</LayoutAnalysis>
	);
};

export default AnalysisView;
