import type { Node, Edge } from "@xyflow/react";
import type { TableData } from "@/app/models/[diagramId]/canva/types";

// Cache to avoid unnecessary recalculations
let cachedAccessPattern: number | null = null;
let lastNodeHash: string | null = null;
let lastEdgeHash: string | null = null;

/**
 * Generates a hash for nodes excluding x,y positions to avoid recalculation on movement
 */
function generateNodeHashWithoutPosition(nodes: Node<TableData>[]): string {
	return JSON.stringify(nodes.map(node => ({
		id: node.id,
		data: node.data,
		type: node.type
		// Intentionally exclude position to avoid recalculations on movement
	})));
}

/**
 * Generates a simple hash for edges
 */
function generateEdgeHash(edges: Edge[]): string {
	return JSON.stringify(edges.map(edge => ({
		id: edge.id,
		source: edge.source,
		target: edge.target,
		type: edge.type
	})));
}

function getMaxDepth(nodes: Node<TableData>[]): number {
	if (nodes.length === 0) return 0;

	// Recursive function to calculate nestedTables depth
	function calculateNestedDepth(tableData: TableData): number {
		if (!tableData.nestedTables || tableData.nestedTables.length === 0) {
			return 1;
		}

		const nestedDepths = tableData.nestedTables.map(nested =>
			calculateNestedDepth(nested)
		);

		return 1 + Math.max(...nestedDepths);
	}

	// Calculate maximum depth among all nodes
	const depths = nodes.map(node => calculateNestedDepth(node.data));

	return Math.max(...depths);
}

function getMaxRelations(edges: Edge[]): number {
	if (edges.length === 0) return 0;

	// Count relations per node (both as source and target)
	const relationCounts = new Map<string, number>();

	edges.forEach(edge => {
		const sourceId = edge.source;
		const targetId = edge.target;

		// Count for source node
		relationCounts.set(sourceId, (relationCounts.get(sourceId) || 0) + 1);

		// Count for target node
		relationCounts.set(targetId, (relationCounts.get(targetId) || 0) + 1);
	});

	// Return the maximum number of relations that any node has
	return relationCounts.size > 0 ? Math.max(...relationCounts.values()) : 0;
}

/**
 * Pure function to calculate access pattern without caching
 */
function calculateAccessPatternPure(nodes: Node<TableData>[], edges: Edge[]): number {
	const maxDepth = getMaxDepth(nodes) - 1;
	const maxRelations = getMaxRelations(edges);
	const accessPattern = (maxDepth * 0.4) + (maxRelations * 0.6);


	return Math.round(accessPattern * 100) / 100
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
	const currentEdgeHash = generateEdgeHash(edges);

	// If there are no relevant changes, return cached result
	if (
		cachedAccessPattern !== null &&
		lastNodeHash === currentNodeHash &&
		lastEdgeHash === currentEdgeHash
	) {
		return cachedAccessPattern;
	}

	// Update hashes
	lastNodeHash = currentNodeHash;
	lastEdgeHash = currentEdgeHash;

	// Perform calculation using injected function
	const result = calculationFn(nodes, edges);

	// Cache result
	cachedAccessPattern = result;

	return result;
}

/**
 * Main export function that combines cache validation with calculation
 */
export function getAccessPattern(nodes: Node<TableData>[], edges: Edge[]) {
	return withCacheValidation(nodes, edges, calculateAccessPatternPure);
}