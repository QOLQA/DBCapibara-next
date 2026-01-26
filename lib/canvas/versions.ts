import { api } from "../api/client";
import { transformVersionToBackend } from "../conversions/canvas";
import { useCanvasStore } from "@/state/canvaStore";
import type { VersionBackend, VersionFrontend, NodeBackend, NestedNode, TableData } from "@/app/models/[diagramId]/canva/types";
import type { Node } from "@xyflow/react";

/**
 * Transforms a VersionBackend to VersionFrontend format
 * This is the same transformation logic used in solutionConversion.ts
 */
function transformVersionBackendToFrontend(version: VersionBackend): VersionFrontend {
	function mapNode(
		node: NodeBackend | NestedNode,
		submodelIndex: number
	): Node<TableData> {
		const mappedNode: Node<TableData> = {
			id: node.id,
			position: "position" in node ? node.position : { x: 0, y: 0 },
			type: "table",
			data: {
				id: node.id,
				label: node.name,
				columns: node.cols.map((col) => ({
					id: col.id,
					name: col.name,
					type: col.type,
				})),
				nestedTables: mapNestedNode(node.nested_nodes || [], submodelIndex),
				submodelIndex,
			},
		};
		return mappedNode;
	}

	function mapNestedNode(
		nestedNodes: NestedNode[],
		submodelIndex: number
	): TableData[] {
		return nestedNodes.map((nestedNode) => ({
			id: nestedNode.id,
			label: nestedNode.name,
			columns: nestedNode.cols.map((col) => ({
				id: col.id,
				name: col.name,
				type: col.type,
			})),
			nestedTables: mapNestedNode(nestedNode.nested_nodes || [], submodelIndex),
			submodelIndex,
		}));
	}

	return {
		nodes: version.submodels.flatMap((submodel, submodelIndex) =>
			submodel.nodes.map((node) => mapNode(node, submodelIndex))
		),
		edges: version.submodels.flatMap((submodel) => submodel.edges),
		description: version.description,
		solution_id: version.solution_id,
		_id: version._id,
	};
}

/**
 * Creates an empty version for a solution
 * @param solutionId - The ID of the solution
 * @param description - The description for the new version
 * @returns The created version
 */
export async function createEmptyVersion(
	solutionId: string,
	description: string
): Promise<VersionFrontend> {
	try {
		const versionData: VersionBackend = {
			submodels: [],
			description: description,
			solution_id: solutionId,
			_id: "", // Will be set by backend
		}; 

		const createdVersion = await api.post<VersionBackend>(
			`/solutions/${solutionId}/versions`,
			versionData
		);

		// Transform the created version to frontend format
		const transformedVersion = transformVersionBackendToFrontend(createdVersion);

		// Update store: add new version to existing versions array
		const { versions, setVersions, setNodes, setEdges, setSelectedVersionId } = useCanvasStore.getState();
		const updatedVersions = [...versions, transformedVersion];
		
		setVersions(updatedVersions);
		setNodes(transformedVersion.nodes);
		setEdges(transformedVersion.edges);
		setSelectedVersionId(transformedVersion._id);

		return transformedVersion;
	} catch (error) {
		console.error("Error creating empty version:", error);
		throw error;
	}
}

/**
 * Duplicates the current version
 * @param solutionId - The ID of the solution
 * @param versionId - The ID of the version to duplicate
 * @returns The created duplicate version
 */
export async function duplicateVersion(
	solutionId: string,
	versionId: string
): Promise<VersionFrontend> {
	try {
		const { versions } = useCanvasStore.getState();

		// Find the current version
		const currentVersion = versions.find((v) => v._id === versionId);
		if (!currentVersion) {
			throw new Error("Current version not found");
		}

		// Transform current version to backend format using the version's saved nodes and edges
		const versionBackend = transformVersionToBackend(
			currentVersion,
			currentVersion.nodes,
			currentVersion.edges
		);

		// Generate description for duplicate
		const duplicateDescription = generateDuplicateDescription(
			currentVersion.description,
			versions
		);

		// Create new version with duplicated data
		const versionData: VersionBackend = {
			submodels: versionBackend.submodels,
			description: duplicateDescription,
			solution_id: solutionId,
			_id: "", // Will be set by backend
		};

		const createdVersion = await api.post<VersionBackend>(
			`/solutions/${solutionId}/versions`,
			versionData
		);

		// Transform the created version to frontend format
		const transformedVersion = transformVersionBackendToFrontend(createdVersion);

		// Update store: add new version to existing versions array
		const { versions: currentVersions, setVersions, setNodes, setEdges, setSelectedVersionId } = useCanvasStore.getState();
		const updatedVersions = [...currentVersions, transformedVersion];
		
		setVersions(updatedVersions);
		setNodes(transformedVersion.nodes);
		setEdges(transformedVersion.edges);
		setSelectedVersionId(transformedVersion._id);

		return transformedVersion;
	} catch (error) {
		console.error("Error duplicating version:", error);
		throw error;
	}
}

/**
 * Updates the description of a version
 * @param solutionId - The ID of the solution
 * @param versionId - The ID of the version to update
 * @param newDescription - The new description for the version
 * @returns The updated version
 */
export async function updateVersionDescription(
	solutionId: string,
	versionId: string,
	newDescription: string
): Promise<VersionFrontend> {
	try {
		// Update the version description via API
		const updatedVersion = await api.patch<VersionBackend>(
			`/solutions/${solutionId}/versions/${versionId}`,
			{ description: newDescription }
		);

		// Transform the updated version to frontend format
		const transformedVersion = transformVersionBackendToFrontend(updatedVersion);

		// Update store: replace the modified version in the versions array
		const { versions, setVersions } = useCanvasStore.getState();
		const updatedVersions = versions.map((v) =>
			v._id === versionId ? transformedVersion : v
		);
		
		setVersions(updatedVersions);

		return transformedVersion;
	} catch (error) {
		console.error("Error updating version description:", error);
		throw error;
	}
}

/**
 * Generates a description for a duplicated version
 * @param originalDescription - The original version description
 * @param existingVersions - Array of existing versions
 * @returns A new description for the duplicate
 */
function generateDuplicateDescription(
	originalDescription: string,
	existingVersions: VersionFrontend[]
): string {
	// Check if description already contains "(copia)"
	const baseDescription = originalDescription.replace(/\s*\(copia\s*\d*\)\s*$/i, "").trim();
	
	// Count how many copies already exist
	const copyCount = existingVersions.filter((v) =>
		v.description.toLowerCase().startsWith(baseDescription.toLowerCase())
	).length;

	if (copyCount === 0) {
		return `${baseDescription} (copia)`;
	}

	return `${baseDescription} (copia ${copyCount})`;
}

/**
 * Generates a description for a new empty version
 * @param existingVersions - Array of existing versions
 * @returns A new description for the empty version
 */
export function generateEmptyVersionDescription(
	existingVersions: VersionFrontend[]
): string {
	const versionNumber = existingVersions.length + 1;
	return `Versión ${versionNumber}`;
}
