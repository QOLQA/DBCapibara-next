import type { Edge, Node } from "@xyflow/react";
import type {
	NodeBackend,
	TableData,
	VersionFrontend,
	VersionBackend,
	NestedNode,
	Submodel,
	EdgeBackend,
	CardinalityType,
} from "@/app/models/[diagramId]/canva/types";

function tableDataToNodeBackend(node: Node<TableData>): NodeBackend {
	const convertNestedTablesToNestedNodes = (
		nestedTables?: TableData[],
	): NestedNode[] => {
		return (nestedTables || []).map((nestedTable) => ({
			id: nestedTable.id,
			name: nestedTable.label,
			cols: nestedTable.columns,
			nested_nodes: convertNestedTablesToNestedNodes(nestedTable.nestedTables),
			cardinality: nestedTable.cardinality,
		}));
	};

	return {
		id: node.id,
		name: node.data.label,
		type: node.type || "table",
		position: node.position,
		cols: node.data.columns,
		nested_nodes: convertNestedTablesToNestedNodes(node.data.nestedTables),
	};
}

/**
 * Transforms a VersionFrontend object into a VersionBackend format.
 *
 * - Groups nodes into connected components using DFS over an undirected graph.
 * - Each connected component is converted into a Submodel.
 * - Nodes are transformed from TableData (frontend) to NodeBackend (backend).
 * - Includes all matching edges within each submodel.
 * - Preserves queries and version metadata.
 */

export function transformVersionToBackend(
	version: VersionFrontend,
	nodes: Node<TableData>[],
	edges: Edge[],
): VersionBackend {
	const nodeMap = new Map<string, Node<TableData>>();
	for (const node of nodes) {
		nodeMap.set(node.id, node);
	}

	// Create undirected graph
	const adjacencyList = new Map<string, Set<string>>();
	for (const node of nodes) {
		adjacencyList.set(node.id, new Set());
	}

	for (const edge of edges) {
		adjacencyList.get(edge.source)?.add(edge.target);
		adjacencyList.get(edge.target)?.add(edge.source);
	}

	// DFS to find connected components
	const visited = new Set<string>();
	const components: string[][] = [];

	function dfs(nodeId: string, currentComponent: string[]) {
		visited.add(nodeId);
		currentComponent.push(nodeId);
		for (const neighbor of adjacencyList.get(nodeId) || []) {
			if (!visited.has(neighbor)) {
				dfs(neighbor, currentComponent);
			}
		}
	}

	for (const nodeId of adjacencyList.keys()) {
		if (!visited.has(nodeId)) {
			const component: string[] = [];
			dfs(nodeId, component);
			components.push(component);
		}
	}

	// Create submodels per component
	const submodels: Submodel[] = components.map((componentNodeIds) => {
		const submodelNodes: NodeBackend[] = componentNodeIds
			.map((id) => nodeMap.get(id))
			.filter((node): node is Node<TableData> => node !== undefined)
			.map((node) => tableDataToNodeBackend(node));

		const submodelEdges: EdgeBackend[] = edges
			.filter(
				(edge) =>
					componentNodeIds.includes(edge.source) &&
					componentNodeIds.includes(edge.target),
			)
			.map((edge) => ({
				id: edge.id,
				source: edge.source,
				target: edge.target,
				cardinality: edge.data?.cardinality as CardinalityType || '1 ... 1',
			}));

		return {
			nodes: submodelNodes,
			edges: submodelEdges,
		};
	});

	return {
		submodels: submodels,
		description: version.description,
		solution_id: version.solution_id,
		_id: version._id,
	};
}
