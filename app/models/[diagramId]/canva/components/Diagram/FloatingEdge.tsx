"use client";

import { BaseEdge, getSmoothStepPath, useInternalNode } from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";
import { getEdgeParams } from "@/lib/utils/edges";
import { CardinalityLabel } from "./CardinalityLabel";
import type { CardinalityType, EdgeData } from "../../types";

/**
 * FloatingEdge is a custom edge component for React Flow that renders a step edge with 90-degree angles between two nodes.
 * @param id - The unique edge id
 * @param source - The id of the source node
 * @param target - The id of the target node
 * @param markerEnd - The marker (arrow) at the end of the edge
 * @param style - Optional style for the edge path
 * @param data - Optional edge data including cardinality
 */
export function FloatingEdge({
	id,
	source,
	target,
	markerEnd,
	style,
	selected,
	data,
}: EdgeProps) {
	const sourceNode = useInternalNode(source);
	const targetNode = useInternalNode(target);

	if (!sourceNode || !targetNode) {
		return null;
	}

	const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
		sourceNode,
		targetNode
	);

	// Usar getSmoothStepPath para crear una ruta con ángulos de 90 grados
	// borderRadius: 0 para esquinas completamente rectas
	const [path, labelX, labelY] = getSmoothStepPath({
		sourceX: sx,
		sourceY: sy,
		sourcePosition: sourcePos,
		targetX: tx,
		targetY: ty,
		targetPosition: targetPos,
		borderRadius: 0, // Esquinas completamente rectas (90 grados)
	});

	const strokeColor = selected ? "#747474" : "#4e4e4e";
	const strokeWidth = selected ? 2.5 : 2;

	const updatedMarkerEnd =
		selected && markerEnd && typeof markerEnd === "object"
			? {
				...(markerEnd as object),
				color: "#0052cc",
			}
			: markerEnd;

	// Default cardinality if not set
	const edgeData = data as EdgeData | undefined;
	const cardinality: CardinalityType = edgeData?.cardinality ?? "1...n";

	return (
		<>
			<BaseEdge
				id={id}
				className="react-flow__edge-path"
				path={path}
				markerEnd={updatedMarkerEnd as string}
				style={{
					...style,
					strokeDasharray: "8, 4",
					strokeWidth: strokeWidth,
					stroke: strokeColor,
				}}
			/>
			<CardinalityLabel
				edgeId={id}
				labelX={labelX}
				labelY={labelY}
				cardinality={cardinality}
			/>
		</>
	);
}

export const edgeTypes = {
	floating: FloatingEdge,
};
