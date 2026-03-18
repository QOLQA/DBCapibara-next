import { useCallback } from "react";
import type { Edge, Connection, Node } from "@xyflow/react";
import type { TableData } from "@fsd/entities/solution";

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

				const node = nodes.find((n) => n.id === neighborNodeId);
				if (node) {
					let updatedNode = structuredClone(node);
					updatedNode = updateSubmodelIndexInTable(
						submodelIndex,
						updatedNode
					);
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

				let updatedSourceNode = structuredClone(sourceNode);
				updatedSourceNode.data.columns.push({
					id: `e-${updatedSourceNode.id}-${targetNode.id}`,
					name: `${targetNode.data.label}_id`,
					type: "FOREIGN_KEY",
				});

				nodes.forEach((node) => {
					if (
						node.id !== sourceNode.id &&
						node.data.submodelIndex === sourceSubmodelIndex
					) {
						let updatedNode = structuredClone(node);
						updatedNode = updateSubmodelIndexInTable(
							targetSubmodelIndex ?? 0,
							updatedNode
						);
						editNode(node.id, updatedNode);
					}
				});

				updatedSourceNode = updateSubmodelIndexInTable(
					targetSubmodelIndex ?? 0,
					updatedSourceNode
				);
				editNode(sourceNode.id, updatedSourceNode);

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

	const handleDisconnect = useCallback(
		async (edgeId: string, currentNodes: Node<TableData>[]) => {
			const edge = edges.find((e) => e.id === edgeId);
			if (!edge) return;

			const sourceNode = currentNodes.find(
				(node) => node.id === edge.source
			) as Node<TableData>;
			const targetNode = currentNodes.find(
				(node) => node.id === edge.target
			) as Node<TableData>;

			const filteredEdges = edges.filter((e) => e.id !== edgeId);
			setEdges(filteredEdges);

			if (!sourceNode || !targetNode) return;

			const updatedSourceNode = structuredClone(sourceNode);
			updatedSourceNode.data.columns = updatedSourceNode.data.columns.filter(
				(col) => col.id !== `e-${sourceNode.id}-${targetNode.id}`
			);

			editNode(sourceNode.id, updatedSourceNode);

			const updatedNodes = currentNodes.map((node) =>
				node.id === sourceNode.id ? updatedSourceNode : node
			);

			const submodelIndex = getNextAvailableSubmodelIndex(updatedNodes);
			const graph = buildGraph(filteredEdges);
			updateSubmodelIndexInNodes(
				updatedNodes,
				submodelIndex,
				graph,
				sourceNode.id,
				editNode
			);
		},
		[edges, editNode, setEdges]
	);

	const handleNodeRemove = useCallback(
		async (nodeId: string, currentNodes: Node<TableData>[]) => {
			const nodeToRemove = currentNodes.find((node) => node.id === nodeId);
			if (!nodeToRemove) return;

			const connectedEdges = edges.filter(
				(edge) => edge.source === nodeId || edge.target === nodeId
			);

			const filteredEdges = edges.filter(
				(edge) => edge.source !== nodeId && edge.target !== nodeId
			);
			setEdges(filteredEdges);

			for (const edge of connectedEdges) {
				const otherNodeId = edge.source === nodeId ? edge.target : edge.source;
				const otherNode = currentNodes.find((node) => node.id === otherNodeId);

				if (otherNode) {
					const updatedNode = structuredClone(otherNode);
					updatedNode.data.columns = updatedNode.data.columns.filter(
						(col) => col.id !== `e-${otherNode.id}-${nodeId}`
					);

					editNode(otherNode.id, updatedNode);
				}
			}

			const remainingNodes = currentNodes.filter((node) => node.id !== nodeId);
			const updatedNodes = remainingNodes.map((node) => {
				const updatedNode = structuredClone(node);
				updatedNode.data.columns = updatedNode.data.columns.filter(
					(col) => !col.id.includes(`-${nodeId}`)
				);
				return updatedNode;
			});

			const graph = buildGraph(filteredEdges);

			if (updatedNodes.length > 0) {
				const nodesToUpdate = updatedNodes.filter((node) => {
					return connectedEdges.some(
						(edge) => edge.source === node.id || edge.target === node.id
					);
				});

				let submodelIndex = getNextAvailableSubmodelIndex(updatedNodes) - 1;
				for (const node of nodesToUpdate) {
					await updateSubmodelIndexInNodes(
						updatedNodes,
						submodelIndex,
						graph,
						node.id,
						editNode
					);
					submodelIndex = submodelIndex + 1;
				}
			}
		},
		[edges, editNode, setEdges]
	);

	return { handleConnect, handleDisconnect, handleNodeRemove };
};
