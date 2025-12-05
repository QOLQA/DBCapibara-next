import type { Node } from "@xyflow/react";
import type { TableData } from "@/app/models/[diagramId]/canva/types";

// Cache to avoid unnecessary recalculations
let cachedRedundancyMetrics: number | null = null;
let lastNodeHash: string | null = null;

/**
 * Generates a hash for nodes excluding x,y positions to avoid recalculation on movement
 */
function generateNodeHashWithoutPosition(nodes: Node<TableData>[]): string {
	return JSON.stringify(nodes.map(node => ({
		id: node.id,
		data: node.data,
		type: node.type
	})));
}

/**
 * Collects all table names including nested tables
 */
function getAllTableNames(nodes: Node<TableData>[]): string[] {
	const allNames: string[] = [];

	const collectNamesRecursively = (table: TableData): void => {
		// Add current table name
		allNames.push(table.label);

		// Process nested tables if they exist
		if (table.nestedTables && table.nestedTables.length > 0) {
			table.nestedTables.forEach(nestedTable => {
				collectNamesRecursively(nestedTable);
			});
		}
	};

	nodes.forEach(node => {
		collectNamesRecursively(node.data);
	});

	return allNames;
}

/**
 * Counts duplicate table names and returns total duplications
 */
function countDuplicateNames(names: string[]): number {
	const nameCountMap = new Map<string, number>();
	let totalDuplications = 0;

	// Count occurrences of each name
	names.forEach(name => {
		const currentCount = nameCountMap.get(name) || 0;
		nameCountMap.set(name, currentCount + 1);
	});

	// Calculate total duplications (occurrences - 1 for each duplicated name)
	nameCountMap.forEach((count) => {
		if (count > 1) {
			totalDuplications += (count - 1); // Each extra occurrence is a duplication
		}
	});

	return totalDuplications;
}

/**
 * Pure function to calculate redundancy metrics without caching
 */
function calculateRedundancyMetricsPure(nodes: Node<TableData>[]): number {
	const allTableNames = getAllTableNames(nodes);
	const totalDuplications = countDuplicateNames(allTableNames);

	return totalDuplications;
}

/**
 * Cache validation layer - acts as dependency injection for caching logic
 */
function withCacheValidation(
	nodes: Node<TableData>[],
	calculationFn: (nodes: Node<TableData>[]) => number
): number {
	// Generate hash to detect changes
	const currentNodeHash = generateNodeHashWithoutPosition(nodes);

	// If there are no relevant changes, return cached result
	if (
		cachedRedundancyMetrics !== null &&
		lastNodeHash === currentNodeHash
	) {
		return cachedRedundancyMetrics;
	}

	// Update hash
	lastNodeHash = currentNodeHash;

	// Perform calculation using injected function
	const result = calculationFn(nodes);

	// Cache result
	cachedRedundancyMetrics = result;

	return result;
}

/**
 * Main export function that combines cache validation with calculation
 */
export function getRedundancyMetrics(nodes: Node<TableData>[]): number {
	return withCacheValidation(nodes, calculateRedundancyMetricsPure);
}
