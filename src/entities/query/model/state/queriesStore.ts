"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Query } from "@fsd/entities/solution";

export type QueriesState = {
	queries: Query[];
	hasLoadedQueries: boolean;
	/** True while GET queries for the active solution is in flight (not persisted). */
	isSyncingQueries: boolean;
	setQueries: (queries: Query[]) => void;
	addQuery: (query: Query) => void;
	editQuery: (queryId: string, newQuery: Query) => void;
	removeQuery: (queryId: string) => void;
	getQueryById: (queryId: string) => Query | undefined;
	setHasLoadedQueries: (hasLoaded: boolean) => void;
	setIsSyncingQueries: (syncing: boolean) => void;
	resetQueries: () => void;
	_hasHydrated: boolean;
	setHasHydrated: (hasHydrated: boolean) => void;
};

export const useQueriesStore = create<QueriesState>()(
	persist(
		immer((set, get) => ({
			queries: [],
			hasLoadedQueries: false,
			isSyncingQueries: false,
			setQueries: (queries) => {
				set((state) => {
					state.queries = queries;
				});
			},
			addQuery: (query) => {
				set((state) => {
					state.queries.push(query);
				});
			},
			editQuery: (queryId, newQuery) => {
				set((state) => {
					const index = state.queries.findIndex((q) => q._id === queryId);
					if (index !== -1) {
						state.queries[index] = newQuery;
					}
				});
			},
			removeQuery: (queryId) => {
				set((state) => {
					state.queries = state.queries.filter((q) => q._id !== queryId);
				});
			},
			getQueryById: (queryId) => {
				return get().queries.find((q) => q._id === queryId);
			},
			setHasLoadedQueries: (hasLoaded) => {
				set((state) => {
					state.hasLoadedQueries = hasLoaded;
				});
			},
			setIsSyncingQueries: (syncing) => {
				set((state) => {
					state.isSyncingQueries = syncing;
				});
			},
			resetQueries: () => {
				set((state) => {
					state.queries = [];
					state.hasLoadedQueries = false;
					state.isSyncingQueries = false;
				});
			},
			_hasHydrated: false,
			setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
		})),
		{
			name: "queries-storage",
			partialize: (state) => ({
				queries: state.queries,
				hasLoadedQueries: state.hasLoadedQueries,
			}),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);
