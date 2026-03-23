import { useEffect } from "react";
import { useSolutionStore } from "@fsd/entities/solution";
import type { VersionFrontend } from "@fsd/entities/solution";

export interface DiagramSessionLoaderData {
	solutionId: string;
	versions: VersionFrontend[];
	last_version_saved: string;
}

/**
 * Syncs server-loaded solution/version data into the diagram store when entering
 * routes that rely on the canvas store (e.g. analysis) after direct navigation.
 */
export function useDiagramSessionHydration(
	loaderData: DiagramSessionLoaderData,
) {
	const id = useSolutionStore((state) => state.id);
	const { setId, setNodes, setEdges, setVersions, setSelectedVersionId } =
		useSolutionStore();

	useEffect(() => {
		if (id !== loaderData.solutionId) {
			const versionIndex = loaderData.versions.findIndex(
				(v) => v._id === loaderData.last_version_saved,
			);
			if (versionIndex >= 0) {
				const version = loaderData.versions[versionIndex];
				setId(loaderData.solutionId);
				setNodes(version.nodes);
				setEdges(version.edges);
				setVersions(loaderData.versions);
				setSelectedVersionId(version._id);
			}
		}
	}, [
		loaderData.solutionId,
		loaderData.versions,
		loaderData.last_version_saved,
		id,
		setId,
		setNodes,
		setEdges,
		setVersions,
		setSelectedVersionId,
	]);
}
