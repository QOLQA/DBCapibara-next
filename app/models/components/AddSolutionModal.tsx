'use client'

import { Modal } from "@/components/ui/modal";
import { useState, useTransition } from "react";

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
			title="Nueva solución"
			open={open}
			setOpen={setOpen}
			onSubmit={handleSubmit}
			type="create"
		>
			<>
				<div className="my-13 flex justify-between items-center">
					<label htmlFor="docName" className="text-secondary-white pr-12">
						Name
					</label>
					<input
						type="text"
						id="docName"
						className="w-120 py-3 px-5 border border-gray rounded-md bg-terciary-gray focus:ring-2 focus:outline-none"
						value={docName}
						onChange={(e) => setDocName(e.target.value)}
						disabled={isPending}
					/>
				</div>
				{isPending && (
					<div className="mt-4 text-center text-sm text-gray-400">
						Creando solución...
					</div>
				)}
			</>
		</Modal>
	);
};

export default AddSolutionModal;
