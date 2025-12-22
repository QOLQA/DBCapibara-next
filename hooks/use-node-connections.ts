import { useCallback } from "react";
import type { Edge, Connection, Node, EdgeChange } from "@xyflow/react";
import type { TableData } from "@/app/models/[diagramId]/canva/types";
import { useCanvasStore } from "@/state/canvaStore";

export const existsConnection = (
	sourceTable: TableData,
	targetTable: TableData
) => {
	const sourceColumns = sourceTable.columns.map((col) => col.name);
	const targetColumns = targetTable.columns.map((col) => col.name);

	return (
		sourceColumns.some((col) => col.includes(targetTable.label)) ||
		targetColumns.some((col) => col.includes(sourceTable.label))
	);
};

export const getNextAvailableSubmodelIndex = (nodes: Node<TableData>[]) => {
	if (!nodes || nodes.length === 0) return 0;

	const existingIndices = nodes.map((node) => node.data.submodelIndex ?? 0);
	const maxIndex =
		existingIndices.length > 0 ? Math.max(...existingIndices) : -1;
	return maxIndex + 1;
};

// Update nested tables of the target node
export const updateNestedSubmodelIndex = (
	sourceSubmodelIndex: number,
	tables: TableData[] | undefined
): TableData[] | undefined => {
	return tables?.map((table) => ({
		...table,
		submodelIndex: sourceSubmodelIndex,
		nestedTables: updateNestedSubmodelIndex(
			sourceSubmodelIndex,
			table.nestedTables
		),
	}));
};

export const updateSubmodelIndexInTable = (
	sourceSubmodelIndex: number,
	node: Node<TableData>
): Node<TableData> => {
	return {
		...node,
		data: {
			...node.data,
			submodelIndex: sourceSubmodelIndex,
			nestedTables: node.data.nestedTables?.map((table) => {
				return {
					...table,
					submodelIndex: sourceSubmodelIndex,
					nestedTables: updateNestedSubmodelIndex(
						sourceSubmodelIndex,
						table.nestedTables
					),
				};
			}),
		},
	};
};

type AdjacencyList = Record<string, string[]>;

export const buildGraph = (edges: Edge[]) => {
	const graph: AdjacencyList = {};

	for (const edge of edges) {
		if (!graph[edge.source]) graph[edge.source] = [];
		if (!graph[edge.target]) graph[edge.target] = [];

		graph[edge.source].push(edge.target);
		graph[edge.target].push(edge.source);
	}

	return graph;
};

export const updateSubmodelIndexInNodes = async (
	nodes: Node<TableData>[],
	submodelIndex: number,
	graph: AdjacencyList,
	startNodeId: string,
	editNode: (nodeId: string, newNode: Node<TableData>) => void
) => {
	const visited: Set<string> = new Set();
	const queue: string[] = [startNodeId];
	visited.add(startNodeId);

	const node = nodes.find((node) => node.id === startNodeId);
	if (node) {
		let updatedNode = structuredClone(node);
		updatedNode = updateSubmodelIndexInTable(submodelIndex, updatedNode);
		await editNode(startNodeId, updatedNode);
	}

	while (queue.length > 0) {
		const currentNodeId = queue.shift();
		if (!currentNodeId) continue;

		const neighborNodeIds = graph[currentNodeId] || [];
		for (const neighborNodeId of neighborNodeIds) {
			if (!visited.has(neighborNodeId)) {
				visited.add(neighborNodeId);
				queue.push(neighborNodeId);

				const node = nodes.find((node) => node.id === neighborNodeId);
				if (node) {
					let updatedNode = structuredClone(node);
					updatedNode = updateSubmodelIndexInTable(submodelIndex, updatedNode);
					await editNode(neighborNodeId, updatedNode);
				}
			}
		}
	}
};

