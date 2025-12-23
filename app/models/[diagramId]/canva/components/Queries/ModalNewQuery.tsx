"use client";

import { Modal } from "@/components/ui/modal";
import { useEffect, useState, useTransition } from "react";
import { ModalSelectDocs } from "./ModalSelectDocs";
import type { Query } from "../../types";
import { useTranslation } from "@/hooks/use-translation";

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
	const { t } = useTranslation();
	const [showSelectDocs, setShowSelectDocs] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState(false);

	const handleSubmit = () => {
		if (!queryText.trim()) {
			setError(true);
			return;
		}

		setError(false);
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
		setError(false);
	}, [queryEdit, mode, setQueryText]);

	return (
		<>
			<Modal
				title={t("modals.newQuery.title")}
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
							{t("modals.newQuery.queryLabel")}
						</label>
						<textarea
							placeholder={t("modals.newQuery.queryPlaceholder")}
							id="docName"
							value={queryText}
							onChange={(e) => {
								setQueryText(e.target.value);
								if (error) setError(false);
							}}
							disabled={isPending}
							className="text-h4 w-full h-36 py-3 px-5 border border-gray rounded-md bg-terciary-gray focus:outline-none text-white placeholder:text-lighter-gray disabled:opacity-50 disabled:cursor-not-allowed"
						/>
					</div>
					{error && (
						<p className="text-red-500 mt-2 text-sm">
							{t("modals.newQuery.error")}
						</p>
					)}
					{isPending && (
						<div className="text-center text-sm text-gray-400">
							{t("common.loading")}
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
