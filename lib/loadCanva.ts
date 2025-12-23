import { useCanvasStore } from "@/state/canvaStore";
import { transformSolutionModel } from "./solutionConversion";
import type { VersionFrontend, SolutionModel } from "@/app/models/[diagramId]/canva/types";
import { api } from "./api";

export async function loadCanva(diagramId: string, versionId: string) {
	try {
		const data = await api.get(`/solutions/${diagramId}`);
		const transformed = transformSolutionModel(data as SolutionModel);

		const { setNodes, setEdges, setVersions } =
			useCanvasStore.getState();

		const indexVersion = transformed.versions.findIndex(
			(version: VersionFrontend) => versionId === version._id,
		);

		setNodes(transformed.versions[indexVersion].nodes);
		setEdges(transformed.versions[indexVersion].edges);
		setVersions(transformed.versions);
	} catch (error) {
		console.error("Error loading canvas:", error);
		throw error;
	}
}
