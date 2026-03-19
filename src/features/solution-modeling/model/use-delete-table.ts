import { useCallback } from "react";
import type { Node } from "@xyflow/react";
import { getKeySegment } from "@fsd/entities/solution/lib/diagram";
import type { TableData } from "@fsd/entities/solution";
import { deleteTableRecursively } from "@fsd/entities/table/lib/table-operations";

interface UseDeleteTableParams {
	nodes: Node<TableData>[];
	editNode: (nodeId: string, newNode: Node<TableData>) => void;
	removeNode: (nodeId: string) => void;
	handleNodeRemove: (nodeId: string, currentNodes: Node<TableData>[]) => void;
}

export const useDeleteTable = ({
	nodes,
	editNode,
	removeNode,
	handleNodeRemove,
}: UseDeleteTableParams) => {
	const handleDeleteTable = useCallback(
		(tableId: string) => {
			const numLayers = tableId.split("-").length;
			const rootId = getKeySegment(tableId, 1);
			const originalNode = nodes.find(
				(node) => node.id === rootId,
			) as Node<TableData>;

			if (!originalNode) return;

			if (numLayers === 1) {
				removeNode(tableId);
				handleNodeRemove(tableId, nodes);
				return;
			}

			let editableNode: Node<TableData>;
			try {
				editableNode = structuredClone(originalNode);
			} catch (error) {
				console.error("Error cloning node:", error);
				return;
			}

			editableNode.data = deleteTableRecursively(
				editableNode.data,
				tableId,
				numLayers,
				1,
			);
			editNode(rootId as string, editableNode);
			handleNodeRemove(tableId, nodes);
		},
		[nodes, editNode, removeNode, handleNodeRemove],
	);

	return { handleDeleteTable };
};
