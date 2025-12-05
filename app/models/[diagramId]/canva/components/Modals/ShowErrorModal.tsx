'use client'

import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ShowErrorModalProps {
	onClose: () => void;
	errorMessage: string;
}

const ShowErrorModal: React.FC<ShowErrorModalProps> = ({
	onClose,
	errorMessage,
}) => {
	const modalRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (modalRef.current) modalRef.current.showModal();
	});

	return createPortal(
		<dialog
			ref={modalRef}
			onClose={onClose}
			className="bg-red-50 p-6 m-auto rounded-xl shadow-lg w-96 border border-red-400 backdrop:bg-black/50 backdrop:backdrop-blur-sm open:animate-fade-in"
		>
			<p className="text-red-700 font-semibold mb-4 flex items-center gap-2">
				{/* Error icon for visual feedback */}
				<svg
					className="w-5 h-5 text-red-600"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<title>Error</title>
					<circle
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="2"
						fill="none"
					/>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 8v4m0 4h.01"
					/>
				</svg>
				{errorMessage}
			</p>
			<div>
				<Button
					type="button"
					variant={"outline"}
					className="cursor-pointer border-red-400 text-red-700 hover:bg-red-100"
					onClick={() => {
						modalRef.current?.close();
						onClose();
					}}
				>
					Aceptar
				</Button>
			</div>
		</dialog>,
		document.body,
	);
};

export default ShowErrorModal;
