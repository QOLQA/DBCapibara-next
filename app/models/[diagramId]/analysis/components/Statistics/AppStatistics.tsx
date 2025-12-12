import React from "react";
import { ChartBarStacked } from "./ChartBarStacked";

const AppStatistics = () => {
	return (
		<section className="flex flex-col h-full w-full items-center justify-center gap-10 bg-primary-gray rounded-xl p-4">
			<ChartBarStacked />
		</section>
	);
};

export default AppStatistics;
