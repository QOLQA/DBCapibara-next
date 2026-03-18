"use client";

import React, { useCallback } from "react";
import { type Node } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";
import { ManagedDropdownMenu } from "@fsd/shared/ui/ManagedDropdownMenu";
import type { Column, TableData } from "@fsd/entities/solution";
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@fsd/shared/ui/dropdown-menu";
import { MoreButton } from "@fsd/shared/ui/MoreButton";
import { useCanvasStore } from "@fsd/features/solution-modeling/model/canvaStore";
import { getKeySegment } from "@fsd/entities/solution/lib/diagram";
import { Delete, Edit } from "@fsd/shared/ui/icons/TableOptionsIcons";

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
			}))
		);

		const handleDeleteAttribute = useCallback(
			(columnToDelete: Column) => {
				const numLayers = columnId.split("-").length;

				const rootId = getKeySegment(columnId, 1);
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

				if (numLayers === 2) {
					editableNode.data.columns = editableNode.data.columns.filter(
						(col: Column) => col.id !== columnToDelete.id
					);
					editNode(editableNode.id, editableNode);
					return;
				}

				const recursiveDeleteColumn = (
					nestedTables: TableData,
					layer: number
				): TableData => {
					if (layer > 100) {
						return nestedTables;
					}

					if (layer === numLayers - 1) {
						nestedTables.columns = nestedTables.columns.filter(
							(col: Column) => col.id !== columnToDelete.id
						);
						return nestedTables;
					}

					const nestedTableResultId = getKeySegment(columnId, layer + 1);

					const nestedTableResult = nestedTables.nestedTables?.map(
						(nestedTable: TableData) =>
							nestedTable.id === nestedTableResultId
								? recursiveDeleteColumn(nestedTable, layer + 1)
								: nestedTable
					) as TableData[];

					return {
						...nestedTables,
						nestedTables: nestedTableResult,
					};
				};

				editableNode.data = recursiveDeleteColumn(editableNode.data, 1);
				editNode(rootId as string, editableNode);
			},
			[nodes, editNode, columnId]
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
									<Delete className="text-red" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</ManagedDropdownMenu>
					</div>
				</div>
			</div>
		);
	}
);

AttributeNode.displayName = "AttributeNode";
