import type { Edge, Node } from "@xyflow/react";
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

	const node = nodes.find((currentNode) => currentNode.id === startNodeId);
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
