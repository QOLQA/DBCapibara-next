import { useCallback } from "react";
import type { Node } from "@xyflow/react";
import { getKeySegment } from "@fsd/entities/solution/lib/diagram";
import type { CardinalityType, TableData } from "@fsd/entities/solution";

interface UseUpdateCardinalityParams {
	nodes: Node<TableData>[];
	editNode: (nodeId: string, newNode: Node<TableData>) => void;
}

export const useUpdateCardinality = ({
	nodes,
	editNode,
}: UseUpdateCardinalityParams) => {
	return useCallback(
		(tableId: string, newCardinality: CardinalityType) => {
			const rootId = getKeySegment(tableId, 1);
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

			const recursiveUpdateCardinality = (
				nestedTables: TableData,
				layer: number,
			): TableData => {
				if (layer > 100) {
					return nestedTables;
				}

				if (nestedTables.id === tableId) {
					return {
						...nestedTables,
						cardinality: newCardinality,
					};
				}

				if (nestedTables.nestedTables && nestedTables.nestedTables.length > 0) {
					const updatedNestedTables = nestedTables.nestedTables.map(
						(nestedTable: TableData) => {
							if (nestedTable.id === tableId) {
								return {
									...nestedTable,
									cardinality: newCardinality,
								};
							}
							return recursiveUpdateCardinality(nestedTable, layer + 1);
						},
					);

					return {
						...nestedTables,
						nestedTables: updatedNestedTables,
					};
				}

				return nestedTables;
			};

			editableNode.data = recursiveUpdateCardinality(editableNode.data, 1);
			editNode(rootId as string, editableNode);
		},
		[nodes, editNode],
	);
};
