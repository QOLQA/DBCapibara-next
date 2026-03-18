import { getDiagramData } from "@fsd/pages/canva";
import { CanvasPage } from "@fsd/pages/canva";

export default async function DiagramPage({
	params,
}: {
	params: Promise<{ diagramId: string }>;
}) {
	const { diagramId } = await params;
	const loaderData = await getDiagramData(diagramId);

	return <CanvasPage loaderData={loaderData} />;
}
