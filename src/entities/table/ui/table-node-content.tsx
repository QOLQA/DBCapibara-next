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
import ModalDocument from "./modal-document";
import ModalAtributes from "./modal-attributes";
import { getSubmodelColor } from "@fsd/entities/solution/lib/diagram";
import {
	AddDocument,
	Delete,
	Edit,
	Plus,
} from "@fsd/shared/ui/icons/TableOptionsIcons";
import { useTranslation } from "@fsd/shared/i18n/use-translation";
import { NestedTableCardinality } from "./nested-table-cardinality";
import { AttributeNode } from "./attribute-node";
import { useTableNodeContent } from "../model/use-table-node-content";
import type { CardinalityType } from "@fsd/entities/solution";

interface TableNodeContentProps extends TableNodeProps {
	isNested?: boolean;
}

export const TableNodeContent = React.memo(
	({ data, id, isNested = false }: TableNodeContentProps) => {
		const { t } = useTranslation();

		const {
			isDocumentModalOpen,
			isAtributesModalOpen,
			typeAtributesModal,
			atributesToUpdate,
			handleAddAtribute,
			handleAddNestedTable,
			handleEditAtribute,
			handleEditTable,
			handleAddAttributes,
			handleAddDocuments,
			handleDeleteTableClick,
			handleCloseDocumentModal,
			handleCloseAtributesModal,
		} = useTableNodeContent({ id, data });

		const attributeNodes = useMemo(
			() =>
				data.columns?.map((column: Column, index: number) => (
					<React.Fragment key={column.id}>
						<AttributeNode
							column={column}
							columnId={column.id}
							handleEdit={handleEditAtribute}
						/>
						{index < data.columns.length - 1 && (
							<hr className="border border-gray" />
						)}
					</React.Fragment>
				)),
			[data.columns, handleEditAtribute]
		);

		const nestedTableNodes = useMemo(
			() =>
				data.nestedTables?.map((nestedTable: TableData) => (
					<TableNodeContent
						key={nestedTable.id}
						data={nestedTable}
						id={id}
						isNested
					/>
				)),
			[data.nestedTables, id]
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
								<DropdownMenuItem type="normal" onClick={handleEditTable}>
									<Edit className="text-white" />
									{t("common.edit")}
								</DropdownMenuItem>

								<DropdownMenuSeparator className="bg-gray" />
								<DropdownMenuItem type="normal" onClick={handleAddAttributes}>
									<Plus className="text-white" />
									{t("other.addAttributes")}
								</DropdownMenuItem>
								<DropdownMenuSeparator className="bg-gray" />
								<DropdownMenuItem type="normal" onClick={handleAddDocuments}>
									<AddDocument className="text-white" />
									{t("other.addDocuments")}
								</DropdownMenuItem>

								<DropdownMenuSeparator className="bg-gray" />
								<DropdownMenuItem
									type="delete"
									className="text-red"
									onClick={handleDeleteTableClick}
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
				{isDocumentModalOpen && (
					<ModalDocument
						open={isDocumentModalOpen}
						setOpen={handleCloseDocumentModal}
						onSubmit={handleAddNestedTable}
					/>
				)}
				{isAtributesModalOpen && (
					<ModalAtributes
						open={isAtributesModalOpen}
						setOpen={handleCloseAtributesModal}
						onSubmit={handleAddAtribute}
						type={typeAtributesModal}
						atributesToUpdate={
							typeAtributesModal === "update" ? atributesToUpdate : undefined
						}
					/>
				)}
			</>
		);
	}
);

TableNodeContent.displayName = "TableNodeContent";
