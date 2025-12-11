import type { Query, VersionBackend } from "@/app/models/[diagramId]/canva/types";
import { loadCanva } from "./loadCanva";
import { api } from "./api";

export const saveCanvas = async (
	diagramId: string,
	versionId: string,
	diagram: VersionBackend,
) => {
	try {
		await api.patch(`/solutions/${diagramId}/versions/${versionId}`, diagram);
		loadCanva(diagramId, versionId);
	} catch (error) {
		console.error("Error saving canvas:", error);
		throw new Error("Failed to save canvas");
	}
};

export const saveSolution = async (diagramId: string, queries: Query[], src_img: string) => {
	try {
		await api.patch(`/solutions/${diagramId}`, { queries, src_img });
	} catch (error) {
		console.error("Error saving solution:", error);
		throw new Error("Failed to save solution");
	}
}
