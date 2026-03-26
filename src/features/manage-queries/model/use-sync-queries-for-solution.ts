"use client";

import { useEffect } from "react";
import { useQueriesStore } from "@fsd/entities/query";
import { useSolutionStore } from "@fsd/entities/solution";
import { useQueryOperations } from "./use-query-operations";

/**
 * Fetches queries for the current solution when the modeling page loads (or when
 * the user switches solutions). Keeps {@link useQueriesStore} in sync so panels
 * that never mount the Queries sidebar tab (e.g. metrics) still see data.
 *
 * @param expectedSolutionId — ID from the page loader (URL); avoids syncing with a
 *   stale {@link useSolutionStore} id before diagram hydration applies the new solution.
 */
export function useSyncQueriesForSolution(expectedSolutionId: string) {
	const solutionId = useSolutionStore((state) => state.id);
	const loadedSolutionId = useSolutionStore((state) => state.loadedSolutionId);
	const hasLoadedQueries = useQueriesStore((state) => state.hasLoadedQueries);
	const setLoadedSolutionId = useSolutionStore(
		(state) => state.setLoadedSolutionId,
	);
	const setHasLoadedQueries = useQueriesStore(
		(state) => state.setHasLoadedQueries,
	);
	const setIsSyncingQueries = useQueriesStore(
		(state) => state.setIsSyncingQueries,
	);
	const resetQueries = useQueriesStore((state) => state.resetQueries);
	const { syncQueries } = useQueryOperations();

	useEffect(() => {
		if (!solutionId || !expectedSolutionId) return;
		if (solutionId !== expectedSolutionId) return;

		if (loadedSolutionId !== solutionId) {
			resetQueries();
			setLoadedSolutionId(solutionId);
		}

		if (solutionId && !hasLoadedQueries) {
			setIsSyncingQueries(true);
			syncQueries()
				.then(() => {
					setHasLoadedQueries(true);
				})
				.catch((error) => {
					console.error("Failed to load queries:", error);
				})
				.finally(() => {
					setIsSyncingQueries(false);
				});
		}
	}, [
		expectedSolutionId,
		solutionId,
		loadedSolutionId,
		hasLoadedQueries,
		syncQueries,
		setHasLoadedQueries,
		setLoadedSolutionId,
		setIsSyncingQueries,
		resetQueries,
	]);
}
