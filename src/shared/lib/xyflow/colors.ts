/**
 * Color palette for submodel/diagram headers.
 * Each submodel gets a distinct color for its table headers.
 */
export const SUBMODEL_COLORS = [
	"#1e40af", // blue-800
	"#7c3aed", // violet-600
	"#dc2626", // red-600
	"#16a34a", // green-600
	"#ea580c", // orange-600
	"#0891b2", // cyan-600
	"#c026d3", // fuchsia-600
	"#65a30d", // lime-600
	"#e11d48", // rose-600
	"#0d9488", // teal-600
	"#7c2d12", // orange-900
	"#4338ca", // indigo-700
];

/**
 * Get a color for a submodel based on its index.
 */
export function getSubmodelColor(index: number): string {
	return SUBMODEL_COLORS[index % SUBMODEL_COLORS.length];
}

/**
 * Get submodel index from node ID.
 * Assumes format "index-rest" (e.g. "0-abc123").
 */
export function getSubmodelIndexFromNodeId(nodeId: string): number {
	const parts = nodeId.split("-");
	const index = Number.parseInt(parts[0], 10);
	return Number.isNaN(index) ? 0 : index;
}
