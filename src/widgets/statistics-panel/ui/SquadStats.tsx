"use client";

import type { StatType } from "@fsd/entities/solution";

export function SquadStats({ data }: { data: StatType[] }) {
	return (
		<div className="flex flex-col items-center gap-3 w-full h-full ">
			{data.map((stat, index) => (
				<div
					key={index}
					className="flex flex-col items-center justify-center w-[158px] h-[106px] rounded-2xl py-4 px-5"
					style={{ backgroundColor: stat.color }}
				>
					<span className="text-h2 font-bold">{stat.value}</span>
					<span className="text-center text-h5">{stat.name}</span>
				</div>
			))}
		</div>
	);
}
