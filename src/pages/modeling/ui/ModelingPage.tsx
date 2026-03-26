"use client";

import { useInitializeDiagram } from "@fsd/features/modeling-solution";
import { useSyncQueriesForSolution } from "@fsd/features/manage-queries";
import { AppHeader } from "@fsd/widgets/modeling-header";
import { QueriesPanel } from "@fsd/widgets/queries-panel";
import { DataBaseDiagram } from "@fsd/widgets/diagram-canvas";
import { JsonEditor } from "@fsd/widgets/json-editor";
import {
	LayoutDiagram,
	type NavItem,
} from "@fsd/widgets/modeling-layout";
import { MetricsPanel } from "@fsd/widgets/metrics-panel";
import type { VersionFrontend } from "@fsd/entities/solution";
import {
	Calendar,
	Database,
	DataPie,
} from "@fsd/shared/ui/icons/SidebarIcons";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

interface ModelingPageProps {
	loaderData: {
		name: string;
		versions: VersionFrontend[];
		solutionId: string;
		last_version_saved: string;
	};
}

export function ModelingPage({ loaderData }: ModelingPageProps) {
	const router = useRouter();
	const { diagramId } = useParams<{ diagramId: string }>() as {
		diagramId: string;
	};
	const isHydrated = useInitializeDiagram(loaderData);
	useSyncQueriesForSolution(loaderData.solutionId);

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
				content: <MetricsPanel />,
				aditionalToTitle: {
					type: "button",
					onClick: () => {
						router.push(`/projects/${diagramId}/analysis`);
					},
					titleButton: "Compare schemas",
				},
			},
			/* {
				title: "JSON Editor",
				icon: <Database />,
				content: <JsonEditor />,
			}, */
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
