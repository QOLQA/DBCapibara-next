"use client";

import {
	Background,
	Controls,
	MiniMap,
	ReactFlow,
	MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
	nodeTypes,
	edgeTypes,
	useTableConnect,
} from "@fsd/features/solution-modeling";
import { useSolutionStore, solutionSelector } from "@fsd/entities/solution";
import { useShallow } from "zustand/shallow";
import { useState, useMemo } from "react";

const connectionLineStyle = {
	stroke: "#4E4E4E",
	strokeWidth: 3,
};

const defaultEdgeOptions = {
	type: "floating",
	style: connectionLineStyle,
	markerEnd: { type: MarkerType.ArrowClosed },
};

export function ComparisonDiagram() {
	const {
		nodes,
		edges,
		editNode,
		addEdge,
		setEdges,
		onNodesChange,
		onEdgesChange,
	} = useSolutionStore(useShallow(solutionSelector));

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
		[nodes, edges, editNode, addEdge, setEdges],
	);

	const { handleConnect } = useTableConnect(connectionConfig);

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
		[nodes, edges, onNodesChange, onEdgesChange, handleConnect],
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
}
