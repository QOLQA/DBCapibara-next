"use client";

import type { StatType } from "@fsd/entities/solution";
import { LineStats } from "./LineStats";

export function StatsLineTotal({ data }: { data: StatType[] }) {
	const totalValue = data.reduce((sum, stat) => sum + stat.value, 0);

	return (
		<div className="flex items-center justify-between w-full h-full pr-5">
			<LineStats data={data} />

			<div className="flex flex-col items-center justify-center">
				<span className="text-h2 font-bold">
					{parseFloat(totalValue.toFixed(2))}
				</span>
				<span className="text-h5">total</span>
			</div>
		</div>
	);
}
