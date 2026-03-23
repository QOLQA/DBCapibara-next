"use client";

import { Handle, Position } from "@xyflow/react";
import type { NodeTypes } from "@xyflow/react";

import type { TableNodeProps } from "@fsd/entities/solution";
import { TableNodeContainer } from "./TableNodeContainer";

export const TableNode = ({ data, id }: TableNodeProps) => {
	return (
		<div className="relative w-full h-full ">
			<Handle
				type="target"
				position={Position.Bottom}
				id="target-center"
				style={{
					width: "65%",
					height: "calc(100% - 57px)",
					background: "transparent",
					border: "none",
					borderRadius: 0,
					transform: "translate(-77%, 0%)",
					cursor: "crosshair",
					zIndex: 10,
				}}
			/>

			<Handle
				type="source"
				position={Position.Right}
				className="group"
				style={{
					width: "64px",
					height: "64px",
					background: "transparent",
					border: "none",
					borderRadius: 0,
					right: "-32px",
					top: "50%",
					transform: "translateY(-50%)",
					cursor: "crosshair",
					zIndex: 10,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<div
					className="group-hover:bg-[#0052cc] group-hover:border-[#0052cc] group-hover:scale-125 group-hover:shadow-[0_0_0_4px_rgba(0,82,204,0.2)]"
					style={{
						width: "12px",
						height: "12px",
						borderRadius: "50%",
						background: "#1e1e1e",
						border: "2px solid #4e4e4e",
						transition: "all 0.2s ease",
					}}
				/>
			</Handle>

			<TableNodeContainer data={data} id={id} />
		</div>
	);
};

export const nodeTypes = {
	table: TableNode,
} satisfies NodeTypes;
