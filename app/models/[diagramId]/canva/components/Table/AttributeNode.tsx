'use client'

import React, { useCallback } from "react";
import { type Node } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";
import { ManagedDropdownMenu } from "@/components/managedDropdownMenu";
import type { Column, TableData } from "../../types";
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreButton } from "../Diagram/MoreButton";
import { useCanvasStore } from "@/state/canvaStore";
import getKeySegment from "@/lib/getKeySegment";
import {
	Delete,
	Edit,
} from "@/components/icons/TableOptionsIcons";

interface AttributeNodeProps {
	column: Column;
	columnId: string;
	handleEdit: (column: Column) => void;
}

export const AttributeNode = React.memo(
	({ column, columnId, handleEdit }: AttributeNodeProps) => {
		const { nodes, editNode } = useCanvasStore(
			useShallow((state) => ({
				nodes: state.nodes,
				editNode: state.editNode,
			})),
		);

		const handleDeleteAttribute = useCallback(
			(column: Column) => {
				const numLayers = columnId.split("-").length;

				// Get the root node (top-level) from the global nodes state
				const rootId = getKeySegment(columnId, 1);
				const originalNode = nodes.find(
					(node) => node.id === rootId,
				) as Node<TableData>;
				if (!originalNode) return;

				// Create a deep copy of the node to safely modify it
				let editableNode: Node<TableData>;
				try {
					editableNode = structuredClone(originalNode);
				} catch (error) {
					console.error("Error cloning node:", error);
					return;
				}

				// If the table is at the first nested level, delete the column directly
				if (numLayers === 2) {
					editableNode.data.columns = editableNode.data.columns.filter(
						(col: Column) => col.id !== column.id,
					);
					editNode(editableNode.id, editableNode);
					return;
				}

				// Recursive function to navigate and delete the column from deeper nested tables
				const recursiveDeleteColumn = (
					nestedTables: TableData,
					layer: number,
				): TableData => {
					if (layer > 100) {
						return nestedTables;
					}

					if (layer === numLayers - 1) {
						nestedTables.columns = nestedTables.columns.filter(
							(col: Column) => col.id !== column.id,
						);
						return nestedTables;
					}

					const nestedTableResultId = getKeySegment(columnId, layer + 1);

					const nestedTableResult = nestedTables.nestedTables?.map(
						(nestedTable: TableData) =>
							nestedTable.id === nestedTableResultId
								? recursiveDeleteColumn(nestedTable, layer + 1)
								: nestedTable,
					) as TableData[];

					return {
						...nestedTables,
						nestedTables: nestedTableResult,
					};
				};

				editableNode.data = recursiveDeleteColumn(editableNode.data, 1);
				editNode(rootId as string, editableNode);
			},
			[nodes, editNode, columnId],
		);

		const handleEditClick = useCallback(() => {
			handleEdit(column);
		}, [handleEdit, column]);

		const handleDeleteClick = useCallback(() => {
			handleDeleteAttribute(column);
		}, [handleDeleteAttribute, column]);

		const handleMoreClick = useCallback((e: React.MouseEvent) => {
			e.stopPropagation();
		}, []);

		return (
			<div className="table-attribute">
				<span className="text-white">{column.name}</span>
				<div>
					<span className="text-lighter-gray">{column.type}</span>
					<div className="table-attribute__options">
						<ManagedDropdownMenu>
							{column.type !== "PRIMARY_KEY" &&
								column.type !== "FOREIGN_KEY" ? (
								<DropdownMenuTrigger asChild>
									<MoreButton
										className="text-lighter-gray "
										onClick={handleMoreClick}
									/>
								</DropdownMenuTrigger>
							) : (
								<div className="w-4 h-8 " />
							)}
							<DropdownMenuContent
								className="z-50 "
								side="right"
								variant="menu-1"
							>
								<DropdownMenuItem type="normal" onClick={handleEditClick}>
									<Edit className="text-white" />
									Edit
								</DropdownMenuItem>
								<DropdownMenuSeparator className="bg-gray" />
								<DropdownMenuItem
									type="delete"
									className="text-red"
									onClick={handleDeleteClick}
								>
									<svg
										width="15"
										height="15"
										viewBox="0 0 15 15"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<title>Trash</title>
										<path
											d="M6.25 3.125H8.75C8.75 2.43464 8.19036 1.875 7.5 1.875C6.80964 1.875 6.25 2.43464 6.25 3.125ZM5.3125 3.125C5.3125 1.91688 6.29188 0.9375 7.5 0.9375C8.70812 0.9375 9.6875 1.91688 9.6875 3.125H13.2812C13.5401 3.125 13.75 3.33487 13.75 3.59375C13.75 3.85263 13.5401 4.0625 13.2812 4.0625H12.4568L11.7243 11.632C11.608 12.8334 10.5984 13.75 9.39144 13.75H5.60856C4.40159 13.75 3.39197 12.8334 3.27571 11.632L2.54317 4.0625H1.71875C1.45987 4.0625 1.25 3.85263 1.25 3.59375C1.25 3.33487 1.45987 3.125 1.71875 3.125H5.3125ZM6.5625 6.09375C6.5625 5.83487 6.35263 5.625 6.09375 5.625C5.83487 5.625 5.625 5.83487 5.625 6.09375V10.7812C5.625 11.0401 5.83487 11.25 6.09375 11.25C6.35263 11.25 6.5625 11.0401 6.5625 10.7812V6.09375ZM8.90625 5.625C9.16513 5.625 9.375 5.83487 9.375 6.09375V10.7812C9.375 11.0401 9.16513 11.25 8.90625 11.25C8.64737 11.25 8.4375 11.0401 8.4375 10.7812V6.09375C8.4375 5.83487 8.64737 5.625 8.90625 5.625ZM4.20885 11.5417C4.2786 12.2625 4.88437 12.8125 5.60856 12.8125H9.39144C10.1156 12.8125 10.7214 12.2625 10.7912 11.5417L11.5149 4.0625H3.48505L4.20885 11.5417Z"
											fill="#E93544"
										/>
									</svg>
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</ManagedDropdownMenu>
					</div>
				</div>
			</div>
		);
	},
);

AttributeNode.displayName = 'AttributeNode';
