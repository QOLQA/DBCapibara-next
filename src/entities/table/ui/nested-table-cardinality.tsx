"use client";

import React, { useCallback } from "react";
import { ManagedDropdownMenu } from "@fsd/shared/ui/ManagedDropdownMenu";
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@fsd/shared/ui/dropdown-menu";
import {
	type CardinalityType,
	CARDINALITY_OPTIONS,
} from "@fsd/entities/solution";

interface NestedTableCardinalityProps {
	tableId: string;
	cardinality: CardinalityType;
	onCardinalityChange: (
		tableId: string,
		newCardinality: CardinalityType,
	) => void;
}

export const NestedTableCardinality = React.memo(
	({
		tableId,
		cardinality,
		onCardinalityChange,
	}: NestedTableCardinalityProps) => {
		const handleClick = useCallback((e: React.MouseEvent) => {
			e.stopPropagation();
		}, []);

		return (
			<ManagedDropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						className="ml-2 px-1.5 py-0.5 text-white text-p-sm bg-transparent hover:bg-gray/50 rounded cursor-pointer transition-colors duration-200 border-none outline-none focus:ring-1 focus:ring-lighter-gray/50"
						onClick={handleClick}
					>
						{cardinality}
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="z-50 min-w-[70px]"
					side="right"
					align="center"
					variant="menu-1"
				>
					{CARDINALITY_OPTIONS.map((option) => (
						<DropdownMenuItem
							key={option}
							type="normal"
							onClick={() => onCardinalityChange(tableId, option)}
							className={
								option === cardinality
									? "bg-gray text-white"
									: "text-lighter-gray"
							}
						>
							{option}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</ManagedDropdownMenu>
		);
	},
);

NestedTableCardinality.displayName = "NestedTableCardinality";
