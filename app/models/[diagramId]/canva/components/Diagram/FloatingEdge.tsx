'use client'

import { BaseEdge, getStraightPath, useInternalNode } from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";
import { getEdgeParams } from "@/lib/edges";

/**
 * FloatingEdge is a custom edge component for React Flow that renders a straight edge between two nodes.
 * @param id - The unique edge id
 * @param source - The id of the source node
 * @param target - The id of the target node
 * @param markerEnd - The marker (arrow) at the end of the edge
 * @param style - Optional style for the edge path
 */
export function FloatingEdge({
	id,
	source,
	target,
	markerEnd,
	style,
}: EdgeProps) {
	const sourceNode = useInternalNode(source);
	const targetNode = useInternalNode(target);

	if (!sourceNode || !targetNode) {
		return null;
	}

	const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

	const [path] = getStraightPath({
		sourceX: sx,
		sourceY: sy,
		targetX: tx,
		targetY: ty,
	});

	return (
		<BaseEdge
			id={id}
			className="react-flow__edge-path"
			path={path}
			markerEnd={markerEnd}
			style={style}
		/>
	);
}

export const edgeTypes = {
	floating: FloatingEdge,
};
