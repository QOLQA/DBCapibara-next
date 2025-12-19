"use client";

import { Modal } from "@/components/ui/modal";
import { AlertTriangle } from "lucide-react";
import { useTransition } from "react";

interface DeleteSolutionModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	onConfirm: () => Promise<void>;
	solutionName?: string;
}

const DeleteSolutionModal: React.FC<DeleteSolutionModalProps> = ({
	open,
	setOpen,
	onConfirm,
	solutionName = "esta solución",
}) => {
	const [isPending, startTransition] = useTransition();

	const handleConfirm = () => {
		startTransition(async () => {
			await onConfirm();
			setOpen(false);
		});
	};

	return (
		<Modal
			title="Confirm delete solution"
			open={open}
			setOpen={setOpen}
			onSubmit={handleConfirm}
			type="delete"
		>
			<>
				<div className="my-4 flex items-start gap-4">
					<AlertTriangle className="text-red shrink-0 size-10 mt-0.5 mr-2" />
					<div className="flex-1">
						<p className="text-white text-h5">
							¿Estás seguro de que deseas eliminar{" "}
							<strong>{solutionName}</strong>?
						</p>
						<p className="text-red text-p mt-2">
							Esta acción no se puede deshacer.
						</p>
					</div>
				</div>
				{isPending && (
					<div className="mt-4 text-center text-sm text-gray-400">
						Eliminando solución...
					</div>
				)}
			</>
		</Modal>
	);
};

export default DeleteSolutionModal;
