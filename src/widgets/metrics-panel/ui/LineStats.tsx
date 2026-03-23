"use client";

import type { StatType } from "@fsd/entities/solution";

export function LineStats({ data }: { data: StatType[] }) {
	const totalValue = data.reduce((sum, stat) => sum + stat.value, 0);

	return (
		<div className="flex flex-col items-center justify-center w-full h-full">
			{data.map((stat, index) => {
				const percentage = totalValue > 0 ? (stat.value / totalValue) * 100 : 0;

				return (
					<div
						key={index}
						className="rounded-2xl"
						style={{
							backgroundColor: stat.color,
							height: `${percentage}%`,
							width: "8px",
							boxShadow: `0 0 15px ${stat.color}`,
						}}
					/>
				);
			})}
		</div>
	);
}
