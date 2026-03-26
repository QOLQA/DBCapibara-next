/**
 * Domain note: "project" in the UI is the "solution" entity in backend/domain.
 */
export type { SolutionListItem } from "./model/solution";
export { SolutionCard } from "./ui/solution-card";
export { SolutionImage } from "./ui/solution-image";
export { CARDINALITY_OPTIONS } from "./model/solution-model";
export type {
	CardinalityType,
	Column,
	TableData,
	Query,
	NodeBackend,
	NestedNode,
	EdgeBackend,
	Submodel,
	VersionBackend,
	SolutionModel,
	VersionFrontend,
	EdgeData,
	AttributeNodeProps,
	TableNodeProps,
	StatType,
} from "./model/solution-model";
export {
	useSolutionStore,
	type SolutionStore,
} from "./model/state/solutionStore";
export { solutionSelector } from "./model/state/selectors";
