"use client";

import { Modal } from "@/components/ui/modal";
import { useState, useTransition } from "react";
import { useTranslation } from "@/hooks/use-translation";

interface AddSolutionalModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	onSubmit: (name: string) => Promise<void>;
}

const AddSolutionModal: React.FC<AddSolutionalModalProps> = ({
	open,
	setOpen,
	onSubmit,
}) => {
	const { t } = useTranslation();
	const [docName, setDocName] = useState("");
	const [isPending, startTransition] = useTransition();

	const handleSubmit = () => {
		if (docName.trim()) {
			startTransition(async () => {
				await onSubmit(docName);
				setDocName("");
			});
		}
	};

	return (
		<Modal
			title={t("modals.addProject.title")}
			open={open}
			setOpen={setOpen}
			onSubmit={handleSubmit}
			type="create"
		>
			<>
				<div className="my-13 flex justify-between items-center gap-4">
					<label htmlFor="docName" className="text-secondary-white shrink-0">
						{t("modals.addProject.nameLabel")}
					</label>
					<input
						type="text"
						id="docName"
						className="w-full py-2 px-5 border border-gray rounded-md bg-terciary-gray focus:ring-2 focus:outline-none text-white disabled:opacity-50 disabled:cursor-not-allowed"
						value={docName}
						onChange={(e) => setDocName(e.target.value)}
						disabled={isPending}
					/>
				</div>
				{isPending && (
					<div className="mt-4 text-center text-sm text-gray-400">
						{t("modals.addProject.creating")}
					</div>
				)}
			</>
		</Modal>
	);
};

export default AddSolutionModal;
