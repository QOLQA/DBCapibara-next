import type { Node, Edge } from "@xyflow/react";
import type { Query, TableData } from "@/app/models/[diagramId]/canva/types";

// Cache to avoid unnecessary recalculations
let cachedResult: number | null = null;
let lastNodeHash: string | null = null;
let lastQueryHash: string | null = null;
let lastEdgeHash: string | null = null;

/**
 * Generates a simple hash to detect changes in data structure
 */
function generateHash<T>(data: T[]): string {
	return JSON.stringify(data.map(item =>
		typeof item === 'object' && item !== null ?
			Object.keys(item).sort().reduce((acc, key) => {
				acc[key] = (item as any)[key];
				return acc;
			}, {} as any) : item
	));
}

/**
 * Generates a specific hash for nodes excluding x,y positions
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
 * Gets all table names, including nested tables
 * Returns a map of table name -> set of table IDs with that name
 */
function getAllTableNames(nodes: Node<TableData>[]): Map<string, Set<string>> {
	const tableNamesMap = new Map<string, Set<string>>();

	const extractNamesRecursively = (table: TableData) => {
		if (!tableNamesMap.has(table.label)) {
			tableNamesMap.set(table.label, new Set());
		}
		tableNamesMap.get(table.label)!.add(table.id);

		// Process nested tables if they exist
		if (table.nestedTables && table.nestedTables.length > 0) {
			table.nestedTables.forEach(nestedTable => {
				extractNamesRecursively(nestedTable);
			});
		}
	};

	nodes.forEach(node => {
		extractNamesRecursively(node.data);
	});

	return tableNamesMap;
}

/**
 * Adds bidirectional nested relationships to the graph using table IDs
 */
function addNestedRelationships(
	graph: Map<string, Set<string>>,
	table: TableData,
	parentId?: string
) {
	const currentTableId = table.id;

	// Initialize current table in graph if not exists
	if (!graph.has(currentTableId)) {
		graph.set(currentTableId, new Set());
	}

	// Add bidirectional relationship with parent if exists
	if (parentId) {
		if (!graph.has(parentId)) {
			graph.set(parentId, new Set());
		}

		// Bidirectional: parent ↔ child
		graph.get(parentId)!.add(currentTableId);
		graph.get(currentTableId)!.add(parentId);
	}

	// Process nested tables recursively
	if (table.nestedTables && table.nestedTables.length > 0) {
		table.nestedTables.forEach(nestedTable => {
			addNestedRelationships(graph, nestedTable, currentTableId);
		});
	}
}

/**
 * Builds a connection graph between nodes using table IDs
 */
function buildConnectionGraph(nodes: Node<TableData>[], edges: Edge[]): Map<string, Set<string>> {
	const graph = new Map<string, Set<string>>();

	// Initialize all parent nodes in the graph and add nested relationships
	nodes.forEach(node => {
		addNestedRelationships(graph, node.data);
	});

	// Add BIDIRECTIONAL connections based on edges (edges represent relationships that can be traversed both ways)
	edges.forEach(edge => {
		const sourceNode = nodes.find(n => n.id === edge.source);
		const targetNode = nodes.find(n => n.id === edge.target);

		if (sourceNode && targetNode) {
			const sourceId = sourceNode.data.id;
			const targetId = targetNode.data.id;

			if (!graph.has(sourceId)) graph.set(sourceId, new Set());
			if (!graph.has(targetId)) graph.set(targetId, new Set());

			// Bidirectional: source ↔ target (can traverse both ways)
			graph.get(sourceId)!.add(targetId);
			graph.get(targetId)!.add(sourceId);
		}
	});

	return graph;
}

/**
 * Verifies if there is a path between all tables mentioned in the query
 * using BFS (Breadth-First Search) - checks bidirectional paths
 * Now works with table IDs instead of names to handle duplicate names correctly
 */
