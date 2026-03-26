"use client";

import { QueryItem, useQueriesStore } from "@fsd/entities/query";
import { BtnNewQuery } from "@fsd/features/manage-queries";
import { DropdownQueries } from "./dropdownQueries";

export const QueriesPanel = () => {
	const queries = useQueriesStore((state) => state.queries);
	const isSyncingQueries = useQueriesStore((state) => state.isSyncingQueries);

	if (isSyncingQueries) {
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
