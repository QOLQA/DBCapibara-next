"use client";

import { Logo } from "@/components/icons/HeaderIcons";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { canvaSelector, useCanvasStore } from "@/state/canvaStore";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/shallow";
import { saveCanvas } from "@/lib/saveCanvas";

// components/header/LogoWithSelect.tsx
export const LogoWithSelect = () => {
	const router = useRouter();
	const {
		versions,
		selectedVersionId,
		setSelectedVersionId,
		setNodes,
		setEdges,
	} = useCanvasStore<ReturnType<typeof canvaSelector>>(
		useShallow(canvaSelector)
	);
	const Id = useCanvasStore((state) => state.id);
	const setIsChangingVersion = useCanvasStore(
		(state) => state.setIsChangingVersion
	);

	const onVersionChange = async (newVersionId: string) => {
		// Mostrar loader
		setIsChangingVersion(true);

		try {
			// saveCanvas usa hash para evitar guardados innecesarios
			await saveCanvas(Id, selectedVersionId, undefined, false);
		} catch (error) {
			console.error("Error al guardar antes de cambiar de versión:", error);
			// Continuar con el cambio aunque falle el guardado
		}

		// DESPUÉS de guardar, cambiar a la nueva versión
		const updatedVersions = useCanvasStore.getState().versions;
		const versionIndex = updatedVersions.findIndex(
			(version) => version._id === newVersionId
		);

		// Cambiar UI
		setNodes(updatedVersions[versionIndex].nodes);
		setEdges(updatedVersions[versionIndex].edges);
		setSelectedVersionId(newVersionId);

		// Ocultar loader después de un pequeño delay para que React Flow renderice
		setTimeout(() => {
			setIsChangingVersion(false);
		}, 100);
	};

	return (
		<div className="flex items-center gap-8">
			<div onClick={() => router.push("/models")} className="cursor-pointer">
				<Logo className="text-blue" />
			</div>
			<Select value={selectedVersionId} onValueChange={onVersionChange}>
				<SelectTrigger className="border-gray rounded-full !text-white text-h6 w-[153px] py-[7px] px-[20px]">
					<SelectValue />
				</SelectTrigger>
				<SelectContent className="!text-white bg-secondary-gray border-gray p-[10px] w-[240px]">
					{versions.map((version) => (
						<SelectItem
							key={version._id}
							value={version._id}
							className="border-b-[1px] text-h6 !border-cuartenary-gray hover:!bg-gray hover:!text-white focus:!bg-gray focus:!text-white rounded-md"
						>
							{version.description}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};
