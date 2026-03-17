"use client";

import { ChartBarStacked } from "./ChartBarStacked";

export function AnalysisDashboard() {
	return (
		<section className="flex flex-col h-full w-full items-center justify-center gap-10 bg-primary-gray rounded-xl p-4">
			<ChartBarStacked />
		</section>
	);
}