interface UseTableConnectionsProps {
	nodes: Node<TableData>[];
	edges: Edge[];
	editNode: (nodeId: string, newNode: Node<TableData>) => void;
	addEdge: (edge: Edge) => void;
	setEdges: (edges: Edge[]) => void;
	onError?: () => void;
}

export const useTableConnections = ({
	nodes,
	edges,
	editNode,
	addEdge,
	setEdges,
	onError,
}: UseTableConnectionsProps) => {
	// Handle connection creation
	const handleConnect = useCallback(
		(params: Connection) => {
			const sourceNode = nodes.find(
				(node) => node.id === params.source
			) as Node<TableData>;
			const targetNode = nodes.find(
				(node) => node.id === params.target
			) as Node<TableData>;

			if (!sourceNode || !targetNode) return;

			if (!existsConnection(sourceNode.data, targetNode.data)) {
				const sourceSubmodelIndex = sourceNode.data.submodelIndex;
				const targetSubmodelIndex = targetNode.data.submodelIndex;

				// Update the target node with foreign key
				let updatedTargetNode = structuredClone(targetNode);
				updatedTargetNode.data.columns.push({
					id: `e-${updatedTargetNode.id}-${sourceNode.id}`,
					name: `${sourceNode.data.label}_id`,
					type: "FOREIGN_KEY",
				});

				// Update all nodes that share the same submodelIndex as the target
				// to adopt the source's submodelIndex (merge submodels)
				nodes.forEach((node) => {
					if (
						node.id !== targetNode.id &&
						node.data.submodelIndex === targetSubmodelIndex
					) {
						let updatedNode = structuredClone(node);

						updatedNode = updateSubmodelIndexInTable(
							sourceSubmodelIndex ?? 0,
							updatedNode
						);
						editNode(node.id, updatedNode);
					}
				});

				updatedTargetNode = updateSubmodelIndexInTable(
					sourceSubmodelIndex ?? 0,
					updatedTargetNode
				);
				editNode(targetNode.id, updatedTargetNode);

				// Crear la arista
				const newEdge: Edge = {
					id: `e-${sourceNode.id}-${targetNode.id}`,
					source: sourceNode.id,
					target: targetNode.id,
				};

				addEdge(newEdge);
			} else {
				onError?.();
			}
		},
		[addEdge, nodes, editNode, onError]
	);

	// Handle connection deletion
	const handleDisconnect = useCallback(
		async (edgeId: string, nodes: Node<TableData>[]) => {
			const edge = edges.find((e) => e.id === edgeId);
			if (!edge) return;

			const sourceNode = nodes.find(
				(node) => node.id === edge.source
			) as Node<TableData>;
			const targetNode = nodes.find(
				(node) => node.id === edge.target
			) as Node<TableData>;

			// Calcular edges filtrados localmente
			const filteredEdges = edges.filter((e) => e.id !== edgeId);
			setEdges(filteredEdges);

			if (!sourceNode || !targetNode) return;

			// Eliminar la foreign key del nodo target
			const updatedTargetNode = structuredClone(targetNode);
			updatedTargetNode.data.columns = updatedTargetNode.data.columns.filter(
				(col) => col.id !== `e-${targetNode.id}-${sourceNode.id}`
			);
			console.log("targetNode antes de editar: ", targetNode);
			console.log("updatedTargetNode despues de editar: ", updatedTargetNode);

			editNode(targetNode.id, updatedTargetNode);

			const updatedNodes = nodes.map((node) =>
				node.id === targetNode.id ? updatedTargetNode : node
			);

			const submodelIndex = getNextAvailableSubmodelIndex(updatedNodes);
			console.log("submodelIndex: ", submodelIndex);
			const graph = buildGraph(filteredEdges);
			console.log("graph: ", graph);
			updateSubmodelIndexInNodes(
				updatedNodes,
				submodelIndex,
				graph,
				targetNode.id,
				editNode
			);

			console.log("nodes en useTableConnections: ", nodes);
		},
		[edges, nodes, editNode]
	);

	return { handleConnect, handleDisconnect };
};
