import { LayoutComparison } from "./LayoutComparison";
import ComparisonDiagram from "./components/comparisonDiagram/ComparisonDiagram";
import { DiagramSessionHydrator } from "@fsd/features/solution-modeling";

const ComparisonView = ({ loaderData }: { loaderData: any }) => {
	return (
		<LayoutComparison title={loaderData.name}>
			<DiagramSessionHydrator
				loaderData={{
					solutionId: loaderData.solutionId,
					versions: loaderData.versions,
					last_version_saved: loaderData.last_version_saved,
				}}
			/>
			<ComparisonDiagram />
		</LayoutComparison>
	);
};

export default ComparisonView;
