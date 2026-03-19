"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { TableData, VersionFrontend } from "@fsd/entities/solution";
import {
	applyEdgeChanges,
	applyNodeChanges,
	type Edge,
	type EdgeChange,
	type Node,
	type NodeChange,
} from "@xyflow/react";

export type SolutionStore = {
	versions: VersionFrontend[];
	selectedVersionId: string;
	loadedSolutionId: string | null;
	nodes: Node<TableData>[];
	edges: Edge[];
	id: string;
	isChangingVersion: boolean;
	setId: (id: string) => void;
	setNodes: (nodes: Node<TableData>[]) => void;
	setEdges: (edges: Edge[]) => void;
	setVersions: (versions: VersionFrontend[]) => void;
	setSelectedVersionId: (id: string) => void;
	setLoadedSolutionId: (solutionId: string | null) => void;
	setIsChangingVersion: (isChanging: boolean) => void;
	addNode: (node: Node<TableData>) => void;
	addEdge: (edge: Edge) => void;
	editNode: (nodeId: string, newNode: Node<TableData>) => void;
	removeNode: (nodeId: string) => void;
	removeEdge: (edgeId: string) => void;
	editEdge: (edgeId: string, newEdge: Edge) => void;
	onNodesChange: (changes: NodeChange<Node<TableData>>[]) => void;
	onEdgesChange: (changes: EdgeChange[]) => void;
	_hasHydrated: boolean;
	setHasHydrated: (hasHydrated: boolean) => void;
};

export const useSolutionStore = create<SolutionStore>()(
	persist(
		immer((set, get) => ({
			nodes: [],
			edges: [],
			id: "",
			versions: [],
			selectedVersionId: "",
			loadedSolutionId: null,
			isChangingVersion: false,
			setSelectedVersionId: (id) => {
				set((state) => {
					state.selectedVersionId = id;
				});
			},
			setLoadedSolutionId: (solutionId) => {
				set((state) => {
					state.loadedSolutionId = solutionId;
				});
			},
			setIsChangingVersion: (isChanging) => {
				set((state) => {
					state.isChangingVersion = isChanging;
				});
			},
			setId: (id) => {
				set((state) => {
					state.id = id;
				});
			},
			setNodes: (nodes) => {
				set((state) => {
					state.nodes = nodes;
				});
			},
			setEdges: (edges) => {
				set((state) => {
					state.edges = edges;
				});
			},
			setVersions: (versions) => {
				set((state) => {
					state.versions = versions;
				});
			},
			addNode: (node) => {
				set((state) => {
					state.nodes.push(node);
				});
			},
			addEdge: (edge) => {
				set((state) => {
					state.edges.push(edge);
				});
			},
			editNode: (nodeId, newNode) => {
				set((state) => {
					const index = state.nodes.findIndex((node) => node.id === nodeId);
					if (index !== -1) {
						state.nodes[index] = newNode;
					}
				});
			},
			removeNode: (nodeId) => {
				set((state) => {
					state.nodes = state.nodes.filter((n) => n.id !== nodeId);
				});
			},
			removeEdge: (edgeId) => {
				set((state) => {
					state.edges = state.edges.filter((e) => e.id !== edgeId);
				});
			},
			editEdge: (edgeId, newEdge) => {
				set((state) => {
					const index = state.edges.findIndex((edge) => edge.id === edgeId);
					if (index !== -1) {
						state.edges[index] = newEdge;
					}
				});
			},
			onNodesChange: (changes: NodeChange<Node<TableData>>[]) => {
				set((state) => {
					state.nodes = applyNodeChanges<Node<TableData>>(changes, state.nodes);
				});
			},
			onEdgesChange: (changes: EdgeChange[]) => {
				set({
					edges: applyEdgeChanges(changes, get().edges),
				});
			},
			_hasHydrated: false,
			setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
		})),
		{
			name: "canvas-storage",
			partialize: (state) => ({
				id: state.id,
				nodes: state.nodes,
				edges: state.edges,
				selectedVersionId: state.selectedVersionId,
				loadedSolutionId: state.loadedSolutionId,
				versions: state.versions,
			}),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);
