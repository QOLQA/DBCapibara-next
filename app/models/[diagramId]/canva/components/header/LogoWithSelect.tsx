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
import { saveCanvas } from "@/lib/canvas/save";
import { createEmptyVersion, generateEmptyVersionDescription } from "@/lib/canvas/versions";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/use-translation";

// components/header/LogoWithSelect.tsx
export const LogoWithSelect = () => {
	const router = useRouter();
	const { t } = useTranslation();
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

	const handleCreateEmptyVersion = async () => {
		if (!Id) {
			toast.error(t("toasts.errorCreatingVersion") || "Error: No solution selected");
			return;
		}

		try {
			// Save current version first if there are changes
			try {
				await saveCanvas(Id, selectedVersionId, undefined, false);
			} catch (error) {
				console.error("Error saving before creating version:", error);
				// Continue with creation even if save fails
			}

			// Generate description for new version
			const description = generateEmptyVersionDescription(versions);

			// Create empty version
			const newVersion = await createEmptyVersion(Id, description);

			// Update selected version ID in store
			setSelectedVersionId(newVersion._id);

			// Refresh the page to update the URL and reload data
			router.refresh();

			toast.success(t("toasts.versionCreated") || "Version created successfully");
		} catch (error) {
			console.error("Error creating version:", error);
			toast.error(t("toasts.errorCreatingVersion") || "Error creating version");
		}
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
							className="border-b-[1px] text-h6 !border-cuartenary-gray hover:!bg-gray hover:!text-white focus:!bg-gray focus:!text-white !rounded-md"
						>
							{version.description}
						</SelectItem>
					))}
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							handleCreateEmptyVersion();
						}}
						className="w-full mt-2 py-2 px-4 text-h6 text-white bg-gray hover:bg-primary-gray rounded-md border border-cuartenary-gray flex items-center justify-center gap-2 transition-colors"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M8 3.5C8.41421 3.5 8.75 3.83579 8.75 4.25V7.25H11.75C12.1642 7.25 12.5 7.58579 12.5 8C12.5 8.41421 12.1642 8.75 11.75 8.75H8.75V11.75C8.75 12.1642 8.41421 12.5 8 12.5C7.58579 12.5 7.25 12.1642 7.25 11.75V8.75H4.25C3.83579 8.75 3.5 8.41421 3.5 8C3.5 7.58579 3.83579 7.25 4.25 7.25H7.25V4.25C7.25 3.83579 7.58579 3.5 8 3.5Z"
								fill="currentColor"
							/>
						</svg>
						{t("header.newVersion") || "Nueva versión"}
					</button>
				</SelectContent>
			</Select>
		</div>
	);
};
