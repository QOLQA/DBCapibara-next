import type { Edge, Node } from "@xyflow/react";

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
	id: string;
	full_query: string;
	collections: string[];
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
}

export interface EdgeBackend {
	id: string;
	source: string;
	target: string;
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
	queries: Query[]
	src_img: string;
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
