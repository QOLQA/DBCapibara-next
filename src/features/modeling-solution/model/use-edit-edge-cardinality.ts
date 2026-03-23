import { useCallback, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import type { Edge } from "@xyflow/react";
import { useSolutionStore } from "@fsd/entities/solution";
import type { CardinalityType, EdgeData } from "@fsd/entities/solution";

export const useEditEdgeCardinality = (edgeId: string) => {
	const { edges, editEdge } = useSolutionStore(
		useShallow((state) => ({
			edges: state.edges,
			editEdge: state.editEdge,
		})),
	);

	const currentEdge = useMemo(
		() => edges.find((e) => e.id === edgeId),
		[edges, edgeId],
	);

	const handleCardinalityChange = useCallback(
		(newCardinality: CardinalityType) => {
			if (!currentEdge) return;

			const updatedEdge: Edge<EdgeData> = {
				...currentEdge,
				data: {
					...currentEdge.data,
					cardinality: newCardinality,
				},
			};

			editEdge(edgeId, updatedEdge);
		},
		[currentEdge, edgeId, editEdge],
	);

	return { handleCardinalityChange };
};
