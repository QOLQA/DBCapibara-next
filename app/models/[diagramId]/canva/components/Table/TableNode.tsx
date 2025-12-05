'use client'

import { Handle, Position } from "@xyflow/react";
import type { NodeTypes } from "@xyflow/react";

import type { TableNodeProps } from "../../types";
import { TableNodeContent } from "./TableNodeContent";

// Custom node types
export const TableNode = ({ data, id }: TableNodeProps) => {

  return (
    // table
    <div className="relative">
      <Handle
        className="customHandle"
        type="target"
        position={Position.Left}
        isConnectableStart={false}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          border: "2px solid #fff",
        }}
      />
      <TableNodeContent
        data={data}
        id={id}
      />
    </div>
  );
};

export const nodeTypes = {
	table: TableNode,
} satisfies NodeTypes;
