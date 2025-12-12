"use client";

import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import { Calendar, Database, DataPie } from "@/components/icons/SidebarIcons";
import { SidebarIcons } from "./SidebarIcons";
import { useState } from "react";
import { SidebarContentPrinc } from "./SidebarContent";
import { AppQueries } from "../Queries/AppQueries";
import type { Data, NavItem } from "./types";
import { AppStatistics } from "../Statistics/AppStatistics";
import { useParams, useRouter } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { setOpen } = useSidebar();
	const router = useRouter();
	const { diagramId } = useParams<{ diagramId: string }>() as {
		diagramId: string;
	};

	const data: Data = {
		user: {
			name: "shadcn",
			email: "m@example.com",
			avatar: "/user.png",
		},
		navMain: [
			{
				title: "Database",
				icon: <Database />,
				isActive: true,
			},
			{
				title: "Consultas",
				icon: <Calendar />,
				content: <AppQueries />,
			},
			{
				title: "Estadísticas",
				icon: <DataPie />,
				content: <AppStatistics />,
				aditionalToTitle: {
					type: "button",
					onClick: () => {
						router.push(`/models/${diagramId}/analysis`);
					},
					titleButton: "Compare schemas",
				},
			},
		],
	};

	const [activeItem, setActiveItem] = useState<NavItem>(data.navMain[0]);

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
