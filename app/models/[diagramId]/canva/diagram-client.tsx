'use client'

import { useCanvasStore } from "@/state/canvaStore";
import { DataBaseDiagram } from "./components/Diagram";
import { LayoutDiagram } from "./LayoutDiagram";
import { useEffect, useState } from "react";
import type { VersionFrontend } from "./types";

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
	const [isHydrated, setIsHydrated] = useState(false);

	const {
		id,
		setNodes,
		setEdges,
		setQueries,
		setId,
		setVersions,
		setSelectedVersionId,
	} = useCanvasStore();

	const versionId = loaderData.versions.findIndex(
		(version: VersionFrontend) => loaderData.last_version_saved === version._id,
	);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	useEffect(() => {
		if (isHydrated && id !== loaderData.solutionId) {
			setId(loaderData.solutionId);
			setNodes(loaderData.versions[versionId].nodes);
			setEdges(loaderData.versions[versionId].edges);
			setQueries(loaderData.queries);
			setVersions(loaderData.versions);
			setSelectedVersionId(loaderData.versions[versionId]._id);
		}
	}, [
		isHydrated,
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

	return (
		<LayoutDiagram title={loaderData.name}>
			{isHydrated ? <DataBaseDiagram /> : <div className="h-full w-full" />}
		</LayoutDiagram>
	);
}
