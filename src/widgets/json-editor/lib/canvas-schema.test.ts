import { describe, it, expect } from "vitest";
import { parseAndValidateCanvasJson } from "./canvas-schema.lib";

const MOCK_VALID_SCHEMA = {
  nodes: [
    { id: "1", position: { x: 0, y: 0 }, data: {} },
    { id: "2", position: { x: 0, y: 0 }, data: {} },
  ],
  edges: [{ id: "e1-2", source: "1", target: "2" }],
};

describe("parseAndValidateCanvasJson", () => {
  it("should parse valid JSON correctly and return success", () => {
    const jsonString = JSON.stringify(MOCK_VALID_SCHEMA);
    const result = parseAndValidateCanvasJson(jsonString);

    expect(result.success).toBe(true);
    expect(result.data?.nodes).toEqual(MOCK_VALID_SCHEMA.nodes);
    expect(result.data?.edges).toEqual(MOCK_VALID_SCHEMA.edges);
    expect(result.sanitizedCount).toBe(0);
    expect(result.error).toBeUndefined();
  });

  it("should return an error for invalid JSON format", () => {
    const jsonString = "{ nodes: [}";
    const result = parseAndValidateCanvasJson(jsonString);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid JSON format.");
    expect(result.data).toBeUndefined();
  });

  it("should return an error if 'nodes' array is missing", () => {
    const schema = { edges: [] };
    const jsonString = JSON.stringify(schema);
    const result = parseAndValidateCanvasJson(jsonString);

    expect(result.success).toBe(false);
    expect(result.error).toBe("JSON must have 'nodes' and 'edges' arrays.");
  });

  it("should return an error if 'edges' array is missing", () => {
    const schema = { nodes: [] };
    const jsonString = JSON.stringify(schema);
    const result = parseAndValidateCanvasJson(jsonString);

    expect(result.success).toBe(false);
    expect(result.error).toBe("JSON must have 'nodes' and 'edges' arrays.");
  });

  it("should sanitize dangling edges and report the count", () => {
    const schemaWithDanglingEdge = {
      nodes: [{ id: "1", position: { x: 0, y: 0 }, data: {} }],
      edges: [
        { id: "e1-2", source: "1", target: "2" }, // target "2" does not exist
        { id: "e3-4", source: "3", target: "4" }, // source "3" and target "4" do not exist
      ],
    };
    const jsonString = JSON.stringify(schemaWithDanglingEdge);
    const result = parseAndValidateCanvasJson(jsonString);

    expect(result.success).toBe(true);
    expect(result.data?.nodes).toHaveLength(1);
    expect(result.data?.edges).toHaveLength(0); // Both edges should be removed
    expect(result.sanitizedCount).toBe(2);
  });

  it("should not remove valid edges during sanitization", () => {
    const jsonString = JSON.stringify(MOCK_VALID_SCHEMA);
    const result = parseAndValidateCanvasJson(jsonString);

    expect(result.success).toBe(true);
    expect(result.data?.edges).toHaveLength(1);
    expect(result.sanitizedCount).toBe(0);
  });
});
