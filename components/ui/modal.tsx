"use client";

import type { ReactElement } from "react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "./button";
import { ArrowLeft, X } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface ModalProps {
	title: string;
	children: ReactElement;
	onSubmit?: () => void;
	open: boolean;
	setOpen: (open: boolean) => void;
	type?: "create" | "update" | "next" | "save" | "delete";
	showCloseButton?: boolean;
	onReturnPreviewsStep?: () => void;
}

export const Modal = ({
	title,
	children,
	onSubmit,
	open,
	setOpen,
	type = "create",
	showCloseButton = true,
	onReturnPreviewsStep,
}: ModalProps) => {
	const { t } = useTranslation();
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (open) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	}, [open]);

	const handleClose = () => {
		setOpen(false);
	};

	const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const isInDialog =
			e.clientX >= rect.left &&
			e.clientX <= rect.right &&
			e.clientY >= rect.top &&
			e.clientY <= rect.bottom;
		if (!isInDialog) {
			handleClose();
		}
	};

	const handleSubmit = () => {
		onSubmit?.();
		handleClose();
	};

	return createPortal(
		<dialog
			ref={dialogRef}
			onClick={handleBackdropClick}
			className="backdrop:bg-black/80 backdrop:backdrop-blur-sm bg-transparent p-0 max-w-none max-h-none m-auto"
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="w-[730px] bg-secondary-gray border-2 border-gray rounded-lg p-6 relative"
			>
				{/* Header */}
				<div className=" my-4 relative flex items-center justify-center ">
					{onReturnPreviewsStep && (
						<button
							type="button"
							onClick={onReturnPreviewsStep}
							className="absolute left-0 top-0 cursor-pointer "
						>
							<ArrowLeft className="text-secondary-white hover:text-white !w-auto !h-[26px]" />
						</button>
					)}
					<h2 className="text-white text-h3 font-semibold">{title}</h2>
					{showCloseButton && (
						<button
							onClick={handleClose}
							className="text-white hover:text-gray-300 absolute right-0 top-0 cursor-pointer"
							aria-label="Close modal"
						>
							<X className="text-secondary-white hover:text-white !w-auto !h-[26px]" />
						</button>
					)}
				</div>

				{/* Separator */}
				<div className="w-full h-[2px] bg-gray mb-4" />

				{/* Content */}
				<div className="my-4">{children}</div>

				{/* Footer */}
				<div className="flex justify-self-end gap-4 mt-6">
					<Button
						variant={"outline"}
						type="button"
						onClick={handleClose}
						className="w-[6rem] cursor-pointer text-h3 text-white !bg-red border-none hover:!bg-red-dark !hover:text-white"
					>
						{t("common.cancel")}
					</Button>

					<Button
						variant={"outline"}
						type="button"
						onClick={handleSubmit}
						className="w-[6rem] cursor-pointer text-h3 text-white !bg-green border-none hover:!bg-green-dark hover:!text-white"
					>
						{type === "create"
							? t("common.create")
							: type === "update"
							? t("common.update")
							: type === "next"
							? t("common.next")
							: type === "delete"
							? t("common.delete")
							: t("common.save")}
					</Button>
				</div>
			</div>
		</dialog>,
		document.body
	);
};
