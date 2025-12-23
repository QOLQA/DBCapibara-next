"use client";

import { useEffect, useState } from "react";
import { useCanvasStore } from "@/state/canvaStore";
import { useQueryOperations } from "@/hooks/use-query-operations";
import { BtnNewQuery } from "./BtnNewQuery";
import { QueryItem } from "./QueryItem";

export const AppQueries = () => {
	const queries = useCanvasStore((state) => state.queries);
	const solutionId = useCanvasStore((state) => state.id);
	const hasLoadedQueries = useCanvasStore((state) => state.hasLoadedQueries);
	const setHasLoadedQueries = useCanvasStore((state) => state.setHasLoadedQueries);
	const { syncQueries } = useQueryOperations();
	const [isLoading, setIsLoading] = useState(false);

	// Cargar queries desde el backend solo la primera vez
	useEffect(() => {
		if (solutionId && !hasLoadedQueries) {
			setIsLoading(true);
			syncQueries()
				.then(() => {
					setHasLoadedQueries(true);
				})
				.catch((error) => {
					console.error("❌ Failed to load queries:", error);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [solutionId, hasLoadedQueries, syncQueries, setHasLoadedQueries]);

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
					/>
				))}
			</div>
		</div>
	);
};
