import { ComparisonPage, getComparisonData } from "@fsd/pages/comparison";

export default async function ComparisonRoute({
	params,
}: {
	params: Promise<{ diagramId: string }>;
}) {
	const { diagramId } = await params;
	const loaderData = await getComparisonData(diagramId);
	return <ComparisonPage loaderData={loaderData} />;
}
