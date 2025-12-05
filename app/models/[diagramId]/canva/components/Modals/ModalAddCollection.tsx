'use client'

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import React, { useState } from "react";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";

interface ModalAddCollectionProps {
	onSubmit: (name: string) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
}

const ModalAddCollection: React.FC<ModalAddCollectionProps> = React.memo(
	({ onSubmit, open, setOpen }) => {
		const [docName, setDocName] = useState("");

		const handleSubmit = () => {
			onSubmit(docName);
			setDocName("");
		};

		return (
			<Modal
				title="Crear Colección"
				onSubmit={handleSubmit}
				open={open}
				setOpen={setOpen}
			>
				<div className="flex justify-between items-center gap-4">
					<label htmlFor="name" className="text-secondary-white">
						Nombre
					</label>
					<input
						type="text"
						id="name"
						value={docName}
						onChange={(e) => setDocName(e.target.value)}
						className="w-full py-2 px-5 border border-gray rounded-md bg-terciary-gray focus:ring-2 focus:outline-none text-white"
					/>
				</div>
			</Modal>
		);
	},
);

export default ModalAddCollection;
