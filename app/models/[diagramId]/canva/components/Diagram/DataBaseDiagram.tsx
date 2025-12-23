"use client";

import { useCallback, useState, useMemo } from "react";
import {
	ReactFlow,
	Background,
	Controls,
	MiniMap,
	MarkerType,
} from "@xyflow/react";
import type { Node, EdgeChange, NodeChange } from "@xyflow/react";
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
import { getNextAvailableSubmodelIndex } from "@/hooks/use-node-connections";

const connectionLineStyle = {
	stroke: "#4E4E4E",
	strokeWidth: 2,
	strokeDasharray: "8, 4",
};

const defaultEdgeOptions = {
	type: "floating",
	style: connectionLineStyle,
	markerEnd: {
		type: MarkerType.ArrowClosed,
		width: 20,
		height: 20,
		color: "#4e4e42",
	},
};

const DatabaseDiagram = () => {
	const {
		nodes,
		edges,
		addNode,
		editNode,
		addEdge,
		setEdges,
		onNodesChange,
		onEdgesChange,
	} = useCanvasStore<ReturnType<typeof canvaSelector>>(
		useShallow(canvaSelector)
	);

	const isChangingVersion = useCanvasStore((state) => state.isChangingVersion);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [showError, setShowError] = useState(false);
	const generateId = useUniqueId();

	const connectionConfig = useMemo(
		() => ({
			nodes,
			edges,
			editNode,
			addEdge,
			setEdges,
			onError: () => setShowError(true),
		}),
		[nodes, edges, editNode, addEdge, setEdges]
	);

	const { handleConnect, handleDisconnect, handleNodeRemove } =
		useTableConnections(connectionConfig);

	const handleAddDocument = useCallback(
		(name: string) => {
			const newIdNode = generateId();

			const newSubmodelIndex = getNextAvailableSubmodelIndex(nodes);

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
		[addNode, generateId, nodes]
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

	const handleEdgesChange = useCallback(
		(changes: EdgeChange[]) => {
			changes.forEach((change) => {
				if (change.type === "remove") {
					handleDisconnect(change.id, nodes);
				}
			});

			onEdgesChange(changes);
		},
		[onEdgesChange, handleDisconnect]
	);

	const handleNodesChange = useCallback(
		(changes: NodeChange<Node<TableData>>[]) => {
			changes.forEach((change) => {
				if (change.type === "remove") {
					handleNodeRemove(change.id, nodes);
				}
			});
			onNodesChange(changes);
		},
		[onNodesChange, handleNodeRemove, nodes]
	);

	const reactFlowProps = useMemo(
		() => ({
			nodes,
			edges,
			onEdgesChange: handleEdgesChange,
			onNodesChange: handleNodesChange,
			nodeTypes,
			edgeTypes,
			onConnect: handleConnect,
			connectionLineStyle,
			defaultEdgeOptions,
			fitView: true,
		}),
		[nodes, edges, onNodesChange, handleEdgesChange, handleConnect]
	);

	return (
		<div className="w-full h-full relative pb-[16px] pl-[5px] pr-[16px] pt-[2px] bg-secondary-gray">
			{/* Loader mientras cambia de versión */}
			{isChangingVersion && (
				<div className="absolute inset-0 bg-terciary-gray/80 backdrop-blur-sm z-9999 flex items-center justify-center rounded-xl">
					<div className="flex flex-col items-center gap-4">
						<div className="w-12 h-12 border-4 border-blue border-t-transparent rounded-full animate-spin" />
						<p className="text-white text-lg font-medium">
							Cambiando versión...
						</p>
					</div>
				</div>
			)}

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
