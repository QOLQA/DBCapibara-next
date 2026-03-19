export { useCanvasStore, type CanvasState } from "./model/state/canvaStore";
export { canvaSelector } from "./model/state/selectors";
export { default as DiagramClient } from "./ui/DiagramClient";
export { DiagramSessionHydrator } from "@fsd/widgets/diagram-session";
export { LayoutDiagram } from "@fsd/widgets/modeling-layout";
export { DataBaseDiagram, edgeTypes } from "@fsd/widgets/diagram-canvas";
export { nodeTypes } from "./ui/TableNode";
export { TableNodeContainer } from "./ui/TableNodeContainer";
export { getNextAvailableSubmodelIndex } from "@fsd/entities/table/lib/connection-operations";
export {
	useTableConnect,
} from "./model/use-table-connect";
export { useTableNodeContent } from "./model/use-table-node-content";
export { useTableOperations } from "./model/use-table-operations";
export type { NavItem } from "@fsd/widgets/modeling-sidebar";
