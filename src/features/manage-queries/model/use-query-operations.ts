"use client";

import { useCallback } from "react";
import { useSolutionStore } from "@fsd/entities/solution";
import { useQueriesStore } from "@fsd/entities/query";
import { api } from "@fsd/shared/api";
import type { Query } from "@fsd/entities/solution";

/**
 * Hook para manejar operaciones CRUD de queries con optimistic updates
 */
export const useQueryOperations = () => {
	const {
		addQuery: addQueryToStore,
		editQuery: editQueryInStore,
		removeQuery: removeQueryFromStore,
		setQueries,
	} = useQueriesStore();
	const solutionId = useSolutionStore((state) => state.id);

	const createQuery = useCallback(
		async (queryData: Omit<Query, "_id">, tempId: string) => {
			const optimisticQuery: Query = {
				_id: tempId,
				...queryData,
			};
			addQueryToStore(optimisticQuery);

			try {
				const createData: Omit<Query, "_id"> & { solution_id: string } = {
					...queryData,
					solution_id: solutionId,
				};

				const createdQuery = await api.post<Query>("/queries", createData);

				editQueryInStore(tempId, createdQuery);

				return createdQuery;
			} catch (error) {
				removeQueryFromStore(tempId);
				console.error("Failed to create query:", error);
				throw error;
			}
		},
		[addQueryToStore, editQueryInStore, removeQueryFromStore, solutionId]
	);

	const updateQuery = useCallback(
		async (queryId: string, updates: Partial<Omit<Query, "_id">>) => {
			const { queries } = useQueriesStore.getState();
			const originalQuery = queries.find((q) => q._id === queryId);

			if (!originalQuery) {
				console.error("Query not found");
				return;
			}

			const updatedQuery: Query = {
				...originalQuery,
				...updates,
			};
			editQueryInStore(queryId, updatedQuery);

			try {
				const backendQuery = await api.patch<Query>(
					`/queries/${queryId}`,
					updates
				);

				editQueryInStore(queryId, backendQuery);

				return backendQuery;
			} catch (error) {
				editQueryInStore(queryId, originalQuery);
				console.error("Failed to update query:", error);
				throw error;
			}
		},
		[editQueryInStore]
	);

	const deleteQuery = useCallback(
		async (queryId: string) => {
			const { queries } = useQueriesStore.getState();
			const queryToDelete = queries.find((q) => q._id === queryId);

			if (!queryToDelete) {
				console.error("Query not found");
				return;
			}

			removeQueryFromStore(queryId);

			try {
				await api.delete(`/queries/${queryId}`);
			} catch (error) {
				addQueryToStore(queryToDelete);
				console.error("Failed to delete query:", error);
				throw error;
			}
		},
		[removeQueryFromStore, addQueryToStore]
	);

	const syncQueries = useCallback(async () => {
		try {
			const queries = await api.get<Query[]>(`/queries/solution/${solutionId}`);
			setQueries(queries);
			return queries;
		} catch (error) {
			console.error("Failed to sync queries:", error);
			throw error;
		}
	}, [solutionId, setQueries]);

	return {
		createQuery,
		updateQuery,
		deleteQuery,
		syncQueries,
	};
};
