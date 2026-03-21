import { useCallback, useMemo, useState } from "react";
import type { Node, EdgeChange, NodeChange } from "@xyflow/react";
import type { TableData } from "@fsd/entities/solution";
import { useShallow } from "zustand/shallow";
import { useSolutionStore, solutionSelector } from "@fsd/entities/solution";
import { getNextAvailableSubmodelIndex } from "@fsd/entities/table/lib";
import { generateRandomId } from "@fsd/shared/lib/ids";
import { useTranslation } from "@fsd/shared/i18n/use-translation";
import { toast } from "sonner";
import { MarkerType } from "@xyflow/react";
import { useTableConnect } from "./use-table-connect";

const connectionLineStyle = {
	stroke: "#4E4E4E",
	strokeWidth: 2,
	strokeDasharray: "8, 4",
};

export const useDatabaseDiagram = () => {
	const { t } = useTranslation();
	const {
		nodes,
		edges,
		addNode,
		editNode,
		addEdge,
		setEdges,
		onNodesChange,
		onEdgesChange,
	} = useSolutionStore<ReturnType<typeof solutionSelector>>(
		useShallow(solutionSelector),
	);

	const isChangingVersion = useSolutionStore(
		(state) => state.isChangingVersion,
	);

	const [isAddCollectionModalOpen, setIsAddCollectionModalOpen] =
		useState(false);

	const connectionConfig = useMemo(
		() => ({
			nodes,
			edges,
			editNode,
			addEdge,
			setEdges,
			onError: () => toast.error(t("databaseDiagram.relationshipExists")),
		}),
		[nodes, edges, editNode, addEdge, setEdges, t],
	);

	const { handleConnect, handleDisconnect, handleNodeRemove } =
		useTableConnect(connectionConfig);

	const handleAddCollection = useCallback(
		(name: string) => {
			const newIdNode = generateRandomId();

			const newSubmodelIndex = getNextAvailableSubmodelIndex(nodes);

			const newNode: Node<TableData> = {
				id: newIdNode,
				position: { x: Math.random() * 400, y: Math.random() * 400 },
				data: {
					id: newIdNode,
					label: name,
					columns: [
						{
							id: `${newIdNode}-${generateRandomId()}`,
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
		[addNode, nodes],
	);

	const openAddCollectionModal = useCallback(() => {
		setIsAddCollectionModalOpen(true);
	}, []);

	const closeAddCollectionModal = useCallback(() => {
		setIsAddCollectionModalOpen(false);
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
		[onEdgesChange, handleDisconnect, nodes],
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
		[onNodesChange, handleNodeRemove, nodes],
	);

	const reactFlowProps = useMemo(
		() => ({
			nodes,
			edges,
			onEdgesChange: handleEdgesChange,
			onNodesChange: handleNodesChange,
			onConnect: handleConnect,
			connectionLineStyle,
			defaultEdgeOptions: {
				type: "floating" as const,
				style: connectionLineStyle,
				markerEnd: {
					type: MarkerType.ArrowClosed,
					width: 20,
					height: 20,
					color: "#4e4e42",
				},
			},
			fitView: true,
		}),
		[nodes, edges, handleEdgesChange, handleNodesChange, handleConnect],
	);

	return {
		t,
		isChangingVersion,
		isAddCollectionModalOpen,
		setAddCollectionModalOpen: setIsAddCollectionModalOpen,
		openAddCollectionModal,
		handleAddCollection,
		reactFlowProps,
	};
};
