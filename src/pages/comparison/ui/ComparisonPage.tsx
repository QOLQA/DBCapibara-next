"use client";

import { DiagramSessionHydrator } from "@fsd/widgets/diagram-session";
import { LayoutDiagram } from "@fsd/widgets/modeling-layout";
import { AppHeader } from "@fsd/features/solution-versioning";
import {
	ComparisonDiagram,
	ComparisonSidebarContent,
} from "@fsd/features/comparison";
import type { NavItem } from "@fsd/widgets/modeling-sidebar";
import type { VersionFrontend } from "@fsd/entities/solution";
import { DataPie } from "@fsd/shared/ui/icons/SidebarIcons";
import { useMemo } from "react";

interface ComparisonPageProps {
	loaderData: {
		name: string;
		solutionId: string;
		versions: VersionFrontend[];
		last_version_saved: string;
	};
}

export function ComparisonPage({ loaderData }: ComparisonPageProps) {
	const sidebarNavItems: NavItem[] = useMemo(
		() => [
			{
				title: "Comparison",
				icon: <DataPie />,
				isActive: true,
				content: <ComparisonSidebarContent />,
			},
		],
		[],
	);

	return (
		<>
			<DiagramSessionHydrator
				loaderData={{
					solutionId: loaderData.solutionId,
					versions: loaderData.versions,
					last_version_saved: loaderData.last_version_saved,
				}}
			/>
			<LayoutDiagram
				title={loaderData.name}
				headerSlot={<AppHeader title={loaderData.name} />}
				sidebarNavItems={sidebarNavItems}
				sidebarDefaultOpen={true}
			>
				<ComparisonDiagram />
			</LayoutDiagram>
		</>
	);
}
