import type { Query, VersionBackend } from "@/app/models/[diagramId]/canva/types";
import { loadCanva } from "./loadCanva";

const backendUrl = "http://localhost:8000";

export const saveCanvas = async (
	diagramId: string,
	versionId: string,
	diagram: VersionBackend,
) => {
	const versionJson = JSON.stringify(diagram, null, 2);

	const versionEndpoint = `${backendUrl}/solutions/${diagramId}/versions/${versionId}`;

	try {
		await fetch(versionEndpoint, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: versionJson,
		});
	} catch (error) {
		console.error("Error saving canvas:", error);
		throw new Error("Failed to save canvas");
	}

	loadCanva(diagramId, versionId);
};

export const saveSolution = async (diagramId: string, queries: Query[], src_img: string) => {
	const solutionJson = JSON.stringify({ queries, src_img }, null, 2)
	const solutionEndpoint = `${backendUrl}/solutions/${diagramId}`;

	try {
		await fetch(solutionEndpoint, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: solutionJson,
		});
	} catch (error) {
		console.error("Error saving canvas:", error);
		throw new Error("Failed to save canvas");
	}
}
