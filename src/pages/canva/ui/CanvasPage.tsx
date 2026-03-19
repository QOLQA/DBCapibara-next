"use client";

import { useInitializeDiagram } from "@fsd/features/solution-modeling";
import { AppHeader } from "@fsd/features/solution-versioning";
import { QueriesPanel } from "@fsd/widgets/queries-panel";
import { AppStatistics } from "@fsd/features/statistics";
import { DataBaseDiagram } from "@fsd/widgets/diagram-canvas";
import { LayoutDiagram } from "@fsd/widgets/modeling-layout";
import type { NavItem } from "@fsd/widgets/modeling-sidebar";
import type { VersionFrontend } from "@fsd/entities/solution";
import { Calendar, Database, DataPie } from "@fsd/shared/ui/icons/SidebarIcons";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

interface CanvasPageProps {
	loaderData: {
		name: string;
		versions: VersionFrontend[];
		solutionId: string;
		last_version_saved: string;
	};
}

export function CanvasPage({ loaderData }: CanvasPageProps) {
	const router = useRouter();
	const { diagramId } = useParams<{ diagramId: string }>() as {
		diagramId: string;
	};
	const isHydrated = useInitializeDiagram(loaderData);

	const sidebarNavItems: NavItem[] = useMemo(
		() => [
			{
				title: "Database",
				icon: <Database />,
				isActive: true,
			},
			{
				title: "Queries",
				icon: <Calendar />,
				content: <QueriesPanel />,
			},
			{
				title: "Statistics",
				icon: <DataPie />,
				content: <AppStatistics />,
				aditionalToTitle: {
					type: "button",
					onClick: () => {
						router.push(`/projects/${diagramId}/analysis`);
					},
					titleButton: "Compare schemas",
				},
			},
		],
		[diagramId, router],
	);

	return (
		<LayoutDiagram
			title={loaderData.name}
			headerSlot={<AppHeader title={loaderData.name} />}
			sidebarNavItems={sidebarNavItems}
		>
			{isHydrated ? <DataBaseDiagram /> : <div className="h-full w-full" />}
		</LayoutDiagram>
	);
}
