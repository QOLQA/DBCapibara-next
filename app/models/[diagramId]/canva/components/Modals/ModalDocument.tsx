"use client";

import { Modal } from "@/components/ui/modal";
import React, { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/use-translation";

interface ModalDocumentProps {
	onSubmit: (name: string) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
}

const ModalDocument: React.FC<ModalDocumentProps> = React.memo(
	({ onSubmit, open, setOpen }) => {
		const [docName, setDocName] = useState("");

		const handleSubmit = useCallback(() => {
			onSubmit(docName);
			setDocName("");
		}, [onSubmit, docName]);

		const handleChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				setDocName(e.target.value);
			},
			[]
		);

		const { t } = useTranslation();
		return (
			<Modal
				title={t("modals.document.createTitle")}
				onSubmit={handleSubmit}
				open={open}
				setOpen={setOpen}
			>
				<div className="my-4">
					<div className="flex justify-between items-center gap-4">
						<label htmlFor="name" className="text-secondary-white">
							{t("modals.document.nameLabel")}
						</label>
						<Input
							type="text"
							id="name"
							value={docName}
							onChange={handleChange}
							className="w-full py-2 px-5 border border-gray rounded-md bg-terciary-gray focus:ring-2 focus:outline-none text-white"
						/>
					</div>
				</div>
			</Modal>
		);
	}
);

export default ModalDocument;
