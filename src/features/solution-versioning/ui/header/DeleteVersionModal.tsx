"use client";

import { Modal } from "@fsd/shared/ui/modal";
import { AlertTriangle } from "lucide-react";
import { useTransition } from "react";
import { useTranslation } from "@fsd/shared/i18n/use-translation";

interface DeleteVersionModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	onConfirm: () => Promise<void>;
	versionName?: string;
}

export function DeleteVersionModal({
	open,
	setOpen,
	onConfirm,
	versionName,
}: DeleteVersionModalProps) {
	const { t } = useTranslation();
	const [isPending, startTransition] = useTransition();
	const defaultVersionName =
		versionName || t("modals.deleteVersion.defaultVersionName");

	const handleConfirm = () => {
		startTransition(async () => {
			await onConfirm();
			setOpen(false);
		});
	};

	return (
		<Modal
			title={t("modals.deleteVersion.title")}
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
							{t("modals.deleteVersion.confirmMessage")}{" "}
							<strong>{defaultVersionName}</strong>?
						</p>
						<p className="text-red text-p mt-2">
							{t("modals.deleteVersion.irreversibleAction")}
						</p>
					</div>
				</div>
				{isPending && (
					<div className="mt-4 text-center text-sm text-gray-400">
						{t("modals.deleteVersion.deleting")}
					</div>
				)}
			</>
		</Modal>
	);
}
