export { useCanvasStore, type CanvasState } from "./model/canvaStore";
export { canvaSelector } from "./model/selectors";
export { default as DiagramClient } from "./ui/DiagramClient";
export { DiagramSessionHydrator } from "@fsd/widgets/diagram-session";
export { LayoutDiagram } from "@fsd/widgets/modeling-layout";
export { DataBaseDiagram } from "./ui/diagram/DataBaseDiagram";
export { edgeTypes } from "./ui/diagram/FloatingEdge";
export {
	nodeTypes,
	useTableConnections,
	getNextAvailableSubmodelIndex,
} from "@fsd/entities/table";
export { useTableOperations } from "./hooks";
export type { NavItem } from "@fsd/widgets/modeling-sidebar";
