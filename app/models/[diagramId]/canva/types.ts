import type { Edge, Node } from "@xyflow/react";

export type CardinalityType = "1 ... 1" | "1 ... n" | "n ... m";

export const CARDINALITY_OPTIONS: CardinalityType[] = ["1 ... 1", "1 ... n", "n ... m"];

export interface EdgeData {
	cardinality?: CardinalityType;
	[key: string]: unknown;
}

export interface Column {
	id: string;
	name: string;
	type: string;
}

export interface TableData {
	[key: string]: unknown;
	id: string;
	label: string;
	columns: Column[];
	nestedTables?: TableData[];
	submodelIndex?: number;
	cardinality?: CardinalityType;
}

export interface AttributeNodeProps {
	column: Column;
	columnId: string;
	handleEdit: (column: Column) => void;
}

export interface TableNodeProps {
	data: TableData;
	id: string;
}

export interface Query {
	_id: string;
	full_query: string;
	collections: string[];
	highlighted_words: string[];
}

export interface NodeBackend {
	id: string;
	name: string;
	type: string;
	cols: Column[];
	position: {
		x: number;
		y: number;
	};
	nested_nodes?: NestedNode[];
}

export interface NestedNode {
	id: string;
	name: string;
	cols: Column[];
	nested_nodes?: NestedNode[];
	cardinality?: CardinalityType;
}

export interface EdgeBackend {
	id: string;
	source: string;
	target: string;
	cardinality?: CardinalityType;
}

export interface Submodel {
	nodes: NodeBackend[];
	edges: EdgeBackend[];
}

export interface VersionBackend {
	submodels: Submodel[];
	description: string;
	solution_id: string;
	_id: string;
}

export interface SolutionModel {
	_id: string;
	name: string;
	versions: VersionBackend[];
	last_version_saved: string;
	src_img: string;
	last_updated_at?: string;
}

export interface VersionFrontend {
	nodes: Node<TableData>[];
	edges: Edge[];
	description: string;
	solution_id: string;
	_id: string;
}


export interface StastType {
	name: string;
	value: number;
	color: string;
}
