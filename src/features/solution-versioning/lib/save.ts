import type { Query, TableData, VersionBackend } from "@fsd/entities/solution";
import type { Edge, Node } from "@xyflow/react";
import { loadCanva } from "./load";
import { api } from "@fsd/shared/api";
import { transformVersionToBackend } from "@fsd/shared/lib/conversions";
import { useCanvasStore } from "@fsd/features/solution-modeling";

// Cache para evitar guardados innecesarios
let lastSavedHash: Map<string, string> = new Map();

/**
 * Genera un hash rápido usando solo IDs y propiedades clave
 */
function generateQuickHash(data: unknown): string {
	let hash = 0;
	const str =
		typeof data === "string" ? data : JSON.stringify(data);
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash.toString(36);
}

/**
 * Genera un hash de los nodos sin incluir posiciones (x, y)
 */
function generateNodeHashWithoutPosition(nodes: Node<TableData>[]): string {
	const simplified = nodes.map((node) => ({
		i: node.id,
		t: node.type,
		l: node.data.label,
		c: node.data.columns?.length || 0,
		n: node.data.nestedTables?.length || 0,
	}));
	return generateQuickHash(simplified);
}

/**
 * Genera un hash simple para edges
 */
function generateEdgeHash(edges: Edge[]): string {
	const simplified = edges.map((e) => `${e.source}->${e.target}`);
	return generateQuickHash(simplified);
}

/**
 * Genera un hash combinado para detectar cambios en la versión
 */
function generateVersionHash(nodes: Node<TableData>[], edges: Edge[]): string {
	return `${generateNodeHashWithoutPosition(nodes)}:${generateEdgeHash(edges)}`;
}

export const saveCanvas = async (
	diagramId: string,
	versionId: string,
	diagram?: VersionBackend,
	shouldReload: boolean = true
) => {
	try {
		let diagramToSave = diagram;
		const versionKey = `${diagramId}-${versionId}`;

		if (!diagramToSave) {
			const { versions, nodes, edges } = useCanvasStore.getState();

			const currentHash = generateVersionHash(nodes, edges);

			if (lastSavedHash.get(versionKey) === currentHash) {
				return;
			}

			const updatedVersions = versions.map((version) => {
				if (version._id === versionId) {
					return {
						...version,
						nodes: nodes,
						edges: edges,
					};
				}
				return version;
			});

			const versionActual = updatedVersions.find(
				(version) => version._id === versionId
			);

			if (versionActual) {
				diagramToSave = transformVersionToBackend(
					versionActual,
					nodes,
					edges
				);

				useCanvasStore.getState().setVersions(updatedVersions);
			}

			lastSavedHash.set(versionKey, currentHash);
		}

		if (!diagramToSave) {
			throw new Error("No diagram data to save");
		}

		await api.patch(
			`/solutions/${diagramId}/versions/${versionId}`,
			diagramToSave
		);

		if (shouldReload) {
			loadCanva(diagramId, versionId);
		}
	} catch (error) {
		console.error("Error saving canvas:", error);
		throw new Error("Failed to save canvas");
	}
};

export const saveSolution = async (
	diagramId: string,
	queries: Query[],
	src_img: string
) => {
	if (!src_img) {
		console.warn("src_img is empty, skipping solution image update");
		return;
	}

	try {
		await api.patch(`/solutions/${diagramId}`, { queries, src_img });
	} catch (error) {
		console.error("Error saving solution:", error);
		throw new Error("Failed to save solution");
	}
};

export const clearSaveCache = (diagramId?: string, versionId?: string) => {
	if (diagramId && versionId) {
		const versionKey = `${diagramId}-${versionId}`;
		lastSavedHash.delete(versionKey);
	} else {
		lastSavedHash.clear();
	}
};
