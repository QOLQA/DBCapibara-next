'use client'

import {
	Sidebar,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
} from "@/components/ui/sidebar";
import type { NavItem } from "./types";

type SidebarContentPrincProps = {
	activeItem: NavItem;
};

export const SidebarContentPrinc = ({
	activeItem,
}: SidebarContentPrincProps) => {
	return (
		<Sidebar
			collapsible="none"
			className="hidden flex-1 md:flex bg-cuartenary-gray rounded-2xl p-[36px] text-white	"
		>
			<SidebarHeader className="gap-3.5 border-b border-lighter-gray p-4">
				<div className="flex w-full items-center justify-center">
					<div className="text-base font-medium text-white text-h3">
						{activeItem?.title}
					</div>
				</div>
			</SidebarHeader>
			<SidebarGroupContent className="h-full overflow-hidden rounded-2xl">
				<SidebarGroup className="px-0 h-full">
					<SidebarGroupContent className="h-full">
						{activeItem?.content}
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarGroupContent>
		</Sidebar>
	);
};
