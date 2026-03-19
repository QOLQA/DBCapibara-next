"use client";

import { useEffect, useState } from "react";
import { QueryItem } from "@fsd/entities/query";
import { useSolutionStore } from "@fsd/entities/solution";
import {
	BtnNewQuery,
	useQueryOperations,
	useQueriesStore,
} from "@fsd/features/manage-queries";
import { DropdownQueries } from "./dropdownQueries";

export const QueriesPanel = () => {
	const queries = useQueriesStore((state) => state.queries);
	const solutionId = useSolutionStore((state) => state.id);
	const loadedSolutionId = useSolutionStore((state) => state.loadedSolutionId);
	const hasLoadedQueries = useQueriesStore((state) => state.hasLoadedQueries);
	const setLoadedSolutionId = useSolutionStore(
		(state) => state.setLoadedSolutionId
	);
	const setHasLoadedQueries = useQueriesStore((state) => state.setHasLoadedQueries);
	const resetQueries = useQueriesStore((state) => state.resetQueries);
	const { syncQueries } = useQueryOperations();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!solutionId) return;

		if (loadedSolutionId !== solutionId) {
			resetQueries();
			setLoadedSolutionId(solutionId);
		}

		if (solutionId && !hasLoadedQueries) {
			setIsLoading(true);
			syncQueries()
				.then(() => {
					setHasLoadedQueries(true);
				})
				.catch((error) => {
					console.error("Failed to load queries:", error);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [
		solutionId,
		loadedSolutionId,
		hasLoadedQueries,
		syncQueries,
		setHasLoadedQueries,
		setLoadedSolutionId,
		resetQueries,
	]);

	if (isLoading) {
		return (
			<div className="flex flex-col gap-5 h-full w-full items-center justify-center">
				<p className="text-sm text-gray-500">Loading queries...</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-5 h-full w-full items-center">
			<BtnNewQuery />
			<div className="flex flex-col gap-5 w-full max-h-full overflow-y-auto items-center custom-scrollbar">
				{queries?.map((query, index) => (
					<QueryItem
						key={`${query.collections[0]}-${index}-queries`}
						query={query}
						actionsSlot={<DropdownQueries editQuery={query} />}
					/>
				))}
			</div>
		</div>
	);
};
