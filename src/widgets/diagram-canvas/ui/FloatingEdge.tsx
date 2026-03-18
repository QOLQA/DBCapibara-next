"use client";

import { BaseEdge, getSmoothStepPath, useInternalNode } from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";
import { getEdgeParams } from "@fsd/entities/solution/lib/diagram";
import { CardinalityLabel } from "./CardinalityLabel";
import type { CardinalityType, EdgeData } from "@fsd/entities/solution";

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

	const [path, labelX, labelY] = getSmoothStepPath({
		sourceX: sx,
		sourceY: sy,
		sourcePosition: sourcePos,
		targetX: tx,
		targetY: ty,
		targetPosition: targetPos,
		borderRadius: 0,
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

	const edgeData = data as EdgeData | undefined;
	const cardinality: CardinalityType = edgeData?.cardinality ?? "1 ... n";

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
