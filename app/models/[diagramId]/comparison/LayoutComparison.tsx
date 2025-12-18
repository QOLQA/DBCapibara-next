import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "../analysis/components/Header/AppHeader";
import { AppSidebar } from "./components/sidebar/AppSidebar";

export function LayoutComparison({
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

				<SidebarProvider
					className="overflow-hidden h-full w-full bg-secondary-gray gap-4 pl-4"
					defaultOpen={true}
				>
					<AppSidebar />
					<SidebarInset className="h-full w-full ">
						<div className="h-full w-full overflow-hidden">{children}</div>
					</SidebarInset>
				</SidebarProvider>
			</div>
		</>
	);
}
