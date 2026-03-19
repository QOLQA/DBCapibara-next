import { useCallback } from "react";
import type { Node } from "@xyflow/react";
import { getKeySegment } from "@fsd/entities/solution/lib/diagram";
import type { Column, TableData } from "@fsd/entities/solution";

interface UseDeleteAttributeParams {
	nodes: Node<TableData>[];
	editNode: (nodeId: string, newNode: Node<TableData>) => void;
}

export const useDeleteAttribute = ({
	nodes,
	editNode,
}: UseDeleteAttributeParams) => {
	return useCallback(
		(columnId: string) => {
			const numLayers = columnId.split("-").length;
			const rootId = getKeySegment(columnId, 1);
			const originalNode = nodes.find(
				(node) => node.id === rootId,
			) as Node<TableData>;
			if (!originalNode) return;

			let editableNode: Node<TableData>;
			try {
				editableNode = structuredClone(originalNode);
			} catch (error) {
				console.error("Error cloning node:", error);
				return;
			}

			if (numLayers === 2) {
				editableNode.data.columns = editableNode.data.columns.filter(
					(col: Column) => col.id !== columnId,
				);
				editNode(editableNode.id, editableNode);
				return;
			}

			const recursiveDeleteColumn = (
				nestedTables: TableData,
				layer: number,
			): TableData => {
				if (layer > 100) {
					return nestedTables;
				}

				if (layer === numLayers - 1) {
					nestedTables.columns = nestedTables.columns.filter(
						(col: Column) => col.id !== columnId,
					);
					return nestedTables;
				}

				const nestedTableResultId = getKeySegment(columnId, layer + 1);
				const nestedTableResult = nestedTables.nestedTables?.map(
					(nestedTable: TableData) =>
						nestedTable.id === nestedTableResultId
							? recursiveDeleteColumn(nestedTable, layer + 1)
							: nestedTable,
				) as TableData[];

				return {
					...nestedTables,
					nestedTables: nestedTableResult,
				};
			};

			editableNode.data = recursiveDeleteColumn(editableNode.data, 1);
			editNode(rootId as string, editableNode);
		},
		[nodes, editNode],
	);
};
