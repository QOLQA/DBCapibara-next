"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { useSolutionStore, solutionSelector } from "@fsd/entities/solution";
import type { VersionFrontend } from "@fsd/entities/solution";
import { toast } from "sonner";
import { saveCanvas } from "../lib";
import {
	createEmptyVersion,
	deleteVersion,
	generateNextMajorVersion,
} from "../lib/versions";

export interface UseVersionDropdownReturn {
	// Data
	versions: VersionFrontend[];
	selectedVersionId: string;
	selectedVersionDescription: string;

	// Dropdown state
	isOpen: boolean;
	toggle: () => void;
	close: () => void;
	dropdownRef: React.RefObject<HTMLDivElement | null>;

	// Actions
	onVersionChange: (versionId: string) => Promise<void>;
	onAddEmptyVersion: () => Promise<void>;

	// Delete modal state
	deleteModalOpen: boolean;
	versionToDelete: VersionFrontend | null;
	openDeleteModal: (version: VersionFrontend) => void;
	closeDeleteModal: () => void;
	confirmDelete: () => Promise<void>;

	// Guards
	canDelete: boolean;
}

export function useVersionDropdown(): UseVersionDropdownReturn {
	const {
		versions,
		selectedVersionId,
		setSelectedVersionId,
		setNodes,
		setEdges,
	} = useSolutionStore(useShallow(solutionSelector));

	const solutionId = useSolutionStore((state) => state.id);
	const setIsChangingVersion = useSolutionStore(
		(state) => state.setIsChangingVersion
	);

	// Dropdown open/close state
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Delete modal state
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [versionToDelete, setVersionToDelete] =
		useState<VersionFrontend | null>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Close dropdown on Escape key
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
	const close = useCallback(() => setIsOpen(false), []);

	const selectedVersion = versions.find((v) => v._id === selectedVersionId);
	const selectedVersionDescription = selectedVersion?.description ?? "";

	const onVersionChange = useCallback(
		async (newVersionId: string) => {
			if (newVersionId === selectedVersionId) {
				setIsOpen(false);
				return;
			}

			setIsChangingVersion(true);

			try {
				await saveCanvas(solutionId, selectedVersionId, undefined, false);
			} catch (error) {
				console.error("Error al guardar antes de cambiar de versión:", error);
			}

			const updatedVersions = useSolutionStore.getState().versions;
			const versionIndex = updatedVersions.findIndex(
				(version) => version._id === newVersionId
			);

			if (versionIndex === -1) {
				console.error(`[useVersionDropdown] Version not found: ${newVersionId}`);
				setIsChangingVersion(false);
				return;
			}

			setNodes(updatedVersions[versionIndex].nodes);
			setEdges(updatedVersions[versionIndex].edges);
			setSelectedVersionId(newVersionId);

			setTimeout(() => {
				setIsChangingVersion(false);
			}, 100);

			setIsOpen(false);
		},
		[
			solutionId,
			selectedVersionId,
			setEdges,
			setIsChangingVersion,
			setNodes,
			setSelectedVersionId,
		]
	);

	const onAddEmptyVersion = useCallback(async () => {
		const currentVersions = useSolutionStore.getState().versions;
		const description = generateNextMajorVersion(currentVersions);

		try {
			await createEmptyVersion(solutionId, description);
			toast.success("New version created successfully.");
		} catch (error) {
			console.error("Error creating version:", error);
			toast.error("Error creating version.");
		}

		setIsOpen(false);
	}, [solutionId]);

	const openDeleteModal = useCallback((version: VersionFrontend) => {
		setVersionToDelete(version);
		setDeleteModalOpen(true);
		setIsOpen(false); // Close dropdown when opening modal
	}, []);

	const closeDeleteModal = useCallback(() => {
		setDeleteModalOpen(false);
		setVersionToDelete(null);
	}, []);

	const confirmDelete = useCallback(async () => {
		if (!versionToDelete) return;

		try {
			await deleteVersion(versionToDelete._id);
			toast.success("Version deleted successfully.");
		} catch (error) {
			console.error("Error deleting version:", error);
			toast.error("Error deleting version.");
			throw error; // re-throw so modal stays open on error
		}

		setDeleteModalOpen(false);
		setVersionToDelete(null);
	}, [versionToDelete]);

	const canDelete = versions.length > 1;

	return {
		versions,
		selectedVersionId,
		selectedVersionDescription,
		isOpen,
		toggle,
		close,
		dropdownRef,
		onVersionChange,
		onAddEmptyVersion,
		deleteModalOpen,
		versionToDelete,
		openDeleteModal,
		closeDeleteModal,
		confirmDelete,
		canDelete,
	};
}
