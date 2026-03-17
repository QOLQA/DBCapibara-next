import { useCanvasStore } from "@fsd/features/solution-modeling";
import { transformSolutionModel } from "@fsd/shared/lib/conversions";
import type { SolutionModel, VersionFrontend } from "@fsd/entities/solution";
import { api } from "@/lib/api/client";

export async function loadCanva(diagramId: string, versionId: string) {
	try {
		const data = await api.get(`/solutions/${diagramId}`);
		const transformed = transformSolutionModel(data as SolutionModel);

		const { setNodes, setEdges, setVersions, setSelectedVersionId } =
			useCanvasStore.getState();

		const indexVersion = transformed.versions.findIndex(
			(version: VersionFrontend) => versionId === version._id
		);

		if (indexVersion === -1) {
			throw new Error(`Version ${versionId} not found`);
		}

		setNodes(transformed.versions[indexVersion].nodes);
		setEdges(transformed.versions[indexVersion].edges);
		setVersions(transformed.versions);
		setSelectedVersionId(versionId);
	} catch (error) {
		console.error("Error loading canvas:", error);
		throw error;
	}
}
