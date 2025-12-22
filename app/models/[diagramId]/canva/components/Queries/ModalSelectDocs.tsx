"use client";

import { Modal } from "@/components/ui/modal";
import { useCanvasStore } from "@/state/canvaStore";
import { useUniqueId } from "@/hooks/use-unique-id";
import { getUniqueTableNames } from "@/lib/getHandledQueries";
import { useTableSelection } from "@/hooks/use-table-selection";
import { useQueryOperations } from "@/hooks/use-query-operations";
import { WordToggleButtons } from "./WordToggleButtons";
import { SelectedTablesList } from "./SelectedTablesList";
import { AddDocumentSection } from "./AddDocumentSection";
import type { Query } from "../../types";
import { useState } from "react";

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
	const { nodes } = useCanvasStore();
	const generateId = useUniqueId();
	const { createQuery, updateQuery } = useQueryOperations();
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Get all available table names from nodes
	const availableTableNames = getUniqueTableNames(nodes);

	// Use custom hook for table selection logic
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
						<SelectedTablesList
							selectedTables={selectedTables}
							onRemove={removeTable}
						/>

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
						<p className="text-blue-500 mt-4 text-sm">
							Saving query...
						</p>
					)}
				</div>
			</>
		</Modal>
	);
};
