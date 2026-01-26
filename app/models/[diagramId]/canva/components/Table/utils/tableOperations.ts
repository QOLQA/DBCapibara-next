import type { TableData, Column } from "../../../types";
import getKeySegment from "@/lib/getKeySegment";

/**
 * Generates a random 8-character alphanumeric ID
 */
export const generateRandomId = (): string => {
	const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for (let i = 0; i < 8; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
};

/**
 * Recursively deletes a column from nested tables
 */
export const deleteColumnRecursively = (
	nestedTables: TableData,
	columnId: string,
	targetColumnId: string,
	numLayers: number,
	layer: number
): TableData => {
	if (layer > 100) {
		return nestedTables;
	}

	if (layer === numLayers - 1) {
		nestedTables.columns = nestedTables.columns.filter(
			(col: Column) => col.id !== targetColumnId
		);
		return nestedTables;
	}

	const nestedTableResultId = getKeySegment(columnId, layer + 1);

	const nestedTableResult = nestedTables.nestedTables?.map(
		(nestedTable: TableData) =>
			nestedTable.id === nestedTableResultId
				? deleteColumnRecursively(nestedTable, columnId, targetColumnId, numLayers, layer + 1)
				: nestedTable
	) as TableData[];

	return {
		...nestedTables,
		nestedTables: nestedTableResult,
	};
};

/**
 * Recursively deletes a nested table
 */
export const deleteTableRecursively = (
	nestedTables: TableData,
	tableId: string,
	numLayers: number,
	layer: number
): TableData => {
	if (layer === numLayers - 1) {
		nestedTables.nestedTables = nestedTables.nestedTables?.filter(
			(nestedTable: TableData) => nestedTable.id !== tableId
		);
		return nestedTables;
	}

	const nestedTableResultId = getKeySegment(tableId, layer + 1);
	const nestedTableResult = nestedTables.nestedTables?.map(
		(nestedTable: TableData) =>
			nestedTable.id === nestedTableResultId
				? deleteTableRecursively(nestedTable, tableId, numLayers, layer + 1)
				: nestedTable
	) as TableData[];

	return {
		...nestedTables,
		nestedTables: nestedTableResult,
	};
};

/**
 * Recursively adds attributes to a nested table
 */
export const addAttributeToNestedTables = (
	nestedTables: TableData[],
	targetTableId: string,
	newAttributes: Column[],
	typeModal: "create" | "update"
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
					typeModal
				),
			};
		}

		return table;
	});
};

/**
 * Recursively adds a nested table to a target table
 */
export const addNestedTableRecursively = (
	nestedTables: TableData[],
	targetTableId: string,
	newNestedTable: TableData
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
					newNestedTable
				),
			};
		}

		return table;
	});
};

/**
 * Finds a table by traversing through nested tables using the table ID segments
 */
export const findTableByPath = (
	rootData: TableData,
	tableId: string
): TableData | undefined => {
	const numLayers = tableId.split("-").length;
	let table: TableData | undefined = rootData;

	for (let k = 2; k <= numLayers; k++) {
		const segmentedKey = getKeySegment(tableId, k);
		table = table?.nestedTables?.find(
			(t: TableData) => t.id === segmentedKey
		);
		if (!table) break;
	}

	return table;
};

/**
 * Creates a new nested table with default structure
 */
export const createNestedTable = (
	parentId: string,
	tableName: string,
	submodelIndex?: number
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
