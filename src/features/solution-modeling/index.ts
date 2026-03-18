export { useCanvasStore, type CanvasState } from "./model/canvaStore";
export { canvaSelector } from "./model/selectors";
export { default as DiagramClient } from "./ui/DiagramClient";
export { DiagramSessionHydrator } from "@fsd/widgets/diagram-session";
export { LayoutDiagram } from "@fsd/widgets/modeling-layout";
export { DataBaseDiagram, edgeTypes } from "@fsd/widgets/diagram-canvas";
export {
	nodeTypes,
	useTableConnections,
	getNextAvailableSubmodelIndex,
} from "@fsd/entities/table";
export { useTableOperations } from "./model/use-table-operations";
export type { NavItem } from "@fsd/widgets/modeling-sidebar";
