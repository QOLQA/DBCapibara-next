"use client";

import type { TableNodeProps } from "@fsd/entities/solution";
import { TableNodeContent } from "@fsd/entities/table";
import {
	ModalAtributes,
	ModalDocument,
	useTableNodeContent,
} from "@fsd/features/modeling-solution";

interface TableNodeContainerProps extends TableNodeProps {
	isNested?: boolean;
}

export function TableNodeContainer({
	data,
	id,
	isNested = false,
}: TableNodeContainerProps) {
	const {
		isDocumentModalOpen,
		isAtributesModalOpen,
		typeAtributesModal,
		atributesToUpdate,
		handleAddAtribute,
		handleAddNestedTable,
		handleEditAtribute,
		handleDeleteAttribute,
		handleCardinalityChange,
		handleEditTable,
		handleAddAttributes,
		handleAddDocuments,
		handleDeleteTableClick,
		handleCloseDocumentModal,
		handleCloseAtributesModal,
	} = useTableNodeContent({ id, data });

	return (
		<>
			<TableNodeContent
				data={data}
				id={id}
				isNested={isNested}
				onEditTable={handleEditTable}
				onAddAttributes={handleAddAttributes}
				onAddDocuments={handleAddDocuments}
				onDeleteTable={handleDeleteTableClick}
				onCardinalityChange={handleCardinalityChange}
				onEditAttribute={handleEditAtribute}
				onDeleteAttribute={handleDeleteAttribute}
			/>
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
