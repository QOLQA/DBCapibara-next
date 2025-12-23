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

			editNode(targetNode.id, updatedTargetNode);

			const updatedNodes = nodes.map((node) =>
				node.id === targetNode.id ? updatedTargetNode : node
			);

			const submodelIndex = getNextAvailableSubmodelIndex(updatedNodes);
			const graph = buildGraph(filteredEdges);
			updateSubmodelIndexInNodes(
				updatedNodes,
				submodelIndex,
				graph,
				targetNode.id,
				editNode
			);
		},
		[edges, nodes, editNode]
	);

	// Handle node deletion
	const handleNodeRemove = useCallback(
		async (nodeId: string, nodes: Node<TableData>[]) => {
			const nodeToRemove = nodes.find((node) => node.id === nodeId);
			if (!nodeToRemove) return;

			// Encontrar todos los edges conectados al nodo que se va a eliminar
			const connectedEdges = edges.filter(
				(edge) => edge.source === nodeId || edge.target === nodeId
			);

			// Eliminar todos los edges conectados
			const filteredEdges = edges.filter(
				(edge) => edge.source !== nodeId && edge.target !== nodeId
			);
			setEdges(filteredEdges);

			// Para cada edge conectado, eliminar las foreign keys de los nodos afectados
			for (const edge of connectedEdges) {
				const otherNodeId = edge.source === nodeId ? edge.target : edge.source;
				const otherNode = nodes.find((node) => node.id === otherNodeId);

				if (otherNode) {
					// Eliminar la foreign key que referencia al nodo eliminado
					const updatedNode = structuredClone(otherNode);
					updatedNode.data.columns = updatedNode.data.columns.filter(
						(col) => col.id !== `e-${otherNode.id}-${nodeId}`
					);

					editNode(otherNode.id, updatedNode);
				}
			}

			// Actualizar submodelIndex de los nodos restantes
			const remainingNodes = nodes.filter((node) => node.id !== nodeId);
			const updatedNodes = remainingNodes.map((node) => {
				// Actualizar las columnas que puedan tener referencias al nodo eliminado
				const updatedNode = structuredClone(node);
				updatedNode.data.columns = updatedNode.data.columns.filter(
					(col) => !col.id.includes(`-${nodeId}`)
				);
				return updatedNode;
			});

			// Recalcular submodelIndex usando el grafo actualizado
			const graph = buildGraph(filteredEdges);

			// Si hay nodos restantes, actualizar sus submodelIndex
			if (updatedNodes.length > 0) {
				// Encontrar nodos que necesitan actualización de submodelIndex
				const nodesToUpdate = updatedNodes.filter((node) => {
					// Si el nodo tenía conexiones con el nodo eliminado, necesita recalcular
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
		[edges, nodes, editNode, setEdges]
	);

	return { handleConnect, handleDisconnect, handleNodeRemove };
};
