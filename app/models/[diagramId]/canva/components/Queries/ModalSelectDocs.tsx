"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ArrowLeft } from "lucide-react";
import { useCanvasStore } from "@/state/canvaStore";
import { useUniqueId } from "@/hooks/use-unique-id";
import { getUniqueTableNames } from "@/lib/getHandledQueries";
import { useTableSelection } from "@/hooks/use-table-selection";
import { WordToggleButtons } from "./WordToggleButtons";
import { SelectedTablesList } from "./SelectedTablesList";
import { AddDocumentSection } from "./AddDocumentSection";
import type { Query } from "../../types";

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
	const { addQuery, editQuery, nodes } = useCanvasStore();
	const generateId = useUniqueId();

	// Get all available table names from nodes
	const availableTableNames = getUniqueTableNames(nodes);

	// Use custom hook for table selection logic
	const {
		selectedTables,
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

	const handleSubmitQuery = () => {
		if (!queryText.trim() || !validateSelection()) {
			return;
		}

		const queryData = {
			id: mode === "create" ? generateId() : queryEdit?.id || "",
			full_query: queryText,
			collections: selectedTables,
		};

		mode === "create"
			? addQuery(queryData)
			: editQuery(queryData.id, queryData);

		handleClose();
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
				</div>
			</>
		</Modal>
	);
};
