export {
	deleteTableRecursively,
	addAttributeToNestedTables,
	addNestedTableRecursively,
	createNestedTable,
} from "./table-operations";
export {
	getNestedTableLayout,
	NESTED_BESIDE_ATTRIBUTE_THRESHOLD,
	NESTED_GRID_MAX_COLUMNS,
} from "./nested-layout";
export type {
	NestedTableLayout,
	NestedContentLayout,
	NestedGridLayout,
} from "./nested-layout";
export { getColumnTypeLabel, COLUMN_TYPE_LABELS, type KnownColumnType } from "./column-type-labels";
export {
	existsConnection,
	getNextAvailableSubmodelIndex,
	updateNestedSubmodelIndex,
	updateSubmodelIndexInTable,
	buildGraph,
	updateSubmodelIndexInNodes,
} from "./connection-operations";
