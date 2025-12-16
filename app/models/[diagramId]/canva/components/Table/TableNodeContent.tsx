'use client'

import React, { useMemo } from "react";
import type {
	TableData,
	TableNodeProps,
} from "../../types";
import ModalDocument from "../Modals/ModalDocument";
import ModalAtributes from "../Modals/ModalAtributes";
import { TableHeader } from "./TableHeader";
import { TableAttributes } from "./TableAttributes";
import { useTableOperations } from "../../hooks/useTableOperations";

/**
 * TableNodeContent component displays the content of a table node,
 * including its header, attributes, and nested tables.
 *
 * Props:
 * - All properties from TableNodeProps (data: TableData, id: string)
 */

export const TableNodeContent = React.memo(({ data, id }: TableNodeProps) => {
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
	} = useTableOperations(id, data);

	const nestedTableNodes = useMemo(
		() =>
			data.nestedTables?.map((nestedTable: TableData) => (
				<TableNodeContent key={nestedTable.id} data={nestedTable} id={id} />
			)),
		[data.nestedTables, id],
	);

	return (
		<>
			<div className="table">
				<TableHeader
					label={data.label}
					submodelIndex={data.submodelIndex}
					onEdit={handleEditTable}
					onAddAttributes={handleAddAttributes}
					onAddDocuments={handleAddDocuments}
					onDelete={handleDeleteTableClick}
				/>
				<div className="table-content">
					<TableAttributes
						columns={data.columns}
						onEditAttribute={handleEditAtribute}
					/>
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
});
