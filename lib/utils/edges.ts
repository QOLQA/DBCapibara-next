import {
	Position,
	MarkerType,
	type Node,
	type Edge,
	type InternalNode,
} from "@xyflow/react";

/**
 * Returns the intersection point of the line between the center of the intersectionNode and the target node.
 * @param intersectionNode - The node from which the intersection is calculated (InternalNode)
 * @param targetNode - The target node (InternalNode)
 * @returns The intersection point as an object with x and y coordinates
 */
function getNodeIntersection(
	intersectionNode: InternalNode,
	targetNode: InternalNode,
): { x: number; y: number } {
	const { width: intersectionNodeWidth, height: intersectionNodeHeight } =
		intersectionNode.measured as { width: number; height: number };
	const intersectionNodePosition = intersectionNode.internals.positionAbsolute;
	const targetPosition = targetNode.internals.positionAbsolute;

	const w = intersectionNodeWidth / 2;
	const h = intersectionNodeHeight / 2;

	const x2 = intersectionNodePosition.x + w;
	const y2 = intersectionNodePosition.y + h;
	const x1 = targetPosition.x + intersectionNodeWidth / 2;
	const y1 = targetPosition.y + intersectionNodeHeight / 2;

	const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
	const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
	const a = 1 / (Math.abs(xx1) + Math.abs(yy1) || 1);
	const xx3 = a * xx1;
	const yy3 = a * yy1;
	const x = w * (xx3 + yy3) + x2;
	const y = h * (-xx3 + yy3) + y2;

	return { x, y };
}

/**
 * Returns the position (top, right, bottom, or left) of the node compared to the intersection point.
 * @param node - The node to check (InternalNode)
 * @param intersectionPoint - The intersection point (object with x and y)
 * @returns The position as a Position enum value
 */
function getEdgePosition(
	node: InternalNode,
	intersectionPoint: { x: number; y: number },
): Position {
	const n = { ...node.internals.positionAbsolute, ...node };
	const { width: intersectionNodeWidth, height: intersectionNodeHeight } =
		n.measured as { width: number; height: number };
	const nx = Math.round(n.x);
	const ny = Math.round(n.y);
	const px = Math.round(intersectionPoint.x);
	const py = Math.round(intersectionPoint.y);

	if (px <= nx + 1) {
		return Position.Left;
	}
	if (px >= nx + intersectionNodeWidth - 1) {
		return Position.Right;
	}
	if (py <= ny + 1) {
		return Position.Top;
	}
	if (py >= ny + intersectionNodeHeight - 1) {
		return Position.Bottom;
	}

	return Position.Top;
}

/**
 * Returns the parameters needed to create an edge between two nodes.
 * @param source - The source node (InternalNode)
 * @param target - The target node (InternalNode)
 * @returns An object with source/target coordinates and positions
 */
export function getEdgeParams(
	source: InternalNode,
	target: InternalNode,
): {
	sx: number;
	sy: number;
	tx: number;
	ty: number;
	sourcePos: Position;
	targetPos: Position;
} {
	const sourceIntersectionPoint = getNodeIntersection(source, target);
	const targetIntersectionPoint = getNodeIntersection(target, source);

	const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
	const targetPos = getEdgePosition(target, targetIntersectionPoint);

	return {
		sx: sourceIntersectionPoint.x,
		sy: sourceIntersectionPoint.y,
		tx: targetIntersectionPoint.x,
		ty: targetIntersectionPoint.y,
		sourcePos,
		targetPos,
	};
}

/**
 * Creates a set of example nodes and edges arranged in a circle around a center node.
 * @returns An object containing arrays of nodes and edges
 */
export function createNodesAndEdges(): { nodes: Node[]; edges: Edge[] } {
	const nodes: Node[] = [];
	const edges: Edge[] = [];
	const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

	nodes.push({ id: "target", data: { label: "Target" }, position: center });

	for (let i = 0; i < 8; i++) {
		const degrees = i * (360 / 8);
		const radians = degrees * (Math.PI / 180);
		const x = 250 * Math.cos(radians) + center.x;
		const y = 250 * Math.sin(radians) + center.y;

		nodes.push({ id: `${i}`, data: { label: "Source" }, position: { x, y } });

		edges.push({
			id: `edge-${i}`,
			target: "target",
			source: `${i}`,
			type: "floating",
			markerEnd: {
				type: MarkerType.Arrow,
			},
		});
	}

	return { nodes, edges };
}
