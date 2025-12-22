"use client";

import { Handle, Position } from "@xyflow/react";
import type { NodeTypes } from "@xyflow/react";

import type { TableNodeProps } from "../../types";
import { TableNodeContent } from "./TableNodeContent";

// Custom node types
export const TableNode = ({ data, id }: TableNodeProps) => {
	// Crear múltiples handles distribuidos a lo largo de todos los lados
	// para que toda la tabla sea el área de conexión
	const handlePositions = [
		"0%", // Top/Left
		"25%", // Quarter
		"50%", // Middle
		"75%", // Three quarters
		"100%", // Bottom/Right
	];

	return (
		// table
		<div className="relative w-full h-full ">
			{/* Target Handle - Centrado en la tabla */}
			<Handle
				type="target"
				position={Position.Left}
				id="target-center"
				style={{
					width: "80%",
					height: "50%",
					background: "transparent",
					border: "none",
					borderRadius: 0,
					left: "50%",
					top: "50%",
					transform: "translate(-50%, -50%)",
					opacity: 0,
					cursor: "crosshair",
					position: "absolute",
				}}
			/>

			{/* Source Handle (Right) - Para crear conexiones */}
			<Handle
				type="source"
				position={Position.Right}
				className="react-flow__handle react-flow__handle-source custom-handle"
				style={{
					width: "12px",
					height: "12px",
					borderRadius: "50%",
					background: "#1e1e1e",
					border: "2px solid #4e4e4e",
					right: "-6px",
				}}
			/>

			<TableNodeContent data={data} id={id} />
		</div>
	);
};

export const nodeTypes = {
	table: TableNode,
} satisfies NodeTypes;
