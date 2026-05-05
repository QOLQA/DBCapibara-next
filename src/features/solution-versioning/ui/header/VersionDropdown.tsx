"use client";

import { useEffect, useRef } from "react";
import { Check, ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "@fsd/shared/i18n/use-translation";
import { useVersionDropdown } from "../../model/use-version-dropdown";
import { DeleteVersionModal } from "./DeleteVersionModal";

/** Prefix shown in UI only (not sent to backend) */
const PROJECT_PREFIX = "project";

export function VersionDropdown() {
	const { t } = useTranslation();
	const editInputRef = useRef<HTMLInputElement>(null);
	const {
		versions,
		selectedVersionId,
		selectedVersionDescription,
		isOpen,
		toggle,
		dropdownRef,
		onVersionChange,
		onAddEmptyVersion,
		deleteModalOpen,
		versionToDelete,
		openDeleteModal,
		closeDeleteModal,
		confirmDelete,
		canDelete,
		editingVersionId,
		draftDescription,
		isRenamingVersion,
		startEditVersion,
		cancelEditVersion,
		commitEditVersion,
		onDraftDescriptionChange,
	} = useVersionDropdown();

	useEffect(() => {
		if (editingVersionId && editInputRef.current) {
			editInputRef.current.focus();
			editInputRef.current.select();
		}
	}, [editingVersionId]);

	/** Adds "project " prefix for display */
	const formatDisplayName = (description: string) => {
		return `${PROJECT_PREFIX} ${description}`;
	};

	return (
		<div ref={dropdownRef} className="relative">
			{/* Trigger button */}
			<button
				type="button"
				onClick={toggle}
				className="cursor-pointer border border-gray rounded-full !text-white text-h6 w-[200px] py-[7px] px-[20px] flex items-center justify-between gap-2 bg-transparent hover:bg-gray/20 transition-colors"
				aria-haspopup="listbox"
				aria-expanded={isOpen}
			>
				<span className="truncate">
					{formatDisplayName(selectedVersionDescription)}
				</span>
				<ChevronDown
					className={`shrink-0 size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>

			{/* Dropdown panel */}
			{isOpen && (
				<div className="absolute left-0 top-full mt-1 z-50 w-[240px] bg-secondary-gray border border-gray rounded-lg p-[10px] shadow-lg">
					{/* Version list */}
					<ul role="listbox" className="flex flex-col gap-1">
						{versions.map((version) => {
							const isSelected = version._id === selectedVersionId;
							const isEditingRow = editingVersionId === version._id;

							return (
								<li
									key={version._id}
									role="option"
									aria-selected={isSelected}
									className="group flex items-center justify-between gap-1 border-b border-cuartenary-gray last:border-b-0"
								>
									{/* Check icon for selected version */}
									<span className="shrink-0 w-5 flex items-center justify-center">
										{isSelected && <Check className="size-4 text-blue" />}
									</span>

									<div className="flex-1 min-w-0">
										{isEditingRow ? (
											<input
												ref={editInputRef}
												type="text"
												value={draftDescription}
												onChange={(e) =>
													onDraftDescriptionChange(e.target.value)
												}
												disabled={isRenamingVersion}
												maxLength={500}
												onClick={(e) => e.stopPropagation()}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														void commitEditVersion();
													}
													if (e.key === "Escape") {
														e.preventDefault();
														e.stopPropagation();
														cancelEditVersion();
													}
												}}
												className="w-full bg-gray/40 text-white text-h6 rounded-md px-2 py-2 border border-semilighter-gray outline-none focus:ring-1 focus:ring-blue disabled:opacity-50"
												aria-label={t("header.editVersionName")}
											/>
										) : (
											<button
												type="button"
												onClick={() => onVersionChange(version._id)}
												className={`cursor-pointer w-full text-left text-h6 rounded-md px-2 py-2 transition-colors hover:bg-gray hover:text-white focus:outline-none focus:bg-gray focus:text-white ${
													isSelected ? "text-white" : "text-lighter-gray"
												}`}
											>
												<span className="truncate block">
													{formatDisplayName(version.description)}
												</span>
											</button>
										)}
									</div>

									{!isEditingRow && (
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												startEditVersion(version);
											}}
											className="cursor-pointer invisible group-hover:visible shrink-0 p-1 text-lighter-gray hover:text-blue transition-colors rounded focus:outline-none focus:visible"
											title={t("header.editVersionName")}
											aria-label={t("header.editVersionName")}
										>
											<Pencil className="size-4" />
										</button>
									)}

									{canDelete && !isEditingRow && (
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												openDeleteModal(version);
											}}
											className="cursor-pointer invisible group-hover:visible shrink-0 p-1 mr-1 text-lighter-gray hover:text-red transition-colors rounded focus:outline-none focus:visible"
											title={t("common.delete")}
											aria-label={`Delete version ${version.description}`}
										>
											<Trash2 className="size-4" />
										</button>
									)}
								</li>
							);
						})}
					</ul>

					{/* Divider */}
					<div className="my-2 border-t border-cuartenary-gray" />

					{/* Add new version button */}
					<button
						type="button"
						onClick={onAddEmptyVersion}
						className="cursor-pointer w-full flex items-center gap-2 text-h6 text-lighter-gray rounded-md px-3 py-2 hover:bg-gray hover:text-white transition-colors focus:outline-none focus:bg-gray focus:text-white"
					>
						<Plus className="size-4 shrink-0" />
						<span>{t("header.addNewVersion")}</span>
					</button>
				</div>
			)}

			{/* Delete confirmation modal */}
			{deleteModalOpen && (
				<DeleteVersionModal
					open={deleteModalOpen}
					setOpen={closeDeleteModal}
					onConfirm={confirmDelete}
					versionName={versionToDelete?.description}
				/>
			)}
		</div>
	);
}
