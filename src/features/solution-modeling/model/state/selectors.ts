import type { CanvasState } from "./canvaStore";

export const canvaSelector = (state: CanvasState) => ({
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
	setSelectedVersionId: state.setSelectedVersionId,
	setNodes: state.setNodes,
	setEdges: state.setEdges,
	setVersions: state.setVersions,
});
