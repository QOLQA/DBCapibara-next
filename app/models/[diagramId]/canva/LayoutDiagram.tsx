import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/Sidebar/AppSidebar";
import { AppHeader } from "./components/header/AppHeader";

export function LayoutDiagram({
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
					className="overflow-hidden h-full w-full bg-secondary-gray gap-4"
					defaultOpen={false}
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
