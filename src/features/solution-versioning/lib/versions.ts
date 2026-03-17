import { api } from "@fsd/shared/api";
import { transformVersionToBackend } from "@fsd/entities/solution/lib/conversions";
import { useCanvasStore } from "@fsd/features/solution-modeling";
import type {
	NestedNode,
	NodeBackend,
	TableData,
	VersionBackend,
	VersionFrontend,
} from "@fsd/entities/solution";
import type { Node } from "@xyflow/react";

/**
 * Transforms a VersionBackend to VersionFrontend format
 */
function transformVersionBackendToFrontend(
	version: VersionBackend
): VersionFrontend {
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

export async function createEmptyVersion(
	solutionId: string,
	description: string
): Promise<VersionFrontend> {
	try {
		const versionData: VersionBackend = {
			submodels: [],
			description: description,
			solution_id: solutionId,
			_id: "",
		};

		const createdVersion = await api.post<VersionBackend>(
			`/solutions/${solutionId}/versions`,
			versionData
		);

		const transformedVersion =
			transformVersionBackendToFrontend(createdVersion);

		const {
			versions,
			setVersions,
			setNodes,
			setEdges,
			setSelectedVersionId,
		} = useCanvasStore.getState();
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

export async function duplicateVersion(
	solutionId: string,
	versionId: string
): Promise<VersionFrontend> {
	try {
		const { versions } = useCanvasStore.getState();

		const currentVersion = versions.find((v) => v._id === versionId);
		if (!currentVersion) {
			throw new Error("Current version not found");
		}

		const versionBackend = transformVersionToBackend(
			currentVersion,
			currentVersion.nodes,
			currentVersion.edges
		);

		const duplicateDescription = generateDuplicateDescription(
			currentVersion.description,
			versions
		);

		const versionData: VersionBackend = {
			submodels: versionBackend.submodels,
			description: duplicateDescription,
			solution_id: solutionId,
			_id: "",
		};

		const createdVersion = await api.post<VersionBackend>(
			`/solutions/${solutionId}/versions`,
			versionData
		);

		const transformedVersion =
			transformVersionBackendToFrontend(createdVersion);

		const {
			versions: currentVersions,
			setVersions,
			setNodes,
			setEdges,
			setSelectedVersionId,
		} = useCanvasStore.getState();
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

export async function updateVersionDescription(
	solutionId: string,
	versionId: string,
	newDescription: string
): Promise<VersionFrontend> {
	try {
		const updatedVersion = await api.patch<VersionBackend>(
			`/solutions/${solutionId}/versions/${versionId}`,
			{ description: newDescription }
		);

		const transformedVersion =
			transformVersionBackendToFrontend(updatedVersion);

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

function generateDuplicateDescription(
	originalDescription: string,
	existingVersions: VersionFrontend[]
): string {
	const baseDescription = originalDescription
		.replace(/\s*\(copia\s*\d*\)\s*$/i, "")
		.trim();

	const copyCount = existingVersions.filter((v) =>
		v.description.toLowerCase().startsWith(baseDescription.toLowerCase())
	).length;

	if (copyCount === 0) {
		return `${baseDescription} (copia)`;
	}

	return `${baseDescription} (copia ${copyCount})`;
}

export function generateEmptyVersionDescription(
	existingVersions: VersionFrontend[]
): string {
	const versionNumber = existingVersions.length + 1;
	return `Versión ${versionNumber}`;
}
