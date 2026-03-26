"use client";

import { useCallback } from "react";
import { useShallow } from "zustand/shallow";
import { useSolutionStore, solutionSelector } from "@fsd/entities/solution";
import { saveCanvas } from "../lib";

/** Lógica del selector de versión del diagrama (guardar, aplicar nodos/aristas). */
export function useVersionSelect() {
	const {
		versions,
		selectedVersionId,
		setSelectedVersionId,
		setNodes,
		setEdges,
	} = useSolutionStore(useShallow(solutionSelector));
	const Id = useSolutionStore((state) => state.id);
	const setIsChangingVersion = useSolutionStore(
		(state) => state.setIsChangingVersion,
	);

	const onVersionChange = useCallback(
		async (newVersionId: string) => {
			setIsChangingVersion(true);

			try {
				await saveCanvas(Id, selectedVersionId, undefined, false);
			} catch (error) {
				console.error("Error al guardar antes de cambiar de versión:", error);
			}

			const updatedVersions = useSolutionStore.getState().versions;
			const versionIndex = updatedVersions.findIndex(
				(version) => version._id === newVersionId,
			);

			if (versionIndex === -1) {
				console.error(`[useVersionSelect] Version not found: ${newVersionId}`);
				setIsChangingVersion(false);
				return;
			}

			setNodes(updatedVersions[versionIndex].nodes);
			setEdges(updatedVersions[versionIndex].edges);
			setSelectedVersionId(newVersionId);

			setTimeout(() => {
				setIsChangingVersion(false);
			}, 100);
		},
		[
			Id,
			selectedVersionId,
			setEdges,
			setIsChangingVersion,
			setNodes,
			setSelectedVersionId,
		],
	);

	return {
		versions,
		selectedVersionId,
		onVersionChange,
	};
}
