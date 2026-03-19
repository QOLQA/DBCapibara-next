"use client";

import React, { useCallback } from "react";
import { ManagedDropdownMenu } from "@fsd/shared/ui/ManagedDropdownMenu";
import type { Column } from "@fsd/entities/solution";
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@fsd/shared/ui/dropdown-menu";
import { MoreButton } from "@fsd/shared/ui/MoreButton";
import { Delete, Edit } from "@fsd/shared/ui/icons/TableOptionsIcons";

interface AttributeNodeProps {
	column: Column;
	columnId: string;
	handleEdit: (column: Column) => void;
	handleDelete: (columnId: string) => void;
}

export const AttributeNode = React.memo(
	({ column, columnId, handleEdit, handleDelete }: AttributeNodeProps) => {
		const handleEditClick = useCallback(() => {
			handleEdit(column);
		}, [handleEdit, column]);

		const handleDeleteClick = useCallback(() => {
			handleDelete(columnId);
		}, [handleDelete, columnId]);

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
	},
);

AttributeNode.displayName = "AttributeNode";
