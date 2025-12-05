'use client'

import { useCanvasStore } from "@/state/canvaStore";
import DatabaseDiagram from "@/features/modals/canva/components/DataBaseDiagram";
import { LayoutDiagram } from "@/features/modals/canva/LayoutDiagram";
import { useEffect } from "react";
import type { VersionFrontend } from "@/features/modals/canva/types";

interface DiagramClientProps {
	loaderData: {
		name: string;
		versions: VersionFrontend[];
		solutionId: string;
		last_version_saved: string;
		queries: any[];
	};
}

export default function DiagramClient({ loaderData }: DiagramClientProps) {
	const {
		id,
		setNodes,
		setEdges,
		setQueries,
		setId,
		setVersions,
		setSelectedVersionId,
		_hasHydrated,
	} = useCanvasStore.getState();

	const versionId = loaderData.versions.findIndex(
		(version: VersionFrontend) => loaderData.last_version_saved === version._id,
	);

	useEffect(() => {
		if (_hasHydrated) {
			if (id !== loaderData.solutionId) {
				setId(loaderData.solutionId);
				setNodes(loaderData.versions[versionId].nodes);
				setEdges(loaderData.versions[versionId].edges);
				setQueries(loaderData.queries);
				setVersions(loaderData.versions);
				setSelectedVersionId(loaderData.versions[versionId]._id);
			}
		}
	}, [
		_hasHydrated,
		loaderData,
		versionId,
		setEdges,
		setId,
		setNodes,
		setQueries,
		setVersions,
		setSelectedVersionId,
		id,
	]);

	if (!_hasHydrated) {
		return null;
	}

	return (
		<LayoutDiagram title={loaderData.name}>
			<DatabaseDiagram />
		</LayoutDiagram>
	);
}
