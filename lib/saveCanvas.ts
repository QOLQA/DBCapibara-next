import type { Query, VersionBackend } from "@/app/models/[diagramId]/canva/types";
import type { Edge, Node } from "@xyflow/react";
import type { TableData } from "@/app/models/[diagramId]/canva/types";
import { loadCanva } from "./loadCanva";
import { api } from "./api";
import { transformVersionToBackend } from "./canvaConversion";
import { useCanvasStore } from "@/state/canvaStore";

// Cache para evitar guardados innecesarios
let lastSavedHash: Map<string, string> = new Map();

/**
 * Genera un hash rápido usando solo IDs y propiedades clave
 * En lugar de JSON.stringify completo que es lento
 */
function generateQuickHash(data: any): string {
	let hash = 0;
	const str = typeof data === 'string' ? data : JSON.stringify(data);
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash.toString(36);
}

/**
 * Genera un hash de los nodos sin incluir posiciones (x, y)
 * Optimizado para velocidad
 */
function generateNodeHashWithoutPosition(nodes: Node<TableData>[]): string {
	// Solo usar propiedades clave para el hash
	const simplified = nodes.map(node => ({
		i: node.id, // id
		t: node.type, // type
		l: node.data.label, // label
		c: node.data.columns?.length || 0, // cantidad de columnas
		n: node.data.nestedTables?.length || 0, // cantidad de nested tables
	}));
	return generateQuickHash(simplified);
}

/**
 * Genera un hash simple para edges
 */
function generateEdgeHash(edges: Edge[]): string {
	// Solo IDs y conexiones
	const simplified = edges.map(e => `${e.source}->${e.target}`);
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
	shouldReload: boolean = true,
) => {
	try {
		let diagramToSave = diagram;
		const versionKey = `${diagramId}-${versionId}`;

		// Si no se proporciona diagram, obtener datos del store y construirlo
		if (!diagramToSave) {
			const { versions, nodes, edges } = useCanvasStore.getState();

			// Generar hash de los datos actuales
			const currentHash = generateVersionHash(nodes, edges);

			// Verificar si ya se guardó esta versión exacta
			if (lastSavedHash.get(versionKey) === currentHash) {
				console.log("No hay cambios para guardar, omitiendo guardado");
				return; // No hay cambios, omitir guardado
			}

			// Actualizar la versión actual en el array versions con los datos actuales
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

			// Obtener la versión actualizada
			const versionActual = updatedVersions.find(
				(version) => version._id === versionId,
			);

			if (versionActual) {
				diagramToSave = transformVersionToBackend(
					versionActual,
					nodes,
					edges,
				);

				// Actualizar el estado global con las versiones actualizadas
				useCanvasStore.getState().setVersions(updatedVersions);
			}

			// Guardar el hash después de construir el diagram
			lastSavedHash.set(versionKey, currentHash);
		}

		if (!diagramToSave) {
			throw new Error("No diagram data to save");
		}

		await api.patch(`/solutions/${diagramId}/versions/${versionId}`, diagramToSave);

		// Solo recargar si se especifica (por defecto true para mantener compatibilidad)
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
	// Solo guardar si src_img no está vacío
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
}

/**
 * Limpia el cache de hashes (útil cuando se recarga desde el servidor)
 */
export const clearSaveCache = (diagramId?: string, versionId?: string) => {
	if (diagramId && versionId) {
		const versionKey = `${diagramId}-${versionId}`;
		lastSavedHash.delete(versionKey);
	} else {
		lastSavedHash.clear();
	}
};
