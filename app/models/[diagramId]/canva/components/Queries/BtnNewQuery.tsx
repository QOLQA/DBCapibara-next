'use client'

import { useState } from "react";
import { ModalNewQuery } from "./ModalNewQuery";

export const BtnNewQuery = () => {
	const [open, setOpen] = useState(false);
	const [queryText, setQueryText] = useState("");
	
	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="w-full h-auto py-4 flex justify-center rounded-xl items-center border border-dashed border-lighter-gray bg-transparent text-lighter-gray"
			>
				<div className="py-1.5 px-5 border border-lighter-gray bg-transparent rounded-lg text-h5 hover:bg-lighter-gray hover:text-gray cursor-pointer transition-all duration-500">
					Agregar Consulta
				</div>
			</button>

			<ModalNewQuery
				open={open}
				setOpen={setOpen}
				mode="create"
				queryText={queryText}
				setQueryText={setQueryText}
			/>
		</>
	);
};
