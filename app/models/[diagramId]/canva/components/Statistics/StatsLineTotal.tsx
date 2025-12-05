'use client'

import { StastType } from "../../types"
import { LineStats } from "./LineStats"

export const StatsLineTotal = ({ data }: { data:StastType[] }) => {
	const totalValue = data.reduce((sum, stat) => sum + stat.value, 0);

	return (
		<div className="flex items-center justify-between w-full h-full">
			<LineStats data={data}/>

			<div className="flex flex-col items-center justify-center ">
				<span className="text-h2 font-bold">{totalValue}</span>
				<span className="text-h5">total</span>
			</div>
		</div>
	)
}
