"use client";

import { Modal } from "@fsd/shared/ui/modal";
import { useSolutionStore } from "@fsd/entities/solution";
import { getUniqueTableNames } from "@fsd/entities/solution/lib/analytics";
import type { Query } from "@fsd/entities/solution";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useQueryOperations } from "../model/use-query-operations";
import { useTableSelection } from "../model/use-table-selection";
import { useUniqueId } from "@fsd/shared/lib/ids/use-unique-id";
import { AddDocumentSection } from "./addDocumentSection";
import { WordToggleButtons } from "./wordToggleButtons";

type ModalProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	queryText: string;
	queryEdit?: Query;
	mode: "create" | "edit";
	setQueryText: (query: string) => void;
	onReturn: () => void;
};

export const ModalSelectDocs = ({
	open,
	setOpen,
	queryText,
	queryEdit,
	mode,
	setQueryText,
	onReturn,
}: ModalProps) => {
	const { nodes } = useSolutionStore();
	const generateId = useUniqueId();
	const { createQuery, updateQuery } = useQueryOperations();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const availableTableNames = getUniqueTableNames(nodes);

	const {
		selectedTables,
		highlightedWords,
		error,
		words,
		addTable,
		removeTable,
		toggleWord,
		clearSelection,
		validateSelection,
	} = useTableSelection(queryText, availableTableNames, open);

	const handleClose = () => {
		setOpen(false);
		setQueryText("");
		clearSelection();
	};

	const handleReturnModal = () => {
		clearSelection();
		onReturn();
	};

	const handleSubmitQuery = async () => {
		if (!queryText.trim() || !validateSelection() || isSubmitting) {
			return;
		}

		setIsSubmitting(true);

		try {
			if (mode === "create") {
				const tempId = generateId();
				await createQuery(
					{
						full_query: queryText,
						collections: selectedTables,
						highlighted_words: highlightedWords,
					},
					tempId
				);
			} else if (queryEdit) {
				await updateQuery(queryEdit._id, {
					full_query: queryText,
					collections: selectedTables,
					highlighted_words: highlightedWords,
				});
			}

			handleClose();
		} catch (error) {
			console.error("Error submitting query:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Modal
			title="New Query"
			open={open}
			setOpen={setOpen}
			onSubmit={handleSubmitQuery}
			type={mode === "edit" ? "update" : "create"}
			onReturnPreviewsStep={handleReturnModal}
		>
			<>
				<div className="my-13 gap-5 w-160 flex justify-between items-start flex-col relative">
					<p className="text-h3 text-secondary-white mb-2">
						Choose your collections
					</p>

					<WordToggleButtons
						words={words}
						availableTableNames={availableTableNames}
						selectedTables={selectedTables}
						onToggle={toggleWord}
					/>

					<p className="text-h3 text-secondary-white mb-2 mt-4">
						Selected Collections
					</p>

					<div className="w-full flex flex-col gap-2">
						{selectedTables.length > 0 && (
							<div className="w-full flex flex-col gap-2">
								{selectedTables.map((tableName) => (
									<div
										key={tableName}
										className="flex items-center justify-between px-4 py-3 bg-terciary-gray border border-gray rounded-lg group hover:border-secondary-white transition-colors duration-200"
									>
										<span className="text-secondary-white text-h4">
											{tableName}
										</span>
										<button
											type="button"
											onClick={() => removeTable(tableName)}
											className="text-lighter-gray hover:text-red-500 transition-colors duration-200"
											aria-label={`Remove ${tableName}`}
										>
											<Trash2 className="w-5 h-5" />
										</button>
									</div>
								))}
							</div>
						)}

						<AddDocumentSection
							availableTableNames={availableTableNames}
							selectedTables={selectedTables}
							onAddTable={addTable}
						/>
					</div>

					{error && (
						<p className="text-red-500 mt-4 text-sm">
							You must select at least one table and write a query.
						</p>
					)}

					{isSubmitting && (
						<p className="text-blue-500 mt-4 text-sm">Saving query...</p>
					)}
				</div>
			</>
		</Modal>
	);
};
