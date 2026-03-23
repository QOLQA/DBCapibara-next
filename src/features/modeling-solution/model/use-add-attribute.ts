import { useCallback } from "react";
import type { Node } from "@xyflow/react";
import type { Column, TableData } from "@fsd/entities/solution";
import { addAttributeToNestedTables } from "@fsd/entities/table/lib";
import { generateRandomId } from "@fsd/shared/lib/ids";
import type { AttributeModalType, TableAttribute } from "./use-attribute-modal";

interface UseAddAttributeParams {
	nodeId: string;
	targetTableId: string | null;
	setNodes: (updater: (nodes: Node[]) => Node[]) => void;
}

export const useAddAttribute = ({
	nodeId,
	targetTableId,
	setNodes,
}: UseAddAttributeParams) => {
	return useCallback(
		(newAtributes: TableAttribute[], typeModal: AttributeModalType) => {
			if (!targetTableId) return;

			const newAtributesWithId =
				typeModal === "create"
					? newAtributes.map((atribute) => ({
							id: `${targetTableId}-${generateRandomId()}`,
							name: atribute.name,
							type: atribute.type,
							ableToEdit: atribute.ableToEdit,
						}))
					: newAtributes;

			setNodes((currentNodes: Node[]) => {
				return currentNodes?.map((node: Node) => {
					if (node.id !== nodeId) return node;

					const tableData = node.data as TableData;

					if (tableData.id === targetTableId) {
						return {
							...node,
							data: {
								...tableData,
								columns:
									typeModal === "create"
										? [...tableData.columns, ...newAtributesWithId]
										: newAtributesWithId,
							},
						};
					}

					if (tableData.nestedTables && tableData.nestedTables.length > 0) {
						return {
							...node,
							data: {
								...tableData,
								nestedTables: addAttributeToNestedTables(
									tableData.nestedTables,
									targetTableId,
									newAtributesWithId as Column[],
									typeModal,
								),
							},
						};
					}

					return node;
				});
			});
		},
		[nodeId, targetTableId, setNodes],
	);
};
