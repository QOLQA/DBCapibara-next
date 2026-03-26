import type { Edge, Node } from "@xyflow/react";
import type { TableData } from "@fsd/entities/solution";
import { getAccessPattern } from "./accessPattern";

// Cache to avoid unnecessary recalculations
let cachedRecoveryCost: number | null = null;
let lastNodeHash: string | null = null;
let lastEdgeHash: string | null = null;

/**
 * Generates a hash for nodes excluding x,y positions to avoid recalculation on movement
 */
function generateNodeHashWithoutPosition(nodes: Node<TableData>[]): string {
	return JSON.stringify(
		nodes.map((node) => ({
			id: node.id,
			data: node.data,
			type: node.type,
		}))
	);
}

/**
 * Generates a simple hash for edges
 */
function generateEdgeHash(edges: Edge[]): string {
	if (!edges || edges.length === 0) return "[]";

	return JSON.stringify(
		edges.map((edge) => ({
			id: edge.id,
			source: edge.source,
			target: edge.target,
			type: edge.type,
		}))
	);
}

/**
 * Checks if a column type is complex (e.g., array[])
 */
function isComplexAttribute(type: string): boolean {
	if (!type) return false;
	const lowerType = type.toLowerCase();
	return lowerType.includes("[]") || lowerType.includes("array");
}

/**
 * Counts all simple attributes (columns) in nodes including nested tables.
 * Excludes complex attributes like arrays.
 */
function getTotalAttributes(nodes: Node<TableData>[]): number {
	let totalAttributes = 0;

	const countAttributesRecursively = (table: TableData): number => {
		// Only count columns that are NOT complex
		let count = table.columns
			? table.columns.filter((col) => !isComplexAttribute(col.type)).length
			: 0;

		// Process nested tables if they exist
		if (table.nestedTables && table.nestedTables.length > 0) {
			table.nestedTables.forEach((nestedTable) => {
				count += countAttributesRecursively(nestedTable);
			});
		}

		return count;
	};

	nodes.forEach((node) => {
		totalAttributes += countAttributesRecursively(node.data);
	});

	return totalAttributes;
}

/**
 * Counts all complex elements: nested tables and complex columns (arrays)
 */
function getTotalNestedTables(nodes: Node<TableData>[]): number {
	let totalNestedTables = 0;

	const countNestedTablesRecursively = (table: TableData): number => {
		let count = 0;

		// Count columns that ARE complex
		if (table.columns) {
			count += table.columns.filter((col) => isComplexAttribute(col.type)).length;
		}

		// Process nested tables if they exist
		if (table.nestedTables && table.nestedTables.length > 0) {
			count += table.nestedTables.length;

			// Recursively count complex elements within nested tables
			table.nestedTables.forEach((nestedTable) => {
				count += countNestedTablesRecursively(nestedTable);
			});
		}

		return count;
	};

	nodes.forEach((node) => {
		totalNestedTables += countNestedTablesRecursively(node.data);
	});

	return totalNestedTables;
}

/**
 * Pure function to calculate recovery cost without caching
 */
function calculateRecoveryCostPure(
	nodes: Node<TableData>[],
	edges: Edge[]
): number {
	const totalAttributes = getTotalAttributes(nodes);
	const totalNestedTables = getTotalNestedTables(nodes);
	const accessPattern = getAccessPattern(nodes, edges || []);

	const recoveryCost =
		totalAttributes * 0.51 + totalNestedTables * 0.49 + accessPattern;

	const roundedRecoveryCost = Math.round(recoveryCost * 100) / 100;
	return parseFloat(roundedRecoveryCost.toFixed(2));
}

/**
 * Cache validation layer - acts as dependency injection for caching logic
 */
function withCacheValidation(
	nodes: Node<TableData>[],
	edges: Edge[],
	calculationFn: (nodes: Node<TableData>[], edges: Edge[]) => number
): number {
	// Generate hashes to detect changes
	const currentNodeHash = generateNodeHashWithoutPosition(nodes);
	const currentEdgeHash = generateEdgeHash(edges || []);

	// If there are no relevant changes, return cached result
	if (
		cachedRecoveryCost !== null &&
		lastNodeHash === currentNodeHash &&
		lastEdgeHash === currentEdgeHash
	) {
		return cachedRecoveryCost;
	}

	// Update hashes
	lastNodeHash = currentNodeHash;
	lastEdgeHash = currentEdgeHash;

	// Perform calculation using injected function
	const result = calculationFn(nodes, edges || []);

	// Cache result
	cachedRecoveryCost = result;

	return result;
}

/**
 * Main export function that combines cache validation with calculation
 */
export function getRecoveryCost(
	nodes: Node<TableData>[],
	edges: Edge[]
): number {
	return withCacheValidation(nodes, edges, calculateRecoveryCostPure);
}

