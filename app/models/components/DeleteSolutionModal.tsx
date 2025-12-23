"use client";

import { Modal } from "@/components/ui/modal";
import { AlertTriangle } from "lucide-react";
import { useTransition } from "react";
import { useTranslation } from "@/hooks/use-translation";

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
	solutionName,
}) => {
	const { t } = useTranslation();
	const [isPending, startTransition] = useTransition();
	const defaultSolutionName =
		solutionName || t("modals.deleteProject.defaultProjectName");

	const handleConfirm = () => {
		startTransition(async () => {
			await onConfirm();
			setOpen(false);
		});
	};

	return (
		<Modal
			title={t("modals.deleteProject.title")}
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
							{t("modals.deleteProject.confirmMessage")}{" "}
							<strong>{defaultSolutionName}</strong>?
						</p>
						<p className="text-red text-p mt-2">
							{t("modals.deleteProject.irreversibleAction")}
						</p>
					</div>
				</div>
				{isPending && (
					<div className="mt-4 text-center text-sm text-gray-400">
						{t("modals.deleteProject.deleting")}
					</div>
				)}
			</>
		</Modal>
	);
};

export default DeleteSolutionModal;
