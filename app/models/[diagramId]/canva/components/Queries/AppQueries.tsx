"use client";

import { useCanvasStore } from "@/state/canvaStore";
import { BtnNewQuery } from "./BtnNewQuery";
import { QueryItem } from "./QueryItem";

export const AppQueries = () => {
	const queries = useCanvasStore((state) => state.queries);
	return (
		<div className="flex flex-col gap-5 h-full w-full items-center">
			<BtnNewQuery />
			<div className="flex flex-col gap-5 w-full max-h-full overflow-y-auto items-center custom-scrollbar">
				{queries.map((query, index) => (
					<QueryItem
						key={`${query.collections[0]}-${index}-queries`}
						query={query}
					/>
				))}
			</div>
		</div>
	);
};
