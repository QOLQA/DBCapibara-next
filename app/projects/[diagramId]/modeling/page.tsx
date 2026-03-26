import { getDiagramData, ModelingPage } from "@fsd/pages/modeling";

export default async function DiagramPage({
	params,
}: {
	params: Promise<{ diagramId: string }>;
}) {
	const { diagramId } = await params;
	const loaderData = await getDiagramData(diagramId);

	return <ModelingPage loaderData={loaderData} />;
}
