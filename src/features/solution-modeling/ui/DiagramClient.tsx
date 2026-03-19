"use client";

import { useSolutionStore } from "@fsd/entities/solution";
import { DataBaseDiagram } from "@fsd/widgets/diagram-canvas";
import { LayoutDiagram } from "@fsd/widgets/modeling-layout";
import { useEffect, useState } from "react";
import type { VersionFrontend } from "@fsd/entities/solution";
import type { NavItem } from "@fsd/widgets/modeling-sidebar";

interface DiagramClientProps {
	loaderData: {
		name: string;
		versions: VersionFrontend[];
		solutionId: string;
		last_version_saved: string;
	};
	headerSlot?: React.ReactNode;
	sidebarNavItems?: NavItem[];
}

export default function DiagramClient({
	loaderData,
	headerSlot,
	sidebarNavItems,
}: DiagramClientProps) {
	const [isHydrated, setIsHydrated] = useState(false);

	const {
		id,
		setNodes,
		setEdges,
		setId,
		setVersions,
		setSelectedVersionId,
	} = useSolutionStore();

	const versionId = loaderData.versions.findIndex(
		(version: VersionFrontend) =>
			loaderData.last_version_saved === version._id
	);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	useEffect(() => {
		if (isHydrated && id !== loaderData.solutionId) {
			setId(loaderData.solutionId);
			setNodes(loaderData.versions[versionId].nodes);
			setEdges(loaderData.versions[versionId].edges);
			setVersions(loaderData.versions);
			setSelectedVersionId(loaderData.versions[versionId]._id);
		}
	}, [isHydrated, loaderData, versionId, id, setNodes, setEdges, setId, setVersions, setSelectedVersionId]);

	return (
		<LayoutDiagram
			title={loaderData.name}
			headerSlot={headerSlot}
			sidebarNavItems={sidebarNavItems}
		>
			{isHydrated ? <DataBaseDiagram /> : <div className="h-full w-full" />}
		</LayoutDiagram>
	);
}
