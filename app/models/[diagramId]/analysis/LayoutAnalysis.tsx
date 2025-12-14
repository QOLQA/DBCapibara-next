import AppHeader from "./components/Header/AppHeader";

export function LayoutAnalysis({
	children,
	title,
}: {
	children: React.ReactNode;
	title: string;
}) {
	return (
		<>
			<div className="flex flex-col h-screen w-screen z-50 overflow-hidden">
				<AppHeader title={title} />

				<div className="h-full w-full overflow-hidden bg-secondary-gray px-3 pb-3 ">
					{children}
				</div>
			</div>
		</>
	);
}
