'use client'

import { createContext, useContext, useState, useCallback } from "react";

type DropdownContextType = {
	activeDropdownId: string | null;
	setActiveDropdown: (id: string | null) => void;
};

const DropdownContext = createContext<DropdownContextType>({
	activeDropdownId: null,
	setActiveDropdown: () => {},
});

export const DropdownProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

	const setActiveDropdown = useCallback((id: string | null) => {
		setActiveDropdownId(id);
	}, []);

	return (
		<DropdownContext.Provider value={{ activeDropdownId, setActiveDropdown }}>
			{children}
		</DropdownContext.Provider>
	);
};

export const useDropdownContext = () => useContext(DropdownContext);
