import { SidebarInset, SidebarProvider } from "@fsd/shared/ui/sidebar";
import { AppSidebar } from "./sidebar/AppSidebar";
import type { NavItem } from "./sidebar/types";

export function LayoutDiagram({
	children,
	title,
	headerSlot,
	sidebarNavItems = [],
	sidebarDefaultOpen = false,
}: {
	children: React.ReactNode;
	title: string;
	headerSlot?: React.ReactNode;
	sidebarNavItems?: NavItem[];
	sidebarDefaultOpen?: boolean;
}) {
	return (
		<>
			<div className="flex flex-col h-screen w-screen z-50 overflow-hidden">
				{headerSlot ?? null}

				<SidebarProvider
					className="overflow-hidden h-full w-full bg-secondary-gray gap-4"
					defaultOpen={sidebarDefaultOpen}
				>
					<AppSidebar navItems={sidebarNavItems} />
					<SidebarInset className="h-full w-full ">
						<div className="h-full w-full overflow-hidden">{children}</div>
					</SidebarInset>
				</SidebarProvider>
			</div>
		</>
	);
}
