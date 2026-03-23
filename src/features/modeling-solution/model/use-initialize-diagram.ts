"use client";

import { useSolutionStore } from "@fsd/entities/solution";
import type { VersionFrontend } from "@fsd/entities/solution";
import { useEffect, useState } from "react";

interface LoaderData {
	name: string;
	versions: VersionFrontend[];
	solutionId: string;
	last_version_saved: string;
}

export function useInitializeDiagram(loaderData: LoaderData): boolean {
	const [isHydrated, setIsHydrated] = useState(false);

	const { id, setNodes, setEdges, setId, setVersions, setSelectedVersionId } =
		useSolutionStore();

	const versionId = loaderData.versions.findIndex(
		(version: VersionFrontend) => loaderData.last_version_saved === version._id,
	);
	const version = versionId >= 0 ? loaderData.versions[versionId] : null;

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	useEffect(() => {
		if (isHydrated && version && id !== loaderData.solutionId) {
			setId(loaderData.solutionId);
			setNodes(version.nodes);
			setEdges(version.edges);
			setVersions(loaderData.versions);
			setSelectedVersionId(version._id);
		}
	}, [
		isHydrated,
		loaderData,
		version,
		id,
		setNodes,
		setEdges,
		setId,
		setVersions,
		setSelectedVersionId,
	]);

	return isHydrated;
}
