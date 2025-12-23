"use client";

import { Modal } from "@/components/ui/modal";
import React, { useState, useTransition } from "react";
import { useTranslation } from "@/hooks/use-translation";

interface ModalAddCollectionProps {
	onSubmit: (name: string) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
}

const ModalAddCollection: React.FC<ModalAddCollectionProps> = React.memo(
	({ onSubmit, open, setOpen }) => {
		const { t } = useTranslation();
		const [docName, setDocName] = useState("");
		const [isPending, startTransition] = useTransition();

		const handleSubmit = () => {
			startTransition(() => {
				onSubmit(docName);
				setDocName("");
			});
		};

		const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter" && !isPending) {
				e.preventDefault();
				handleSubmit();
				setOpen(false);
			}
		};

		return (
			<Modal
				title={t("modals.createCollection.title")}
				onSubmit={handleSubmit}
				open={open}
				setOpen={setOpen}
			>
				<>
					<div className="flex justify-between items-center gap-4">
						<label htmlFor="name" className="text-secondary-white">
							{t("modals.createCollection.nameLabel")}
						</label>
						<input
							type="text"
							id="name"
							value={docName}
							onChange={(e) => setDocName(e.target.value)}
							onKeyDown={handleKeyDown}
							disabled={isPending}
							className="w-full py-2 px-5 border border-gray rounded-md bg-terciary-gray focus:ring-2 focus:outline-none text-white disabled:opacity-50 disabled:cursor-not-allowed"
						/>
					</div>
					{isPending && (
						<div className="mt-4 text-center text-sm text-gray-400">
							{t("modals.createCollection.creating")}
						</div>
					)}
				</>
			</Modal>
		);
	}
);

export default ModalAddCollection;
