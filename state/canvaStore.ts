"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
	Query,
	TableData,
	VersionFrontend,
} from "@/app/models/[diagramId]/canva/types";
import {
	applyEdgeChanges,
	applyNodeChanges,
	type Edge,
	type EdgeChange,
	type Node,
	type NodeChange,
} from "@xyflow/react";

export type CanvasState = {
	versions: VersionFrontend[];
	selectedVersionId: string;
	nodes: Node<TableData>[];
	edges: Edge[];
	queries: Query[];
	id: string; // solutionId
	setId: (id: string) => void;
	setQueries: (queries: Query[]) => void;
	setNodes: (nodes: Node<TableData>[]) => void;
	setEdges: (edges: Edge[]) => void;
	setVersions: (versions: VersionFrontend[]) => void;
	setSelectedVersionId: (id: string) => void;
	getQueryById: (queryId: string) => Query | undefined;
	addNode: (node: Node<TableData>) => void;
	addEdge: (edge: Edge) => void;
	addQuery: (queries: Query) => void;
	editNode: (nodeId: string, newNode: Node<TableData>) => void;
	editQuery: (queryId: string, newQuery: Query) => void;
	removeNode: (nodeId: string) => void;
	removeEdge: (edgeId: string) => void;
	removeQuery: (queryId: string) => void;
	onNodesChange: (changes: NodeChange<Node<TableData>>[]) => void;
	onEdgesChange: (changes: EdgeChange[]) => void;
	_hasHydrated: boolean;
	setHasHydrated: (hasHydrated: boolean) => void;
};

export const useCanvasStore = create<CanvasState>()(
	persist(
		immer((set, get) => ({
			nodes: [],
			edges: [],
			queries: [],
			id: "",
			versions: [],
			selectedVersionId: "",
			setSelectedVersionId: (id) => {
				set((state) => {
					state.selectedVersionId = id;
				});
			},
			setId: (id) => {
				set((state) => {
					state.id = id;
				});
			},
			setQueries: (queries) => {
				set((state) => {
					state.queries = queries;
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
			getQueryById: (queryId) => {
				const query = get().queries.find((q) => q.id === queryId);
				return query;
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
			addQuery: (query) => {
				set((state) => {
					state.queries.push(query);
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
			editQuery: (queryId, newQuery) => {
				set((state) => {
					const index = state.queries.findIndex(
						(query) => query.id === queryId
					);
					if (index !== -1) {
						state.queries[index] = newQuery;
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
			removeQuery: (queryId) => {
				set((state) => {
					state.queries = state.queries.filter((q) => q.id !== queryId);
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
				queries: state.queries,
				selectedVersionId: state.selectedVersionId,
				versions: state.versions,
			}),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		}
	)
);

export const canvaSelector = (state: CanvasState) => ({
	id: state.id,
	nodes: state.nodes,
	edges: state.edges,
	editNode: state.editNode,
	addEdge: state.addEdge,
	onNodesChange: state.onNodesChange,
	onEdgesChange: state.onEdgesChange,
	addNode: state.addNode,
	versions: state.versions,
	selectedVersionId: state.selectedVersionId,
	setSelectedVersionId: state.setSelectedVersionId,
	setNodes: state.setNodes,
	setEdges: state.setEdges,
	setQueries: state.setQueries,
});
