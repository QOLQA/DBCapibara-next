'use client'

import React from "react";
import { ManagedDropdownMenu } from "@/components/managedDropdownMenu";
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreButton } from "../Diagram/MoreButton";
import {
	AddDocument,
	Delete,
	Edit,
	Plus,
} from "@/components/icons/TableOptionsIcons";
import { getSubmodelColor } from "@/lib/utils/colors";

interface TableHeaderProps {
	label: string;
	submodelIndex?: number;
	onEdit: () => void;
	onAddAttributes: () => void;
	onAddDocuments: () => void;
	onDelete: () => void;
}

export const TableHeader = React.memo(({
	label,
	submodelIndex = 0,
	onEdit,
	onAddAttributes,
	onAddDocuments,
	onDelete,
}: TableHeaderProps) => {
	const headerColor = getSubmodelColor(submodelIndex);

	return (
		<div
			className="table-header text-white"
			style={{ backgroundColor: headerColor }}
		>
			<span>{label}</span>

			<ManagedDropdownMenu>
				<DropdownMenuTrigger asChild>
					<MoreButton className="hover:text-lighter-gray" />
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="z-50 "
					side="right"
					variant="menu-1"
				>
					<DropdownMenuItem type="normal" onClick={onEdit}>
						<Edit className="text-white" />
						Edit
					</DropdownMenuItem>

					<DropdownMenuSeparator className="bg-gray" />
					<DropdownMenuItem type="normal" onClick={onAddAttributes}>
						<Plus className="text-white" />
						Add attributes
					</DropdownMenuItem>
					<DropdownMenuSeparator className="bg-gray" />
					<DropdownMenuItem type="normal" onClick={onAddDocuments}>
						<AddDocument className="text-white" />
						Add documents
					</DropdownMenuItem>

					<DropdownMenuSeparator className="bg-gray" />
					<DropdownMenuItem
						type="delete"
						className="text-red"
						onClick={onDelete}
					>
						<Delete className="text-red" />
						Delete table
					</DropdownMenuItem>
				</DropdownMenuContent>
			</ManagedDropdownMenu>
		</div>
	);
});

TableHeader.displayName = 'TableHeader';
