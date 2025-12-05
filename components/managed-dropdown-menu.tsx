'use client'

import { useId, type ComponentProps } from "react";
import { useDropdownContext } from "@/contexts/dropdown-context";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

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
  // Generate unique ID if not provided
  const generatedId = useId();
  const id = propId || generatedId;

	const { activeDropdownId, setActiveDropdown } = useDropdownContext();

  // Determine if this menu is open
  const isThisOpen = activeDropdownId === id;

  // Handle changes in menu state
  const handleOpenChange = (open: boolean) => {
    // If the menu is opening, set it as active
    if (open) {
      setActiveDropdown(id);
    }
    // If this menu is closing, clear the active menu
    else if (activeDropdownId === id) {
      setActiveDropdown(null);
    }

    // Propagate to the provided open change controller if it exists
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
