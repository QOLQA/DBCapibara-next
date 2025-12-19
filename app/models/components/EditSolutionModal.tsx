"use client";

import { Modal } from "@/components/ui/modal";
import { useModelsStore } from "@/state/modelsStore";
import React, { useState, useTransition } from "react";

interface EditSolutionModalProps {
	onSubmit: () => void;
	solutionNameToEdit: string;
	open: boolean;
	setOpen: (open: boolean) => void;
}

const EditSolutionModal: React.FC<EditSolutionModalProps> = React.memo(
	({ onSubmit, solutionNameToEdit = "", open, setOpen }) => {
		const [solutionName, setSolutionName] = useState(solutionNameToEdit);
		const [isPending, startTransition] = useTransition();
		const { setSolutionDataToEdit, solutionId } = useModelsStore.getState();

		const handleSubmit = () => {
			startTransition(() => {
				setSolutionDataToEdit({
					name: solutionName,
					_id: solutionId || "",
				});
				onSubmit();
			});
		};

		return (
			<Modal
				title="Edit solution"
				onSubmit={handleSubmit}
				open={open}
				setOpen={setOpen}
			>
				<>
					<div className="flex justify-between items-center gap-4">
						<label htmlFor="name" className="text-secondary-white shrink-0">
							Solution Name:
						</label>
						<input
							type="text"
							id="name"
							value={solutionName}
							onChange={(e) => setSolutionName(e.target.value)}
							disabled={isPending}
							className="w-full py-2 px-5 border border-gray rounded-md bg-terciary-gray focus:ring-2 focus:outline-none text-white disabled:opacity-50 disabled:cursor-not-allowed"
						/>
					</div>
					{isPending && (
						<div className="mt-4 text-center text-sm text-gray-400">
							Creando colección...
						</div>
					)}
				</>
			</Modal>
		);
	}
);

export default EditSolutionModal;
