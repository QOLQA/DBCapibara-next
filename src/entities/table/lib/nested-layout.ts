export const NESTED_BESIDE_ATTRIBUTE_THRESHOLD = 4;
export const NESTED_GRID_MAX_COLUMNS = 3;

export type NestedContentLayout = "stack" | "split";
export type NestedGridLayout = "column" | "grid";

export interface NestedTableLayout {
	content: NestedContentLayout;
	nesteds: NestedGridLayout;
	gridColumns: number;
}

/**
 * Chooses how nested documents sit inside a table node.
 *
 * - Few attributes + one nested → nested stays below.
 * - Many attributes + nested(s) → nested sits beside the attribute list.
 * - Two or more nesteds → up to 3 per row, balanced.
 */
export function getNestedTableLayout(
	columnCount: number,
	nestedCount: number,
): NestedTableLayout {
	const nesteds: NestedGridLayout = nestedCount >= 2 ? "grid" : "column";
	const content: NestedContentLayout =
		nestedCount > 0 && columnCount > NESTED_BESIDE_ATTRIBUTE_THRESHOLD
			? "split"
			: "stack";
	const gridColumns = Math.min(
		NESTED_GRID_MAX_COLUMNS,
		Math.max(nestedCount, 1),
	);

	return { content, nesteds, gridColumns };
}
