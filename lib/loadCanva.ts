import { useCanvasStore } from "@/state/canvaStore";
import { transformSolutionModel } from "./solutionConversion";
import type { VersionFrontend } from "@/app/models/[diagramId]/canva/types";

const backendUrl = "http://localhost:8000";

export async function loadCanva(diagramId: string, versionId: string) {
	const url = `${backendUrl}/solutions/${diagramId}`;

	const response = await fetch(url, { method: "GET" });
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.detail);
	}

	const transformed = transformSolutionModel(data);

	const { setNodes, setEdges, setQueries, setVersions } =
		useCanvasStore.getState();

	const indexVersion = transformed.versions.findIndex(
		(version: VersionFrontend) => versionId === version._id,
	);

	setNodes(transformed.versions[indexVersion].nodes);
	setEdges(transformed.versions[indexVersion].edges);
	setQueries(transformed.queries);
	setVersions(transformed.versions);
}
