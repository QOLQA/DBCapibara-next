"use client";

import React, { useCallback } from "react";
import { type Node } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";
import { ManagedDropdownMenu } from "@fsd/shared/ui/ManagedDropdownMenu";
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@fsd/shared/ui/dropdown-menu";
import { useCanvasStore } from "../../model/canvaStore";
import {
	type CardinalityType,
	type TableData,
	CARDINALITY_OPTIONS,
} from "@fsd/entities/solution";
import { getKeySegment } from "@fsd/shared/lib/utils";

interface NestedTableCardinalityProps {
	tableId: string;
	cardinality: CardinalityType;
}

export const NestedTableCardinality = React.memo(
	({ tableId, cardinality }: NestedTableCardinalityProps) => {
		const { nodes, editNode } = useCanvasStore(
			useShallow((state) => ({
				nodes: state.nodes,
				editNode: state.editNode,
			}))
		);

		const handleCardinalityChange = useCallback(
			(newCardinality: CardinalityType) => {
				const rootId = getKeySegment(tableId, 1);
				const originalNode = nodes.find(
					(node) => node.id === rootId
				) as Node<TableData>;
				if (!originalNode) return;

				let editableNode: Node<TableData>;
				try {
					editableNode = structuredClone(originalNode);
				} catch (error) {
					console.error("Error cloning node:", error);
					return;
				}

				const recursiveUpdateCardinality = (
					nestedTables: TableData,
					layer: number
				): TableData => {
					if (layer > 100) {
						return nestedTables;
					}

					if (nestedTables.id === tableId) {
						return {
							...nestedTables,
							cardinality: newCardinality,
						};
					}

					if (nestedTables.nestedTables && nestedTables.nestedTables.length > 0) {
						const updatedNestedTables = nestedTables.nestedTables.map(
							(nestedTable: TableData) => {
								if (nestedTable.id === tableId) {
									return {
										...nestedTable,
										cardinality: newCardinality,
									};
								}
								return recursiveUpdateCardinality(nestedTable, layer + 1);
							}
						);

						return {
							...nestedTables,
							nestedTables: updatedNestedTables,
						};
					}

					return nestedTables;
				};

				editableNode.data = recursiveUpdateCardinality(editableNode.data, 1);
				editNode(rootId as string, editableNode);
			},
			[nodes, editNode, tableId]
		);

		const handleClick = useCallback((e: React.MouseEvent) => {
			e.stopPropagation();
		}, []);

		return (
			<ManagedDropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						className="ml-2 px-1.5 py-0.5 text-white text-p-sm bg-transparent hover:bg-gray/50 rounded cursor-pointer transition-colors duration-200 border-none outline-none focus:ring-1 focus:ring-lighter-gray/50"
						onClick={handleClick}
					>
						{cardinality}
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="z-50 min-w-[70px]"
					side="right"
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
		);
	}
);

NestedTableCardinality.displayName = "NestedTableCardinality";
