'use client'

import React from "react";
import type { Column } from "../../types";
import { AttributeNode } from "./AttributeNode";

interface TableAttributesProps {
	columns: Column[];
	onEditAttribute: (column: Column) => void;
}

export const TableAttributes = React.memo(({ columns, onEditAttribute }: TableAttributesProps) => {
	return (
		<div className="table-attributes">
			{columns?.map((column: Column, index: number) => (
				<React.Fragment key={column.id}>
					<AttributeNode
						column={column}
						columnId={column.id}
						handleEdit={onEditAttribute}
					/>
					{index < columns.length - 1 && (
						<hr className="border border-gray" />
					)}
				</React.Fragment>
			))}
		</div>
	);
});

TableAttributes.displayName = 'TableAttributes';
