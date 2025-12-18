import { LayoutComparison } from "./LayoutComparison";
import ComparisonDiagram from "./components/comparisonDiagram/ComparisonDiagram";

const ComparisonView = ({ loaderData }: { loaderData: any }) => {
	return (
		<LayoutComparison title={loaderData.name}>
			<ComparisonDiagram />
		</LayoutComparison>
	);
};

export default ComparisonView;
