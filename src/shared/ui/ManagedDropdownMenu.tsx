"use client";

import { useId, type ComponentProps } from "react";
import { useDropdownContext } from "@fsd/shared/lib/dropdown-context";
import { DropdownMenu } from "./dropdown-menu";

type DropdownMenuProps = ComponentProps<typeof DropdownMenu>;

interface ManagedDropdownMenuProps extends DropdownMenuProps {
	id?: string;
	children: React.ReactNode;
}

export const ManagedDropdownMenu = ({
	id: propId,
	children,
	open: controlledOpen,
	onOpenChange: controlledOnOpenChange,
	...props
}: ManagedDropdownMenuProps) => {
	const generatedId = useId();
	const id = propId || generatedId;

	const { activeDropdownId, setActiveDropdown } = useDropdownContext();

	const isThisOpen = activeDropdownId === id;

	const handleOpenChange = (open: boolean) => {
		if (open) {
			setActiveDropdown(id);
		} else if (activeDropdownId === id) {
			setActiveDropdown(null);
		}

		if (controlledOnOpenChange) {
			controlledOnOpenChange(open);
		}
	};

	return (
		<DropdownMenu
			open={controlledOpen !== undefined ? controlledOpen : isThisOpen}
			onOpenChange={handleOpenChange}
			{...props}
		>
			{children}
		</DropdownMenu>
	);
};
