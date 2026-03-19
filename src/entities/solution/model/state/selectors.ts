import type { SolutionStore } from "./solutionStore";

export const solutionSelector = (state: SolutionStore) => ({
	id: state.id,
	nodes: state.nodes,
	edges: state.edges,
	editNode: state.editNode,
	editEdge: state.editEdge,
	addEdge: state.addEdge,
	onNodesChange: state.onNodesChange,
	onEdgesChange: state.onEdgesChange,
	addNode: state.addNode,
	versions: state.versions,
	selectedVersionId: state.selectedVersionId,
	loadedSolutionId: state.loadedSolutionId,
	setSelectedVersionId: state.setSelectedVersionId,
	setLoadedSolutionId: state.setLoadedSolutionId,
	setNodes: state.setNodes,
	setEdges: state.setEdges,
	setVersions: state.setVersions,
});
