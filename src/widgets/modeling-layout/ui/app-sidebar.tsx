"use client";

import { useState } from "react";
import { useAuthContext } from "@fsd/app/providers";
import { Sidebar, useSidebar } from "@fsd/shared/ui/sidebar";
import { SidebarContentPrinc } from "@fsd/widgets/modeling-layout/ui/sidebar-content";
import { SidebarIcons } from "@fsd/widgets/modeling-layout/ui/sidebar-icons";
import type { Data, NavItem } from "@fsd/widgets/modeling-layout/ui/types";

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
