"use client";

import React, { useCallback, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { ManagedDropdownMenu } from "@/components/managedDropdownMenu";
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCanvasStore } from "@/state/canvaStore";
import {
	type CardinalityType,
	type EdgeData,
	CARDINALITY_OPTIONS,
} from "../../types";
import type { Edge } from "@xyflow/react";

interface CardinalityLabelProps {
	edgeId: string;
	labelX: number;
	labelY: number;
	cardinality: CardinalityType;
}

export const CardinalityLabel = React.memo(
	({ edgeId, labelX, labelY, cardinality }: CardinalityLabelProps) => {
		const { edges, editEdge } = useCanvasStore(
			useShallow((state) => ({
				edges: state.edges,
				editEdge: state.editEdge,
			}))
		);

		const currentEdge = useMemo(
			() => edges.find((e) => e.id === edgeId),
			[edges, edgeId]
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
			[currentEdge, edgeId, editEdge]
		);

		const handleClick = useCallback((e: React.MouseEvent) => {
			e.stopPropagation();
		}, []);

		return (
			<foreignObject
				width={80}
				height={30}
				x={labelX - 40}
				y={labelY - 15}
				className="overflow-visible pointer-events-auto"
				requiredExtensions="http://www.w3.org/1999/xhtml"
			>
				<div
					className="flex items-center justify-center w-full h-full"
					onClick={handleClick}
				>
					<ManagedDropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className="px-2 py-1 text-lighter-gray text-p-sm bg-transparent hover:bg-secondary-gray/80 rounded cursor-pointer transition-colors duration-200 border-none outline-none focus:ring-1 focus:ring-lighter-gray/50"
								onClick={handleClick}
							>
								{cardinality}
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="z-50 min-w-[70px]"
							side="top"
							align="center"
							variant="menu-1"
						>
							{CARDINALITY_OPTIONS.map((option) => (
								<DropdownMenuItem
									key={option}
									type="normal"
									onClick={() => handleCardinalityChange(option)}
									className={
										option === cardinality
											? "bg-gray text-white"
											: "text-lighter-gray"
									}
								>
									{option}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</ManagedDropdownMenu>
				</div>
			</foreignObject>
		);
	}
);

CardinalityLabel.displayName = "CardinalityLabel";
