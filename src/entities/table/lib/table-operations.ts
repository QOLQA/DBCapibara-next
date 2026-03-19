import type { TableData, Column } from "@fsd/entities/solution";
import { getKeySegment } from "@fsd/shared/lib/keys";
import { generateRandomId } from "@fsd/shared/lib/ids/generate-random-id";

export const deleteTableRecursively = (
	nestedTables: TableData,
	tableId: string,
	numLayers: number,
	layer: number,
): TableData => {
	if (layer === numLayers - 1) {
		nestedTables.nestedTables = nestedTables.nestedTables?.filter(
			(nestedTable: TableData) => nestedTable.id !== tableId,
		);
		return nestedTables;
	}

	const nestedTableResultId = getKeySegment(tableId, layer + 1);
	const nestedTableResult = nestedTables.nestedTables?.map(
		(nestedTable: TableData) =>
			nestedTable.id === nestedTableResultId
				? deleteTableRecursively(nestedTable, tableId, numLayers, layer + 1)
				: nestedTable,
	) as TableData[];

	return {
		...nestedTables,
		nestedTables: nestedTableResult,
	};
};

export const addAttributeToNestedTables = (
	nestedTables: TableData[],
	targetTableId: string,
	newAttributes: Column[],
	typeModal: "create" | "update",
): TableData[] => {
	return nestedTables?.map((table: TableData) => {
		if (table.id === targetTableId) {
			return {
				...table,
				columns:
					typeModal === "create"
						? [...table.columns, ...newAttributes]
						: newAttributes,
			};
		}

		if (table.nestedTables && table.nestedTables.length > 0) {
			return {
				...table,
				nestedTables: addAttributeToNestedTables(
					table.nestedTables,
					targetTableId,
					newAttributes,
					typeModal,
				),
			};
		}

		return table;
	});
};

export const addNestedTableRecursively = (
	nestedTables: TableData[],
	targetTableId: string,
	newNestedTable: TableData,
): TableData[] => {
	return nestedTables?.map((table: TableData) => {
		if (table.id === targetTableId) {
			return {
				...table,
				nestedTables: [...(table.nestedTables || []), newNestedTable],
			};
		}

		if (table.nestedTables && table.nestedTables.length > 0) {
			return {
				...table,
				nestedTables: addNestedTableRecursively(
					table.nestedTables,
					targetTableId,
					newNestedTable,
				),
			};
		}

		return table;
	});
};

export const createNestedTable = (
	parentId: string,
	tableName: string,
	submodelIndex?: number,
): TableData => {
	const tableId = `${parentId}-${generateRandomId()}`;
	return {
		id: tableId,
		label: tableName,
		columns: [
			{
				id: `${tableId}-${generateRandomId()}`,
				name: `${tableName}_id`,
				type: "PRIMARY_KEY",
			},
		],
		nestedTables: [],
		submodelIndex: submodelIndex ?? 0,
	};
};
