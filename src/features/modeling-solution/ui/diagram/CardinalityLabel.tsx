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
import { useEditEdgeCardinality } from "../../model/use-edit-edge-cardinality";

interface CardinalityLabelProps {
	edgeId: string;
	labelX: number;
	labelY: number;
	cardinality: CardinalityType;
}

export const CardinalityLabel = React.memo(
	({ edgeId, labelX, labelY, cardinality }: CardinalityLabelProps) => {
		const { handleCardinalityChange } = useEditEdgeCardinality(edgeId);

		const handleClick = useCallback((e: React.MouseEvent) => {
			e.stopPropagation();
		}, []);

		return (
			<foreignObject
				width={130}
				height={40}
				x={labelX - 70}
				y={labelY - 20}
				className="overflow-visible pointer-events-auto"
				requiredExtensions="http://www.w3.org/1999/xhtml"
			>
				<div
					className="flex items-center justify-center w-full h-full"
					onClick={handleClick}
				>
					<ManagedDropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className="px-2 py-1 text-lighter-gray text-p-lg bg-terciary-gray hover:bg-secondary-gray/80 rounded cursor-pointer transition-colors duration-200 border-none outline-none focus:ring-1 focus:ring-lighter-gray/50"
								onClick={handleClick}
							>
								{cardinality}
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="z-50 min-w-[70px]"
							side="top"
							align="center"
							variant="menu-1"
						>
							{CARDINALITY_OPTIONS.map((option) => (
								<DropdownMenuItem
									key={option}
									type="normal"
									onClick={() => handleCardinalityChange(option)}
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
				</div>
			</foreignObject>
		);
	},
);

CardinalityLabel.displayName = "CardinalityLabel";
