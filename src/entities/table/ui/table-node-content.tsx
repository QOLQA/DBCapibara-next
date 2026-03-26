"use client";

import React, { useMemo } from "react";

import { ManagedDropdownMenu } from "@fsd/shared/ui/ManagedDropdownMenu";
import type { TableData, TableNodeProps, Column } from "@fsd/entities/solution";
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@fsd/shared/ui/dropdown-menu";
import { MoreButton } from "@fsd/shared/ui/MoreButton";
import { getSubmodelColor } from "@fsd/shared/lib/xyflow";
import {
	AddDocument,
	Delete,
	Edit,
	Plus,
} from "@fsd/shared/ui/icons/TableOptionsIcons";
import { useTranslation } from "@fsd/shared/i18n/use-translation";
import { NestedTableCardinality } from "./nested-table-cardinality";
import { AttributeNode } from "./attribute-node";
import type { CardinalityType } from "@fsd/entities/solution";

interface TableNodeContentProps extends TableNodeProps {
	isNested?: boolean;
	onEditTable?: (tableId: string) => void;
	onAddAttributes?: (tableId: string) => void;
	onAddDocuments?: (tableId: string) => void;
	onDeleteTable?: (tableId: string) => void;
	onCardinalityChange?: (
		tableId: string,
		newCardinality: CardinalityType
	) => void;
	onEditAttribute?: (column: Column) => void;
	onDeleteAttribute?: (columnId: string) => void;
}

export const TableNodeContent = React.memo(
	({
		data,
		id,
		isNested = false,
		onEditTable = () => {},
		onAddAttributes = () => {},
		onAddDocuments = () => {},
		onDeleteTable = () => {},
		onCardinalityChange = () => {},
		onEditAttribute = () => {},
		onDeleteAttribute = () => {},
	}: TableNodeContentProps) => {
		const { t } = useTranslation();

		const attributeNodes = useMemo(
			() =>
				data.columns?.map((column: Column, index: number) => (
					<React.Fragment key={column.id}>
						<AttributeNode
							column={column}
							columnId={column.id}
							handleEdit={onEditAttribute}
							handleDelete={onDeleteAttribute}
						/>
						{index < data.columns.length - 1 && (
							<hr className="border border-gray" />
						)}
					</React.Fragment>
				)),
			[data.columns, onEditAttribute, onDeleteAttribute]
		);

		const nestedTableNodes = useMemo(
			() =>
				data.nestedTables?.map((nestedTable: TableData) => (
					<TableNodeContent
						key={nestedTable.id}
						data={nestedTable}
						id={id}
						isNested
						onEditTable={onEditTable}
						onAddAttributes={onAddAttributes}
						onAddDocuments={onAddDocuments}
						onDeleteTable={onDeleteTable}
						onCardinalityChange={onCardinalityChange}
						onEditAttribute={onEditAttribute}
						onDeleteAttribute={onDeleteAttribute}
					/>
				)),
			[
				data.nestedTables,
				id,
				onEditTable,
				onAddAttributes,
				onAddDocuments,
				onDeleteTable,
				onCardinalityChange,
				onEditAttribute,
				onDeleteAttribute,
			]
		);

		const headerColor = useMemo(() => {
			const submodelIndex = data.submodelIndex ?? 0;
			return getSubmodelColor(submodelIndex);
		}, [data.submodelIndex]);

		return (
			<>
				<div className={isNested ? "table nested-table" : "table"}>
					<div
						className="table-header text-white"
						style={{ backgroundColor: headerColor }}
					>
						<div className="flex items-center">
							<span>{data.label}</span>
							{isNested && (
								<NestedTableCardinality
									tableId={data.id}
									cardinality={
										(data.cardinality as CardinalityType) ?? "1...n"
									}
									onCardinalityChange={onCardinalityChange}
								/>
							)}
						</div>

						<ManagedDropdownMenu>
							<DropdownMenuTrigger asChild>
								<MoreButton className="hover:text-lighter-gray" />
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="z-50"
								side="right"
								variant="menu-1"
							>
								<DropdownMenuItem
									type="normal"
									onClick={() => onEditTable(data.id)}
								>
									<Edit className="text-white" />
									{t("common.edit")}
								</DropdownMenuItem>

								<DropdownMenuSeparator className="bg-gray" />
								<DropdownMenuItem
									type="normal"
									onClick={() => onAddAttributes(data.id)}
								>
									<Plus className="text-white" />
									{t("other.addAttributes")}
								</DropdownMenuItem>
								<DropdownMenuSeparator className="bg-gray" />
								<DropdownMenuItem
									type="normal"
									onClick={() => onAddDocuments(data.id)}
								>
									<AddDocument className="text-white" />
									{t("other.addDocuments")}
								</DropdownMenuItem>

								<DropdownMenuSeparator className="bg-gray" />
								<DropdownMenuItem
									type="delete"
									className="text-red"
									onClick={() => onDeleteTable(data.id)}
								>
									<Delete className="text-red" />
									{t("common.delete")}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</ManagedDropdownMenu>
					</div>
					<div className="table-content">
						<div className="table-attributes">{attributeNodes}</div>
						{data.nestedTables && data.nestedTables.length > 0 && (
							<div className="table-nesteds">{nestedTableNodes}</div>
						)}
					</div>
				</div>
			</>
		);
	}
);

TableNodeContent.displayName = "TableNodeContent";
