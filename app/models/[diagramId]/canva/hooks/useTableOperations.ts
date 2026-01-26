'use client'

import { useState, useCallback } from "react";
import { type Node, useReactFlow } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";
import type { Column, TableData } from "../types";
import { useCanvasStore } from "@/state/canvaStore";
import getKeySegment from "@/lib/utils/keys";

interface TableAttribute {
	id: string;
	name: string;
	type: string;
	ableToEdit: boolean;
}

export const useTableOperations = (id: string, data: TableData) => {
	const { setNodes } = useReactFlow();
	const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
	const [isAtributesModalOpen, setIsAtributesModalOpen] = useState(false);
	const [idNestedTableSelected, setIdNestedTableSelected] = useState<
		string | null
	>(null);
	const [typeAtributesModal, setTypeAtributesModal] = useState<
		"create" | "update"
	>("create");
	const [atributesToUpdate, setAtributesToUpdate] = useState<TableAttribute[]>(
		[],
	);

	const { nodes, editNode, removeNode } = useCanvasStore(
		useShallow((state) => ({
			nodes: state.nodes,
			editNode: state.editNode,
			removeNode: state.removeNode,
		})),
	);

	const generateRandomId = useCallback(() => {
		const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
		let result = "";
		for (let i = 0; i < 8; i++) {
			result += characters.charAt(
				Math.floor(Math.random() * characters.length),
			);
		}
		return result;
	}, []);

	const handleAddAtribute = useCallback(
		(newAtributes: TableAttribute[], typeModal: "create" | "update") => {
			const generateNewAtributes = (newAtributes: TableAttribute[]) => {
				return newAtributes.map((atribute: TableAttribute) => ({
					id: `${idNestedTableSelected}-${generateRandomId()}`,
					name: atribute.name,
					type: atribute.type,
				}));
			};

			const newAtributesWithId =
				typeModal === "create"
					? generateNewAtributes(newAtributes)
					: newAtributes;

			setNodes((nodes: Node[]) => {
				return nodes?.map((node: Node) => {
					if (node.id === id) {
						const tableData = node.data as TableData;

						// Recursive function to add attribute in nested tables
						const addAttributeToNested = (
							nestedTables: TableData[],
						): TableData[] => {
							return nestedTables?.map((table: TableData) => {
								if (table.id === idNestedTableSelected) {
									return {
										...table,
										columns:
											typeModal === "create"
												? [...table.columns, ...newAtributesWithId]
												: newAtributesWithId,
									};
								}

								if (table.nestedTables && table.nestedTables.length > 0) {
									return {
										...table,
										nestedTables: addAttributeToNested(table.nestedTables),
									};
								}

								return table;
							});
						};

						// If the table to modify is the main one
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

						// If the table is in the nested ones
						if (tableData.nestedTables && tableData.nestedTables.length > 0) {
							return {
								...node,
								data: {
									...tableData,
									nestedTables: addAttributeToNested(tableData.nestedTables),
								},
							};
						}
					}
					return node;
				});
			});
		},
		[id, idNestedTableSelected, setNodes, generateRandomId],
	);

	const handleAddNestedTable = useCallback(
		(tableName: string) => {
			const newNestedTable: TableData = {
				id: `${idNestedTableSelected}-${generateRandomId()}`,
				label: tableName,
				columns: [
					{
						id: `${idNestedTableSelected}-${generateRandomId()}`,
						name: `${tableName}_id`,
						type: "PRIMARY_KEY",
					},
				],
				nestedTables: [],
				submodelIndex: data.submodelIndex,
			};

			setNodes((nodes: Node[]) => {
				return nodes?.map((node: Node) => {
					if (node.id === id) {
						const tableData = node.data as TableData;

						// Recursive function to add nested table to nested tables
						const addNestedTableToNested = (
							nestedTables: TableData[],
						): TableData[] => {
							return nestedTables?.map((table: TableData) => {
								if (table.id === idNestedTableSelected) {
									// If we find the table, add the new nested table
									return {
										...table,
										nestedTables: [
											...(table.nestedTables || []),
											newNestedTable,
										],
									};
								}

								// If it's not this table, search in the nested ones
								if (table.nestedTables && table.nestedTables.length > 0) {
									return {
										...table,
										nestedTables: addNestedTableToNested(table.nestedTables),
									};
								}

								return table;
							});
						};

						// If the table to modify is the main one
						if (tableData.id === idNestedTableSelected) {
							return {
								...node,
								data: {
									...tableData,
									nestedTables: [
										...(tableData.nestedTables || []),
										newNestedTable,
									],
								},
							};
						}

						// If the table is in the nested ones
						if (tableData.nestedTables && tableData.nestedTables.length > 0) {
							return {
								...node,
								data: {
									...tableData,
									nestedTables: addNestedTableToNested(tableData.nestedTables),
								},
							};
						}
					}
					return node;
				});
			});
		},
		[id, idNestedTableSelected, setNodes, generateRandomId, data.submodelIndex],
	);

	const handleDeleteTable = useCallback(
		(tableId: string) => {
			const numLayers = tableId.split("-").length;

			// Get the root node (top-level) from the global nodes state
			const rootId = getKeySegment(tableId, 1);
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

			// If the table is at the first nested level, delete the table directly
			if (numLayers === 1) {
				removeNode(tableId);
				return;
			}

			// Recursive function to navigate and delete the nestedTable from deeper nested tables
			const recursiveDeleteTable = (
				nestedTables: TableData,
				layer: number,
			): TableData => {
				if (layer === numLayers - 1) {
					nestedTables.nestedTables = nestedTables.nestedTables?.filter(
						(nestedTable: TableData) => nestedTable.id !== tableId,
					);
					return nestedTables;
				}

				const nestedTableResultId = getKeySegment(tableId, layer + 1);
				const nestedTableResult = nestedTables.nestedTables?.map(
					(nestedTable: TableData) =>
						nestedTable.id === nestedTableResultId
							? recursiveDeleteTable(nestedTable, layer + 1)
							: nestedTable,
				) as TableData[];

				return {
					...nestedTables,
					nestedTables: nestedTableResult,
				};
			};

			editableNode.data = recursiveDeleteTable(editableNode.data, 1);
			editNode(rootId as string, editableNode);
		},
		[nodes, editNode, removeNode],
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
					(table: TableData) => table.id === segmentedKey,
				);
			}
			// add an atribute to each column called "ableToEdit" and set it to true
			const columns = table?.columns?.map((column: Column) => ({
				...column,
				ableToEdit:
					column.type !== "PRIMARY_KEY" &&
					column.type !== "FOREIGN_KEY" &&
					column.type !== "DOCUMENT",
			}));

			setAtributesToUpdate(columns || []);
		},
		[nodes, id],
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
					(table: TableData) => table.id === segmentedKey,
				) as TableData;
			}
			// add an atribute to each column called "ableToEdit" and set it to true
			const columns = table?.columns?.map((column: Column) => ({
				...column,
				ableToEdit: column.id === selectedColumn.id,
			}));

			setAtributesToUpdate(columns || []);
			setIsAtributesModalOpen(true);
			setTypeAtributesModal("update");
		},
		[nodes, id],
	);

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
	}, [handleDeleteTable, data.id]);

	const handleCloseDocumentModal = useCallback(() => {
		setIsDocumentModalOpen(false);
	}, []);

	const handleCloseAtributesModal = useCallback(() => {
		setIsAtributesModalOpen(false);
	}, []);

	return {
		// Modal state
		isDocumentModalOpen,
		isAtributesModalOpen,
		typeAtributesModal,
		atributesToUpdate,

		// Handlers
		handleAddAtribute,
		handleAddNestedTable,
		handleDeleteTable,
		handleEditAtribute,
		handleEditTable,
		handleAddAttributes,
		handleAddDocuments,
		handleDeleteTableClick,
		handleCloseDocumentModal,
		handleCloseAtributesModal,
	};
};
