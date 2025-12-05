'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ArrowLeft } from "lucide-react";
import { useCanvasStore } from "@/state/canvaStore";
import { useUniqueId } from "@/hooks/use-unique-id";
import clsx from "clsx";
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
	const words = queryText.trim().split(/\s+/);
	const [selectedWords, setSelectedWords] = useState<string[]>([]);
	const [error, setError] = useState(false);

	const { addQuery, editQuery } = useCanvasStore();
	const generateId = useUniqueId();

	const toggleWord = (word: string) => {
		setSelectedWords((prev) =>
			prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word],
		);
		setError(false);
	};

	const handleClose = () => {
		setOpen(false);
		setQueryText("");
		setSelectedWords([]);
		setError(false);
	};

	const handleReturnModal = () => {
		setSelectedWords([]);
		setError(false);
		onReturn();
	};

	const handleSubmitQuery = () => {
		if (!queryText.trim() || selectedWords.length === 0) {
			setError(true);
			return;
		}

		const queryData = {
			id: mode === "create" ? generateId() : queryEdit?.id || "",
			full_query: queryText,
			collections: selectedWords,
		};

		mode === "create"
			? addQuery(queryData)
			: editQuery(queryData.id, queryData);

		handleClose();
	};

	return (
		<Modal 
			title="Nueva Consulta" 
			open={open} 
			setOpen={setOpen}
			onSubmit={handleSubmitQuery}
			type={mode === "edit" ? "update" : "create"}
		>
			<>
				<div className="my-13 gap-5 w-160 flex justify-between items-start flex-col relative">
					<p className="text-h3 text-secondary-white mb-2">
						Escoge tus colecciones
					</p>

					<div className="flex flex-wrap gap-3">
						{words.map((word, index) => (
							<button
								key={`${index}-${word}`}
								type="button"
								onClick={() => toggleWord(word)}
								className={clsx(
									"cursor-pointer px-4 py-2 rounded-lg border border-gray transition-colors duration-200",
									selectedWords.includes(word)
										? "bg-gray text-white"
										: "bg-transparent text-secondary-white",
								)}
								aria-pressed={selectedWords.includes(word)}
								aria-label={`Seleccionar colección ${word}`}
							>
								{word}
							</button>
						))}
					</div>

					{error && (
						<p className="text-red-500 mt-4 text-sm">
							Debes seleccionar al menos una palabra y escribir una consulta.
						</p>
					)}

					<Button
						onClick={handleReturnModal}
						className="cursor-pointer absolute top-[-97px] left-0 group transition-all duration-600"
						aria-label="Volver"
					>
						<ArrowLeft className="text-secondary-white group-hover:text-white !w-auto !h-[26px]" />
					</Button>
				</div>
			</>
		</Modal>
	);
};
