import { Edge, Node } from "@xyflow/react";

export interface CanvasSchema {
  nodes: Node[];
  edges: Edge[];
}

export interface ValidationResult {
  success: boolean;
  data?: CanvasSchema;
  error?: string;
  sanitizedCount: number;
}

/**
 * Parses, validates, and sanitizes a JSON string representing a canvas schema.
 * - Ensures the JSON is valid.
 * - Ensures the root object contains 'nodes' and 'edges' arrays.
 * - Removes edges that point to non-existent nodes (dangling edges).
 *
 * @param jsonString The raw JSON string from the editor.
 * @returns A ValidationResult object.
 */
export function parseAndValidateCanvasJson(jsonString: string): ValidationResult {
  let parsed: any;

  // 1. Check for valid JSON
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    return { success: false, error: "Invalid JSON format.", sanitizedCount: 0 };
  }

  // 2. Check for basic structure (nodes and edges arrays)
  if (
    typeof parsed !== "object" ||
    !Array.isArray(parsed.nodes) ||
    !Array.isArray(parsed.edges)
  ) {
    return {
      success: false,
      error: "JSON must have 'nodes' and 'edges' arrays.",
      sanitizedCount: 0,
    };
  }

  const schema: CanvasSchema = {
    nodes: parsed.nodes,
    edges: parsed.edges,
  };

  // 3. Sanitize dangling edges
  const validNodeIds = new Set(schema.nodes.map((node) => node.id));
  const originalEdgeCount = schema.edges.length;

  const sanitizedEdges = schema.edges.filter(
    (edge) => validNodeIds.has(edge.source) && validNodeIds.has(edge.target)
  );

  const sanitizedCount = originalEdgeCount - sanitizedEdges.length;

  return {
    success: true,
    data: {
      nodes: schema.nodes,
      edges: sanitizedEdges,
    },
    sanitizedCount,
  };
}
