'use client'

import { useCallback, useState, useMemo } from "react";
import {
	ReactFlow,
	Background,
	Controls,
	MiniMap,
	MarkerType,
} from "@xyflow/react";
import type { Node } from "@xyflow/react";
import type { TableData } from "../../types";

import { nodeTypes } from "../Table/TableNode";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import ShowErrorModal from "../Modals/ShowErrorModal";
import { edgeTypes } from "./FloatingEdge";
import { useTableConnections } from "@/hooks/use-node-connections";
import ModalAddCollection from "../Modals/ModalAddCollection";
import { canvaSelector, useCanvasStore } from "@/state/canvaStore";
import { useShallow } from "zustand/shallow";
import { useUniqueId } from "@/hooks/use-unique-id";

const connectionLineStyle = {
	stroke: "#4E4E4E",
	strokeWidth: 3,
};

const defaultEdgeOptions = {
	type: "floating",
	style: connectionLineStyle,
	markerEnd: { type: MarkerType.ArrowClosed },
};

const DatabaseDiagram = () => {
	const {
		nodes,
		edges,
		addNode,
		editNode,
		addEdge,
		onNodesChange,
		onEdgesChange,
	} = useCanvasStore<ReturnType<typeof canvaSelector>>(
		useShallow(canvaSelector),
	);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [showError, setShowError] = useState(false);
	const generateId = useUniqueId();

	const connectionConfig = useMemo(
		() => ({
			nodes,
			editNode,
			addEdge,
			onError: () => setShowError(true),
		}),
		[nodes, editNode, addEdge],
	);

	const { handleConnect } = useTableConnections(connectionConfig);

	const handleAddDocument = useCallback(
		(name: string) => {
			const newIdNode = generateId();

			// Calculate the next available submodelIndex
			const existingIndices = nodes
				.map(node => node.data.submodelIndex ?? 0)
				.filter(index => index !== undefined);
			const maxIndex = existingIndices.length > 0 ? Math.max(...existingIndices) : -1;
			const newSubmodelIndex = maxIndex + 1;

			const newNode: Node<TableData> = {
				id: newIdNode,
				position: { x: Math.random() * 400, y: Math.random() * 400 },
				data: {
					id: newIdNode,
					label: name,
					columns: [
						{
							id: `${newIdNode}-${generateId()}`,
							name: `${name}_id`,
							type: "PRIMARY_KEY",
						},
					],
					submodelIndex: newSubmodelIndex,
				},
				type: "table",
			};

			addNode(newNode);
		},
		[addNode, generateId, nodes],
	);

	const handleOpenModal = useCallback(() => {
		setIsModalOpen(true);
	}, []);

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false);
	}, []);

	const handleCloseError = useCallback(() => {
		setShowError(false);
	}, []);

	const reactFlowProps = useMemo(
		() => ({
			nodes,
			edges,
			onNodesChange,
			onEdgesChange,
			nodeTypes,
			edgeTypes,
			onConnect: handleConnect,
			connectionLineStyle,
			defaultEdgeOptions,
			fitView: true,
		}),
		[nodes, edges, onNodesChange, onEdgesChange, handleConnect],
	);

	return (
		<div className="w-full h-full relative pb-[16px] pl-[5px] pr-[16px] pt-[2px]">
			<Button
				type="button"
				onClick={handleOpenModal}
				className="absolute top-5 right-10 bg-green text-white hover:bg-green-dark z-10 cursor-pointer"
			>
				<span className="text-xl">+</span> Nueva Colección
			</Button>

			<ModalAddCollection
				open={isModalOpen}
				setOpen={handleCloseModal}
				onSubmit={handleAddDocument}
			/>

			<ReactFlow {...reactFlowProps}>
				<Background className="!bg-terciary-gray rounded-xl" />
				<Controls className="text-white controls-with-buttons " />
				<MiniMap nodeClassName="!fill-gray" className="!bg-secondary-gray" />
			</ReactFlow>

			{showError && (
				<ShowErrorModal
					onClose={handleCloseError}
					errorMessage="Ya existe una relación entre estas tablas"
				/>
			)}
		</div>
	);
};

export default DatabaseDiagram;
export { DatabaseDiagram as DataBaseDiagram };
