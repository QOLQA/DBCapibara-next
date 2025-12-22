"use client";

import { useEffect, useState } from "react";
import { useCanvasStore } from "@/state/canvaStore";
import { useQueryOperations } from "@/hooks/use-query-operations";
import { BtnNewQuery } from "./BtnNewQuery";
import { QueryItem } from "./QueryItem";

export const AppQueries = () => {
	const queries = useCanvasStore((state) => state.queries);
	const solutionId = useCanvasStore((state) => state.id);
	const { syncQueries } = useQueryOperations();
	const [isLoading, setIsLoading] = useState(false);
	const [hasLoaded, setHasLoaded] = useState(false);

	// Cargar queries desde el backend cuando el componente se monte
	useEffect(() => {
		if (solutionId && !hasLoaded) {
			setIsLoading(true);
			syncQueries()
				.then(() => {
					setHasLoaded(true);
				})
				.catch((error) => {
					console.error("❌ Failed to load queries:", error);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [solutionId, hasLoaded, syncQueries]);

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