function hasPathBetweenAllTables(
	collections: string[],
	graph: Map<string, Set<string>>,
	tableNamesMap: Map<string, Set<string>>
): boolean {
	// Remove duplicates from collections
	const uniqueCollections = Array.from(new Set(collections));

	// If there's only one unique collection, verify it exists
	if (uniqueCollections.length <= 1) {
		if (uniqueCollections.length === 0) return true;
		return tableNamesMap.has(uniqueCollections[0]);
	}

	// Get all possible table IDs for each collection name
	const collectionIdSets = uniqueCollections.map(name => {
		const ids = tableNamesMap.get(name);
		if (!ids || ids.size === 0) return null;
		return Array.from(ids);
	});

	// If any collection doesn't exist, query cannot be handled
	if (collectionIdSets.some(ids => ids === null)) {
		return false;
	}

	// For each pair of collection names, verify if there's a path between ANY combination of their IDs
	for (let i = 0; i < uniqueCollections.length; i++) {
		for (let j = i + 1; j < uniqueCollections.length; j++) {
			const idsI = collectionIdSets[i]!;
			const idsJ = collectionIdSets[j]!;

			// Check if there's a path between any pair of IDs
			let foundPath = false;
			for (const idI of idsI) {
				for (const idJ of idsJ) {
					// Skip if same table (same ID)
					if (idI === idJ) {
						foundPath = true;
						break;
					}

					const hasForwardPath = hasPathBFS(idI, idJ, graph);
					const hasBackwardPath = hasPathBFS(idJ, idI, graph);

					if (hasForwardPath || hasBackwardPath) {
						foundPath = true;
						break;
					}
				}
				if (foundPath) break;
			}

			// If no path exists between any combination, the query cannot be handled
			if (!foundPath) {
				return false;
			}
		}
	}

	return true;
}

/**
 * BFS to find path between two nodes
 */
function hasPathBFS(start: string, end: string, graph: Map<string, Set<string>>): boolean {
	if (start === end) return true;

	const visited = new Set<string>();
	const queue = [start];
	visited.add(start);

	while (queue.length > 0) {
		const current = queue.shift()!;
		const neighbors = graph.get(current);

		if (neighbors) {
			for (const neighbor of neighbors) {
				if (neighbor === end) return true;

				if (!visited.has(neighbor)) {
					visited.add(neighbor);
					queue.push(neighbor);
				}
			}
		}
	}

	return false;
}

/**
 * Verifies if a query is completely handled
 */
function isQueryFullyHandled(
	collections: string[],
	tableNamesMap: Map<string, Set<string>>,
	graph: Map<string, Set<string>>
): boolean {
	// 1. Verify that all tables exist (including nested ones)
	const allTablesExist = collections.every(collection => tableNamesMap.has(collection));
	if (!allTablesExist) return false;

	// 2. Verify that there is a path between all tables
	return hasPathBetweenAllTables(collections, graph, tableNamesMap);
}

/**
 * Counts the handled queries
 */
function getHandledQueriesCount(
	queries: Query[],
	tableNamesMap: Map<string, Set<string>>,
	graph: Map<string, Set<string>>
): number {
	return queries.filter(query =>
		isQueryFullyHandled(query.collections, tableNamesMap, graph)
	).length;
}

/**
 * Calculates the percentage of handled queries in an optimized way
 */
export function calculateHandledQueriesPercentage(
	queries: Query[],
	nodes: Node<TableData>[],
	edges: Edge[]
): number {
	// Generate hashes to detect changes
	const currentNodeHash = generateNodeHashWithoutPosition(nodes);
	const currentQueryHash = generateHash(queries);
	const currentEdgeHash = generateHash(edges);

	// If there are no relevant changes, return cached result
	if (
		cachedResult !== null &&
		lastNodeHash === currentNodeHash &&
		lastQueryHash === currentQueryHash &&
		lastEdgeHash === currentEdgeHash
	) {
		return cachedResult;
	}

	// Update hashes
	lastNodeHash = currentNodeHash;
	lastQueryHash = currentQueryHash;
	lastEdgeHash = currentEdgeHash;

	// Perform calculation
	const tableNamesMap = getAllTableNames(nodes);
	const graph = buildConnectionGraph(nodes, edges);
	const totalQueries = queries.length;
	const handledQueries = getHandledQueriesCount(queries, tableNamesMap, graph);

	if (totalQueries === 0) {
		cachedResult = 0;
		return 0;
	}

	const percentage = (handledQueries / totalQueries) * 100;
	cachedResult = Math.round(percentage * 100) / 100;

	return cachedResult;
}