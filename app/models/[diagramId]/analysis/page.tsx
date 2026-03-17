import { AnalysisPage, getAnalysisData } from "@fsd/pages/analysis";

export default async function AnalysisRoute({
	params,
}: {
	params: Promise<{ diagramId: string }>;
}) {
	const { diagramId } = await params;
	const loaderData = await getAnalysisData(diagramId);
	return <AnalysisPage loaderData={loaderData} />;
}
