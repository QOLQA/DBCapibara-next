"use client";

import {
	Background,
	Controls,
	MiniMap,
	ReactFlow,
	MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "@/app/models/[diagramId]/canva/components/Table/TableNode";
import { edgeTypes } from "@/app/models/[diagramId]/canva/components/Diagram/FloatingEdge";

import { useCanvasStore } from "@/state/canvaStore";
import { canvaSelector } from "@/state/canvaStore";
import { useShallow } from "zustand/shallow";
import { useState } from "react";
import { useMemo } from "react";
import { useTableConnections } from "@/hooks/use-node-connections";

const connectionLineStyle = {
	stroke: "#4E4E4E",
	strokeWidth: 3,
};

const defaultEdgeOptions = {
	type: "floating",
	style: connectionLineStyle,
	markerEnd: { type: MarkerType.ArrowClosed },
};

const ComparisonDiagram = () => {
	const {
		nodes,
		edges,
		editNode,
		addEdge,
		setEdges,
		onNodesChange,
		onEdgesChange,
	} = useCanvasStore<ReturnType<typeof canvaSelector>>(
		useShallow(canvaSelector)
	);

	const [showError, setShowError] = useState(false);

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

	const { handleConnect } = useTableConnections(connectionConfig);

	const reactFlowProps = useMemo(
		() => ({
			nodes,
			edges,
			nodeTypes,
			edgeTypes,
			onNodesChange,
			onEdgesChange,
			connectionLineStyle,
			defaultEdgeOptions,
			onConnect: handleConnect,

			fitView: true,
		}),
		[nodes, edges, onNodesChange, onEdgesChange, handleConnect]
	);

	return (
		<div className="w-full h-full relative pb-[16px] pr-[16px] bg-secondary-gray">
			<ReactFlow {...reactFlowProps}>
				<Background className="!bg-terciary-gray rounded-xl" />
				<Controls className="text-white controls-with-buttons " />
				<MiniMap nodeClassName="!fill-gray" className="!bg-secondary-gray" />
			</ReactFlow>
		</div>
	);
};

export default ComparisonDiagram;
