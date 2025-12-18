"use client";

import {
	Sidebar,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export const SidebarContentPrinc = () => {
	return (
		<Sidebar
			collapsible="none"
			className="hidden flex-1 md:flex bg-cuartenary-gray rounded-2xl p-[36px] text-white gap-y-[16px]  "
		>
			<SidebarHeader className="gap-3.5 border-b-2 border-semilighter-gray py-4 px-0 ">
				<div className="flex w-full items-center justify-between ">
					<div className="text-base font-medium text-white text-h3 ">
						Comparison
					</div>
					<div>EXPANDIR</div>
				</div>
			</SidebarHeader>
			<SidebarGroupContent className="h-full overflow-hidden rounded-2xl">
				<SidebarGroup className="px-0 h-full">
					<SidebarGroupContent className="h-full">
						<div>CONTENT</div>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarGroupContent>
		</Sidebar>
	);
};
