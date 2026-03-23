import { useCallback } from "react";
import type { Node } from "@xyflow/react";
import { getKeySegment } from "@fsd/shared/lib/keys";
import type { Column, TableData } from "@fsd/entities/solution";
import type { TableAttribute } from "./use-attribute-modal";

interface UseEditAttributeParams {
	nodeId: string;
	nodes: Node<TableData>[];
	openUpdateAttributesModal: (
		tableId: string,
		attributes: TableAttribute[],
	) => void;
}

export const useEditAttribute = ({
	nodeId,
	nodes,
	openUpdateAttributesModal,
}: UseEditAttributeParams) => {
	return useCallback(
		(selectedColumn: Column) => {
			const numLayers = selectedColumn.id.split("-").length;
			let k = 1;
			const node = nodes?.find((n: Node<TableData>) => n.id === nodeId);
			let table = node?.data;

			while (k < numLayers - 1) {
				k = k + 1;
				const segmentedKey = getKeySegment(selectedColumn.id, k);
				table = table?.nestedTables?.find(
					(t: TableData) => t.id === segmentedKey,
				) as TableData;
			}

			const columns =
				table?.columns?.map((column: Column) => ({
					...column,
					ableToEdit: column.id === selectedColumn.id,
				})) || [];

			openUpdateAttributesModal(
				getKeySegment(selectedColumn.id, numLayers - 1) as string,
				columns,
			);
		},
		[nodes, nodeId, openUpdateAttributesModal],
	);
};
