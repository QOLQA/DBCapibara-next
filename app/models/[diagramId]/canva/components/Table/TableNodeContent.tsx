'use client'

import React, { useState, useCallback, useMemo } from "react";
import { type Node, useReactFlow } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";
import { ManagedDropdownMenu } from "@/components/managedDropdownMenu";
import type {
	AttributeNodeProps,
	TableData,
	TableNodeProps,
	Column,
} from "../../types";
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreButton } from "../Diagram/MoreButton";
// import AtributesModal from "./AtributesModal"
import ModalDocument from "../Modals/ModalDocument";

import { useCanvasStore } from "@/state/canvaStore";
import getKeySegment from "@/lib/getKeySegment";
import ModalAtributes from "../Modals/ModalAtributes";
import { getSubmodelColor } from "@/lib/submodelColors";

import {
	AddDocument,
	Delete,
	Edit,
	Plus,
} from "@/components/icons/TableOptionsIcons";

const AttributeNode = React.memo(
	({ column, columnId, handleEdit }: AttributeNodeProps) => {
		const { nodes, editNode } = useCanvasStore(
			useShallow((state) => ({
				nodes: state.nodes,
				editNode: state.editNode,
			})),
		);

		const handleDeleteAttribute = useCallback(
			(column: Column) => {
				const numLayers = columnId.split("-").length;

				// Get the root node (top-level) from the global nodes state
				const rootId = getKeySegment(columnId, 1);
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

				// If the table is at the first nested level, delete the column directly
				if (numLayers === 2) {
					editableNode.data.columns = editableNode.data.columns.filter(
						(col: Column) => col.id !== column.id,
					);
					editNode(editableNode.id, editableNode);
					return;
				}

				// Recursive function to navigate and delete the column from deeper nested tables
				const recursiveDeleteColumn = (
					nestedTables: TableData,
					layer: number,
				): TableData => {
					if (layer > 100) {
						return nestedTables;
					}

					if (layer === numLayers - 1) {
						nestedTables.columns = nestedTables.columns.filter(
							(col: Column) => col.id !== column.id,
						);
						return nestedTables;
					}

					const nestedTableResultId = getKeySegment(columnId, layer + 1);

					const nestedTableResult = nestedTables.nestedTables?.map(
						(nestedTable: TableData) =>
							nestedTable.id === nestedTableResultId
								? recursiveDeleteColumn(nestedTable, layer + 1)
								: nestedTable,
					) as TableData[];

					return {
						...nestedTables,
						nestedTables: nestedTableResult,
					};
				};

				editableNode.data = recursiveDeleteColumn(editableNode.data, 1);
				editNode(rootId as string, editableNode);
			},
			[nodes, editNode, columnId],
		);

		const handleEditClick = useCallback(() => {
			handleEdit(column);
		}, [handleEdit, column]);

		const handleDeleteClick = useCallback(() => {
			handleDeleteAttribute(column);
		}, [handleDeleteAttribute, column]); const handleMoreClick = useCallback((e: React.MouseEvent) => {
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
									<svg
										width="15"
										height="15"
										viewBox="0 0 15 15"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<title>Trash</title>
										<path
											d="M6.25 3.125H8.75C8.75 2.43464 8.19036 1.875 7.5 1.875C6.80964 1.875 6.25 2.43464 6.25 3.125ZM5.3125 3.125C5.3125 1.91688 6.29188 0.9375 7.5 0.9375C8.70812 0.9375 9.6875 1.91688 9.6875 3.125H13.2812C13.5401 3.125 13.75 3.33487 13.75 3.59375C13.75 3.85263 13.5401 4.0625 13.2812 4.0625H12.4568L11.7243 11.632C11.608 12.8334 10.5984 13.75 9.39144 13.75H5.60856C4.40159 13.75 3.39197 12.8334 3.27571 11.632L2.54317 4.0625H1.71875C1.45987 4.0625 1.25 3.85263 1.25 3.59375C1.25 3.33487 1.45987 3.125 1.71875 3.125H5.3125ZM6.5625 6.09375C6.5625 5.83487 6.35263 5.625 6.09375 5.625C5.83487 5.625 5.625 5.83487 5.625 6.09375V10.7812C5.625 11.0401 5.83487 11.25 6.09375 11.25C6.35263 11.25 6.5625 11.0401 6.5625 10.7812V6.09375ZM8.90625 5.625C9.16513 5.625 9.375 5.83487 9.375 6.09375V10.7812C9.375 11.0401 9.16513 11.25 8.90625 11.25C8.64737 11.25 8.4375 11.0401 8.4375 10.7812V6.09375C8.4375 5.83487 8.64737 5.625 8.90625 5.625ZM4.20885 11.5417C4.2786 12.2625 4.88437 12.8125 5.60856 12.8125H9.39144C10.1156 12.8125 10.7214 12.2625 10.7912 11.5417L11.5149 4.0625H3.48505L4.20885 11.5417Z"
											fill="#E93544"
										/>
									</svg>
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

/**
 * TableNodeContent component displays the content of a table node,
 * including its header, attributes, and nested tables.
 *
 * Props:
 * - All properties from TableNodeProps (data: TableData, id: string)
 * - handleDeleteTable: function to handle table deletion
 * - handleAddAtribute: function to handle attribute addition
 * - handleAddNestedTable: function to handle nested table addition
 */

interface TableAttribute {
	id: string;
	name: string;
	type: string;
	ableToEdit: boolean;
}

export const TableNodeContent = React.memo(({ data, id }: TableNodeProps) => {
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
		[id, idNestedTableSelected, setNodes, generateRandomId],
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
		[data.columns, handleEditAtribute],
	);

	const nestedTableNodes = useMemo(
		() =>
			data.nestedTables?.map((nestedTable: TableData) => (
				<TableNodeContent key={nestedTable.id} data={nestedTable} id={id} />
			)),
		[data.nestedTables, id],
	);

	const headerColor = useMemo(() => {
		const submodelIndex = data.submodelIndex ?? 0;
		return getSubmodelColor(submodelIndex);
	}, [data.submodelIndex]);

	return (
		<>
			<div className="table">
				<div
					className="table-header text-white"
					style={{ backgroundColor: headerColor }}
				>
					<span>{data.label}</span>

					<ManagedDropdownMenu>
						<DropdownMenuTrigger asChild>
							<MoreButton className="hover:text-lighter-gray" />
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="z-50 "
							side="right"
							variant="menu-1"
						>
							<DropdownMenuItem type="normal" onClick={handleEditTable}>
								<Edit className="text-white" />
								Edit
							</DropdownMenuItem>

							<DropdownMenuSeparator className="bg-gray" />
							<DropdownMenuItem type="normal" onClick={handleAddAttributes}>
								<Plus className="text-white" />
								Add attributes
							</DropdownMenuItem>
							<DropdownMenuSeparator className="bg-gray" />
							<DropdownMenuItem type="normal" onClick={handleAddDocuments}>
								<AddDocument className="text-white" />
								Add documents
							</DropdownMenuItem>

							<DropdownMenuSeparator className="bg-gray" />
							<DropdownMenuItem
								type="delete"
								className="text-red"
								onClick={handleDeleteTableClick}
							>
								<Delete className="text-red" />
								Delete table	
							</DropdownMenuItem>
						</DropdownMenuContent>
					</ManagedDropdownMenu>
				</div>
				{/* table content */}
				<div className="table-content">
					{/* table attributes */}
					<div className="table-attributes">{attributeNodes}</div>
					{data.nestedTables && data.nestedTables.length > 0 && (
						// table nested
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
