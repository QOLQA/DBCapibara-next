"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { SolutionListItem } from "@fsd/entities/solution";

export type ModelsState = {
	solutionId: string | null;
	setSolutionId: (id: string) => void;
	solutionDataToEdit: Pick<SolutionListItem, "_id" | "name"> | null;
	setSolutionDataToEdit: (data: Pick<SolutionListItem, "_id" | "name">) => void;
	_hasHydrated: boolean;
	setHasHydrated: (hasHydrated: boolean) => void;
};

export const useModelsStore = create<ModelsState>()(
	persist(
		immer((set) => ({
			solutionId: null,
			solutionDataToEdit: null,
			setSolutionId: (id) => {
				set((state) => {
					state.solutionId = id;
				});
			},
			setSolutionDataToEdit: (data) => {
				set((state) => {
					state.solutionDataToEdit = data;
				});
			},
			_hasHydrated: false,
			setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
		})),
		{
			name: "models-storage",
			partialize: (state) => ({
				solutionId: state.solutionId,
				solutionDataToEdit: state.solutionDataToEdit,
			}),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);
