"use client";

import {
	Sidebar,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
} from "@/components/ui/sidebar";
import type { NavItem } from "./types";
import { Button } from "@/components/ui/button";

type SidebarContentPrincProps = {
	activeItem: NavItem;
};

export const SidebarContentPrinc = ({
	activeItem,
}: SidebarContentPrincProps) => {
	return (
		<Sidebar
			collapsible="none"
			className="hidden flex-1 md:flex bg-cuartenary-gray rounded-2xl p-[36px] text-white gap-y-[16px]  "
		>
			<SidebarHeader className="gap-3.5 border-b-2 border-semilighter-gray py-4 px-0 ">
				<div className="flex w-full items-center justify-between ">
					<div className="text-base font-medium text-white text-h3 ">
						{activeItem?.title}
					</div>
					{activeItem?.aditionalToTitle === "button" && (
						<Button
							variant={"outline"}
							type="button"
							onClick={() => {}}
							className="w-[6rem] cursor-pointer border-none text-h3 text-white bg-gray hover:bg-semilighter-gray hover:text-white w-fit"
						>
							Compare schemas
						</Button>
					)}
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
