"use client";

import { useState, useCallback } from "react";
import { type Node, useReactFlow } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";

import { useCanvasStore } from "@/state/canvaStore";
import { useTableConnections } from "@/hooks/use-node-connections";
import getKeySegment from "@/lib/getKeySegment";

import type { TableData, Column } from "../../../types";
import {
	generateRandomId,
	deleteTableRecursively,
	addAttributeToNestedTables,
	addNestedTableRecursively,
	createNestedTable,
} from "../utils/tableOperations";

interface TableAttribute {
	id: string;
	name: string;
	type: string;
	ableToEdit: boolean;
}

interface UseTableNodeContentProps {
	id: string;
	data: TableData;
}

export const useTableNodeContent = ({ id, data }: UseTableNodeContentProps) => {
	const { setNodes } = useReactFlow();

	// Modal states
	const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
	const [isAtributesModalOpen, setIsAtributesModalOpen] = useState(false);
	const [idNestedTableSelected, setIdNestedTableSelected] = useState<string | null>(null);
	const [typeAtributesModal, setTypeAtributesModal] = useState<"create" | "update">("create");
	const [atributesToUpdate, setAtributesToUpdate] = useState<TableAttribute[]>([]);

	const { nodes, editNode, edges, setEdges, removeNode } = useCanvasStore(
		useShallow((state) => ({
			nodes: state.nodes,
			editNode: state.editNode,
			edges: state.edges,
			setEdges: state.setEdges,
			removeNode: state.removeNode,
		}))
	);

	const { handleNodeRemove } = useTableConnections({
		nodes,
		edges,
		editNode,
		addEdge: () => { },
		setEdges,
	});

	const handleAddAtribute = useCallback(
		(newAtributes: TableAttribute[], typeModal: "create" | "update") => {
			const newAtributesWithId =
				typeModal === "create"
					? newAtributes.map((atribute) => ({
						id: `${idNestedTableSelected}-${generateRandomId()}`,
						name: atribute.name,
						type: atribute.type,
					}))
					: newAtributes;

			setNodes((nodes: Node[]) => {
				return nodes?.map((node: Node) => {
					if (node.id !== id) return node;

					const tableData = node.data as TableData;

					if (tableData.id === idNestedTableSelected) {
						return {
							...node,
							data: {
								...tableData,
								columns:
									typeModal === "create"
										? [...tableData.columns, ...newAtributesWithId]
										: newAtributesWithId,
							},
						};
					}

					if (tableData.nestedTables && tableData.nestedTables.length > 0) {
						return {
							...node,
							data: {
								...tableData,
								nestedTables: addAttributeToNestedTables(
									tableData.nestedTables,
									idNestedTableSelected as string,
									newAtributesWithId as Column[],
									typeModal
								),
							},
						};
					}

					return node;
				});
			});
		},
		[id, idNestedTableSelected, setNodes]
	);

	const handleAddNestedTable = useCallback(
		(tableName: string) => {
			const newNestedTable = createNestedTable(
				idNestedTableSelected as string,
				tableName,
				data.submodelIndex
			);

			setNodes((nodes: Node[]) => {
				return nodes?.map((node: Node) => {
					if (node.id !== id) return node;

					const tableData = node.data as TableData;

					if (tableData.id === idNestedTableSelected) {
						return {
							...node,
							data: {
								...tableData,
								nestedTables: [...(tableData.nestedTables || []), newNestedTable],
							},
						};
					}

					if (tableData.nestedTables && tableData.nestedTables.length > 0) {
						return {
							...node,
							data: {
								...tableData,
								nestedTables: addNestedTableRecursively(
									tableData.nestedTables,
									idNestedTableSelected as string,
									newNestedTable
								),
							},
						};
					}

					return node;
				});
			});
		},
		[id, idNestedTableSelected, setNodes, data.submodelIndex]
	);

	const handleDeleteTable = useCallback(
		(tableId: string) => {
			const numLayers = tableId.split("-").length;
			const rootId = getKeySegment(tableId, 1);
			const originalNode = nodes.find(
				(node) => node.id === rootId
			) as Node<TableData>;

			if (!originalNode) return;

			if (numLayers === 1) {
				removeNode(tableId);
				return;
			}

			let editableNode: Node<TableData>;
			try {
				editableNode = structuredClone(originalNode);
			} catch (error) {
				console.error("Error cloning node:", error);
				return;
			}

			editableNode.data = deleteTableRecursively(editableNode.data, tableId, numLayers, 1);
			editNode(rootId as string, editableNode);
		},
		[nodes, editNode, removeNode]
	);

	const handleFindAtributesToUpdate = useCallback(
		(tableId: string) => {
			const numLayers = tableId.split("-").length;
			let k = 1;
			const node = nodes?.find((node: Node<TableData>) => node.id === id);
			let table = node?.data;

			while (k < numLayers) {
				k = k + 1;
				const segmentedKey = getKeySegment(tableId, k);
				table = table?.nestedTables?.find(
					(table: TableData) => table.id === segmentedKey
				);
			}

			const columns = table?.columns?.map((column: Column) => ({
				...column,
				ableToEdit:
					column.type !== "PRIMARY_KEY" &&
					column.type !== "FOREIGN_KEY" &&
					column.type !== "DOCUMENT",
			}));

			setAtributesToUpdate(columns || []);
		},
		[nodes, id]
	);

	const handleEditAtribute = useCallback(
		(selectedColumn: Column) => {
			const numLayers = selectedColumn.id.split("-").length;
			let k = 1;
			const node = nodes?.find((node: Node<TableData>) => node.id === id);
			let table = node?.data;

			while (k < numLayers - 1) {
				k = k + 1;
				const segmentedKey = getKeySegment(selectedColumn.id, k);
				table = table?.nestedTables?.find(
					(table: TableData) => table.id === segmentedKey
				) as TableData;
			}

			const columns = table?.columns?.map((column: Column) => ({
				...column,
				ableToEdit: column.id === selectedColumn.id,
			}));

			setAtributesToUpdate(columns || []);
			setIdNestedTableSelected(getKeySegment(selectedColumn.id, numLayers - 1));
			setIsAtributesModalOpen(true);
			setTypeAtributesModal("update");
		},
		[nodes, id]
	);

	// Modal handlers
	const handleEditTable = useCallback(() => {
		setIdNestedTableSelected(data.id as string);
		setTypeAtributesModal("update");
		handleFindAtributesToUpdate(data.id as string);
		setIsAtributesModalOpen(true);
	}, [data.id, handleFindAtributesToUpdate]);

	const handleAddAttributes = useCallback(() => {
		setIdNestedTableSelected(data.id as string);
		setTypeAtributesModal("create");
		setIsAtributesModalOpen(true);
	}, [data.id]);

	const handleAddDocuments = useCallback(() => {
		setIdNestedTableSelected(data.id as string);
		setTypeAtributesModal("create");
		setIsDocumentModalOpen(true);
	}, [data.id]);

	const handleDeleteTableClick = useCallback(() => {
		handleDeleteTable(data.id as string);
		handleNodeRemove(data.id as string, nodes);
	}, [handleDeleteTable, data.id, handleNodeRemove, nodes]);

	const handleCloseDocumentModal = useCallback(() => {
		setIsDocumentModalOpen(false);
	}, []);

	const handleCloseAtributesModal = useCallback(() => {
		setIsAtributesModalOpen(false);
	}, []);

	return {
		// Modal states
		isDocumentModalOpen,
		isAtributesModalOpen,
		typeAtributesModal,
		atributesToUpdate,

		// Handlers
		handleAddAtribute,
		handleAddNestedTable,
		handleEditAtribute,
		handleEditTable,
		handleAddAttributes,
		handleAddDocuments,
		handleDeleteTableClick,
		handleCloseDocumentModal,
		handleCloseAtributesModal,
	};
};
