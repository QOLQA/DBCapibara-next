import { useCallback } from "react";
import type { Node } from "@xyflow/react";
import type { TableData } from "@fsd/entities/solution";
import {
	addNestedTableRecursively,
	createNestedTable,
} from "@fsd/entities/table/lib";

interface UseAddNestedTableParams {
	nodeId: string;
	submodelIndex?: number;
	targetTableId: string | null;
	setNodes: (updater: (nodes: Node[]) => Node[]) => void;
}

export const useAddNestedTable = ({
	nodeId,
	submodelIndex,
	targetTableId,
	setNodes,
}: UseAddNestedTableParams) => {
	return useCallback(
		(tableName: string) => {
			if (!targetTableId) return;

			const newNestedTable = createNestedTable(
				targetTableId,
				tableName,
				submodelIndex,
			);

			setNodes((currentNodes: Node[]) => {
				return currentNodes?.map((node: Node) => {
					if (node.id !== nodeId) return node;

					const tableData = node.data as TableData;

					if (tableData.id === targetTableId) {
						return {
							...node,
							data: {
								...tableData,
								nestedTables: [
									...(tableData.nestedTables || []),
									newNestedTable,
								],
							},
						};
					}

					if (tableData.nestedTables && tableData.nestedTables.length > 0) {
						return {
							...node,
							data: {
								...tableData,
								nestedTables: addNestedTableRecursively(
									tableData.nestedTables,
									targetTableId,
									newNestedTable,
								),
							},
						};
					}

					return node;
				});
			});
		},
		[nodeId, submodelIndex, targetTableId, setNodes],
	);
};
