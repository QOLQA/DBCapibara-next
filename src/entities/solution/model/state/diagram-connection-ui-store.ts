"use client";

import { create } from "zustand";

type DiagramConnectionUiState = {
	isConnecting: boolean;
	setIsConnecting: (isConnecting: boolean) => void;
};

export const useDiagramConnectionUiStore = create<DiagramConnectionUiState>()(
	(set) => ({
		isConnecting: false,
		setIsConnecting: (isConnecting) => set({ isConnecting }),
	}),
);
