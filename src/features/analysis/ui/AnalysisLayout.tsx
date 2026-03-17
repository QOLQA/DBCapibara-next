"use client";

import { AnalysisHeader } from "./AnalysisHeader";

export function AnalysisLayout({
	children,
	title,
	headerSlot,
}: {
	children: React.ReactNode;
	title: string;
	headerSlot?: React.ReactNode;
}) {
	return (
		<div className="flex flex-col h-screen w-screen z-50 overflow-hidden">
			{headerSlot ?? <AnalysisHeader title={title} />}
			<div className="h-full w-full overflow-hidden bg-secondary-gray px-3 pb-3 ">
				{children}
			</div>
		</div>
	);
}
