'use client'

import { Modal } from "@/components/ui/modal";
import { useState } from "react";
import { set } from "react-hook-form";

interface AddSolutionalModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	onSubmit: (name: string) => void;
}

const AddSolutionModal: React.FC<AddSolutionalModalProps> = ({
	open,
	setOpen,
	onSubmit,
}) => {
	const [docName, setDocName] = useState("");

	const handleSubmit = () => {
		if (docName.trim()) {
			setOpen(false);
			onSubmit(docName);
			setDocName("");
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
				/>
			</div>
		</Modal>
	);
};

export default AddSolutionModal;
