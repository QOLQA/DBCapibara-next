"use client";

import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import { SidebarIcons } from "./SidebarIcons";
import { useState } from "react";
import { SidebarContentPrinc } from "./SidebarContent";
import type { Data, NavItem } from "./types";
import { useAuthContext } from "@fsd/app/providers";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
	navItems: NavItem[];
};

export function AppSidebar({ navItems, ...props }: AppSidebarProps) {
	const { setOpen } = useSidebar();
	const { user: authUser } = useAuthContext();

	const data: Data = {
		user: {
			id: authUser?.id || "",
			username: authUser?.full_name || authUser?.username || "User",
			email: authUser?.email || "",
			is_active: authUser?.is_active || false,
			created_at: authUser?.created_at || "",
			avatar: "/user.png",
		},
		navMain: navItems,
	};

	const [activeItem, setActiveItem] = useState<NavItem>(
		navItems[0] ?? ({} as NavItem)
	);

	return (
		<Sidebar
			collapsible="icon"
			className=" overflow-hidden h-full  [&>[data-sidebar=sidebar]]:flex-row [&>[data-sidebar=sidebar]]:bg-secondary-gray pb-5 bg-secondary-gray"
			{...props}
		>
			<SidebarIcons
				data={data}
				activeItem={activeItem}
				setActiveItem={setActiveItem}
				setOpen={setOpen}
			/>
			<SidebarContentPrinc activeItem={activeItem} />
		</Sidebar>
	);
}
