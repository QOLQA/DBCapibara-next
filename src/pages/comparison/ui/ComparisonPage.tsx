"use client";

import {
	DiagramSessionHydrator,
	LayoutDiagram,
} from "@fsd/features/solution-modeling";
import { AppHeader } from "@fsd/features/solution-versioning";
import {
	ComparisonDiagram,
	ComparisonSidebarContent,
} from "@fsd/features/comparison";
import type { NavItem } from "@fsd/features/solution-modeling";
import type { VersionFrontend } from "@fsd/entities/solution";
import { DataPie } from "@/components/icons/SidebarIcons";
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
		[]
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
