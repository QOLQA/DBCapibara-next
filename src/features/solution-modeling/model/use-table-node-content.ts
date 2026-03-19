"use client";

import { useReactFlow } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";

import { useCanvasStore } from "@fsd/features/solution-modeling/model/state/canvaStore";
import { useTableConnect } from "./use-table-connect";
import type { TableData } from "@fsd/entities/solution";
import { useAttributeModal } from "./use-attribute-modal";
import { useDocumentModal } from "./use-document-modal";
import { useAddAttribute } from "./use-add-attribute";
import { useEditAttribute } from "./use-edit-attribute";
import { useDeleteAttribute } from "./use-delete-attribute";
import { useAddNestedTable } from "./use-add-nested-table";
import { useDeleteTable } from "./use-delete-table";
import { useEditTable } from "./use-edit-table";
import { useUpdateCardinality } from "./use-update-cardinality";

interface UseTableNodeContentProps {
	id: string;
	data: TableData;
}

export const useTableNodeContent = ({ id, data }: UseTableNodeContentProps) => {
	const { setNodes } = useReactFlow();
	const { nodes, editNode, edges, setEdges, removeNode } = useCanvasStore(
		useShallow((state) => ({
			nodes: state.nodes,
			editNode: state.editNode,
			edges: state.edges,
			setEdges: state.setEdges,
			removeNode: state.removeNode,
		})),
	);
	const attributeModal = useAttributeModal();
	const documentModal = useDocumentModal();

	const { handleNodeRemove } = useTableConnect({
		nodes,
		edges,
		editNode,
		setEdges,
	});

	const handleAddAtribute = useAddAttribute({
		nodeId: id,
		targetTableId: attributeModal.attributeTargetTableId,
		setNodes,
	});
	const handleAddNestedTable = useAddNestedTable({
		nodeId: id,
		submodelIndex: data.submodelIndex,
		targetTableId: documentModal.documentTargetTableId,
		setNodes,
	});
	const handleEditAtribute = useEditAttribute({
		nodeId: id,
		nodes,
		openUpdateAttributesModal: attributeModal.openUpdateAttributesModal,
	});
	const handleDeleteAttribute = useDeleteAttribute({ nodes, editNode });
	const handleCardinalityChange = useUpdateCardinality({ nodes, editNode });
	const handleEditTable = useEditTable({
		nodeId: id,
		nodes,
		openUpdateAttributesModal: attributeModal.openUpdateAttributesModal,
	});
	const { handleDeleteTable } = useDeleteTable({
		nodes,
		editNode,
		removeNode,
		handleNodeRemove,
	});

	return {
		isDocumentModalOpen: documentModal.isDocumentModalOpen,
		isAtributesModalOpen: attributeModal.isAtributesModalOpen,
		typeAtributesModal: attributeModal.typeAtributesModal,
		atributesToUpdate: attributeModal.atributesToUpdate,
		handleAddAtribute,
		handleAddNestedTable,
		handleEditAtribute,
		handleDeleteAttribute,
		handleCardinalityChange,
		handleEditTable,
		handleAddAttributes: attributeModal.openCreateAttributesModal,
		handleAddDocuments: documentModal.openDocumentModal,
		handleDeleteTableClick: handleDeleteTable,
		handleCloseDocumentModal: documentModal.closeDocumentModal,
		handleCloseAtributesModal: attributeModal.closeAttributesModal,
	};
};
