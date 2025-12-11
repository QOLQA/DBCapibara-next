'use client'

import { Modal } from "@/components/ui/modal";
import { useEffect, useState, useTransition } from "react";
import { ModalSelectDocs } from "./ModalSelectDocs";
import type { Query } from "../../types";

type ModalProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	queryEdit?: Query;
	mode: "create" | "edit";
	queryText: string;
	setQueryText: (query: string) => void;
};

export const ModalNewQuery = ({
	open,
	setOpen,
	mode = "create",
	queryEdit,
	queryText,
	setQueryText,
}: ModalProps) => {
	const [showSelectDocs, setShowSelectDocs] = useState(false);
	const [isPending, startTransition] = useTransition();

	const handleSubmit = () => {
		startTransition(() => {
			setOpen(false);
			setShowSelectDocs(true);
		});
	};

	useEffect(() => {
		if (mode === "edit") {
			setQueryText(queryEdit?.full_query || "");
		} else {
			setQueryText("");
		}
	}, [queryEdit, mode, setQueryText]);

	return (
		<>
			<Modal
				title="Nueva Consulta"
				open={open}
				setOpen={setOpen}
				onSubmit={handleSubmit}
				type="next"
			>
				<>
					<div className="my-13 gap-5 flex justify-between items-start flex-col">
						<label
							htmlFor="docName"
							className="text-h3 text-secondary-white pr-12"
						>
							Consulta
						</label>
						<textarea
							placeholder="Escribe tu consulta"
							id="docName"
							value={queryText}
							onChange={(e) => setQueryText(e.target.value)}
							disabled={isPending}
							className="text-h4 w-full h-36 py-3 px-5 border border-gray rounded-md bg-terciary-gray focus:outline-none text-white placeholder:text-lighter-gray disabled:opacity-50 disabled:cursor-not-allowed"
						/>
					</div>
					{isPending && (
						<div className="text-center text-sm text-gray-400">
							Procesando...
						</div>
					)}
				</>
			</Modal>
			<ModalSelectDocs
				open={showSelectDocs}
				setOpen={setShowSelectDocs}
				queryText={queryText}
				queryEdit={queryEdit}
				mode={mode}
				setQueryText={setQueryText}
				onReturn={() => {
					setShowSelectDocs(false);
					setOpen(true);
				}}
			/>
		</>
	);
};
