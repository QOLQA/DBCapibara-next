import { useCallback } from "react";
import type { Node } from "@xyflow/react";
import { getKeySegment } from "@fsd/shared/lib/keys";
import type { Column, TableData } from "@fsd/entities/solution";
import type { TableAttribute } from "./use-attribute-modal";

interface UseEditTableParams {
	nodeId: string;
	nodes: Node<TableData>[];
	openUpdateAttributesModal: (
		tableId: string,
		attributes: TableAttribute[],
	) => void;
}

export const useEditTable = ({
	nodeId,
	nodes,
	openUpdateAttributesModal,
}: UseEditTableParams) => {
	return useCallback(
		(tableId: string) => {
			const numLayers = tableId.split("-").length;
			let k = 1;
			const node = nodes?.find((n: Node<TableData>) => n.id === nodeId);
			let table = node?.data;

			while (k < numLayers) {
				k = k + 1;
				const segmentedKey = getKeySegment(tableId, k);
				table = table?.nestedTables?.find(
					(t: TableData) => t.id === segmentedKey,
				);
			}

			const columns =
				table?.columns?.map((column: Column) => ({
					...column,
					ableToEdit:
						column.type !== "PRIMARY_KEY" &&
						column.type !== "FOREIGN_KEY" &&
						column.type !== "DOCUMENT",
				})) || [];

			openUpdateAttributesModal(tableId, columns);
		},
		[nodeId, nodes, openUpdateAttributesModal],
	);
};
