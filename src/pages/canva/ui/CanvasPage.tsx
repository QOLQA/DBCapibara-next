"use client";

import { DiagramClient } from "@fsd/features/solution-modeling";
import type { NavItem } from "@fsd/features/solution-modeling";
import { AppHeader } from "@fsd/features/solution-versioning";
import { QueriesPanel } from "@fsd/widgets/queries-panel";
import { AppStatistics } from "@fsd/features/statistics";
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
						router.push(`/models/${diagramId}/analysis`);
					},
					titleButton: "Compare schemas",
				},
			},
		],
		[diagramId, router]
	);

	return (
		<DiagramClient
			loaderData={loaderData}
			headerSlot={<AppHeader title={loaderData.name} />}
			sidebarNavItems={sidebarNavItems}
		/>
	);
}
