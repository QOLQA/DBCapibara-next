"use client";

import { Button } from "@/components/ui/button";
import { Plus, LogOut, Trash, Edit } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import AddSolutionModal from "./components/AddSolutionModal";
import type { SolutionModel } from "./[diagramId]/canva/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/icons/HeaderIcons";
import { cn } from "@/lib/utils";
import { ManagedDropdownMenu } from "@/components/managedDropdownMenu";
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreButton } from "./[diagramId]/canva/components/Diagram/MoreButton";
import DeleteSolutionModal from "./components/DeleteSolutionModal";
import EditSolutionModal from "./components/EditSolutionModal";
import { useModelsStore } from "@/state/modelsStore";
import { useTranslation } from "@/hooks/use-translation";

interface ModelProps {
	name: string;
	submodels: unknown;
	queries: unknown;
	_id: string;
	src_img: string;
	last_updated_at?: string;
	requestDelete: () => void;
	requestEdit: () => void;
}

// Componente de imagen con mejor manejo de errores
const ModelImage = ({
	src,
	alt,
	className,
}: {
	src: string;
	alt: string;
	className: string;
}) => {
	const { t } = useTranslation();
	const [imageError, setImageError] = useState(false);
	const [imageLoading, setImageLoading] = useState(true);

	if (imageError) {
		return (
			<div
				className={`${className} bg-primary-gray flex items-center justify-center text-gray-400`}
			>
				{t("other.noImage")}
			</div>
		);
	}

	return (
		<div className="relative w-full h-full">
			<Image
				src={src}
				alt={alt}
				className={cn(className, "object-cover")}
				width={300}
				height={198}
				onError={() => {
					setImageError(true);
					setImageLoading(false);
				}}
				onLoad={() => {
					setImageLoading(false);
				}}
				onLoadingComplete={() => {
					setImageLoading(false);
				}}
			/>
			{imageLoading && (
				<div className="absolute inset-0 bg-primary-gray flex items-center justify-center">
					<div className="text-gray-400 text-sm">{t("common.loading")}</div>
				</div>
			)}
		</div>
	);
};

const Model = ({
	_id,
	name,
	src_img,
	last_updated_at,
	requestDelete,
	requestEdit,
}: ModelProps) => {
	const { t } = useTranslation();
	const router = useRouter();
	const { setSolutionId } = useModelsStore.getState();
	const handleRequestDeleteSolution = async (
		event: React.MouseEvent<HTMLDivElement>,
		id: string
	) => {
		event.preventDefault();
		event.stopPropagation();

		setSolutionId(_id);
		requestDelete();
	};

	const handleRequestEditSolution = async (
		event: React.MouseEvent<HTMLDivElement>,
		id: string
	) => {
		event.preventDefault();
		event.stopPropagation();

		setSolutionId(_id);
		requestEdit();
	};

	return (
		<li className="model">
			<article
				onClick={() => {
					router.push(`/models/${_id}/canva`);
				}}
				className="focus:rounded-2xl"
			>
				<div className="model__thumbnail">
					<ModelImage
						src={src_img}
						alt="Model thumbnail"
						className="model__thumbnail-img"
					/>
				</div>
				<div className="model__info">
					<div className="flex items-center justify-between">
						<p className="text-white text-h3">{name}</p>
						<ManagedDropdownMenu>
							<DropdownMenuTrigger asChild>
								<MoreButton className="hover:text-lighter-gray text-white" />
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="z-50 "
								side="right"
								variant="menu-1"
							>
								<DropdownMenuItem
									type="normal"
									onClick={(event) => handleRequestEditSolution(event, _id)}
								>
									<Edit className="text-white" />
									{t("common.edit")}
								</DropdownMenuItem>

								<DropdownMenuSeparator className="bg-gray" />

								<DropdownMenuItem
									type="delete"
									className="text-red"
									onClick={(event) => handleRequestDeleteSolution(event, _id)}
								>
									<Trash className="text-red" />
									{t("common.delete")}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</ManagedDropdownMenu>
					</div>
					<p className="text-lighter-gray text-p">
						{t("other.lastEdited")}{" "}
						{new Date(last_updated_at || new Date()).toLocaleDateString(
							"en-US",
							{ month: "short", day: "numeric", year: "numeric" }
						)}
					</p>
				</div>
			</article>
		</li>
	);
};

export default function ModelsClient({
	initialSolutions,
}: {
	initialSolutions: any[];
}) {
	const { t } = useTranslation();
	const [isAddSolutionModalOpen, setIsAddSolutionModalOpen] = useState(false);
	const [isEditSolutionModalOpen, setIsEditSolutionModalOpen] = useState(false);
	const [isDeleteSolutionModalOpen, setIsDeleteSolutionModalOpen] =
		useState(false);

	const router = useRouter();
	const { user, logout } = useAuth();

	const [isPending, startTransition] = useTransition();
	const [solutions, setSolutions] = useState(initialSolutions);

	const { solutionId } = useModelsStore.getState();

	const handleAddSolution = async (name: string) => {
		setIsAddSolutionModalOpen(false);

		try {
			const data = await api.post<SolutionModel>("/solutions", {
				name: name,
			});

			// Navigate to the new model's canvas
			router.push(`/models/${data._id}/canva`);
		} catch (error) {
			console.error("Error creating solution:", error);
			// No rethrow - el manejo de auth está en fetchWithAuth
		}
	};

	const handleRequestDeleteSolution = () => {
		setIsDeleteSolutionModalOpen(true);
	};

	const handleRequestEditSolution = () => {
		setIsEditSolutionModalOpen(true);
	};

	const handleConfirmDeleteSolution = async () => {
		if (!solutionId) return;

		const id = solutionId;

		try {
			await api.delete(`/solutions/${id}`);
			setSolutions(solutions.filter((solution) => solution._id !== id));
		} catch (error: any) {
			if (
				error?.message?.includes("does not exists") ||
				error?.message?.includes("404")
			) {
				return;
			}

			console.error("Error deleting solution:", error);
			router.refresh();
		}
	};

	const handleEditSolution = async () => {
		const { solutionId, solutionDataToEdit } = await useModelsStore.getState();
		if (!solutionId) return;

		try {
			await api.patch(`/solutions/${solutionId}`, {
				name: solutionDataToEdit?.name,
			});
			setSolutions(
				solutions.map((solution) =>
					solution._id === solutionId
						? { ...solution, name: solutionDataToEdit?.name }
						: solution
				)
			);
		} catch (error: any) {
			console.error("Error editing solution:", error);
			router.refresh();
		}
	};

	const handleLogout = () => {
		startTransition(() => {
			logout();
			router.push("/login");
		});
	};

	return (
		<>
			<header className="bg-secondary-gray pt-[27px] pb-16">
				<div className="max-w-[1330px] mx-auto flex justify-between items-center">
					<Link href="/models">
						<Logo className="text-blue" />
					</Link>
					<div className="flex gap-[68px] items-center">
						<Button
							type="button"
							onClick={() => {
								setIsAddSolutionModalOpen(true);
							}}
							className="text-white font-weight-900 cursor-pointer bg-black hover:bg-primary-gray"
						>
							<Plus /> {t("other.newModel")}
						</Button>
						<div className="flex items-center gap-3">
							{user && (
								<span className="text-white text-sm">{user.username}</span>
							)}
							<Button
								className="rounded-full"
								size="icon"
								onClick={handleLogout}
								title={t("common.logOut")}
							>
								<LogOut className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</header>
			<main className="bg-secondary-gray pb-36 min-h-[90vh]">
				<div className="max-w-[1330px] mx-auto">
					<h1 className="text-center text-white text-h2">
						{t("other.yourProjects")}
					</h1>
					<hr className="mt-[33px] mb-20 border-gray" />

					{isPending && (
						<div className="text-center text-white mb-4">
							<p className="text-sm">{t("common.loading")}</p>
						</div>
					)}

					<ul className="models grid grid-cols-3 gap-10">
						{solutions.map((solution) => (
							<Model
								{...solution}
								key={solution._id}
								requestDelete={handleRequestDeleteSolution}
								requestEdit={handleRequestEditSolution}
							/>
						))}
					</ul>
				</div>
			</main>

			{isAddSolutionModalOpen && (
				<AddSolutionModal
					open={isAddSolutionModalOpen}
					setOpen={setIsAddSolutionModalOpen}
					onSubmit={handleAddSolution}
				/>
			)}

			{isDeleteSolutionModalOpen && (
				<DeleteSolutionModal
					open={isDeleteSolutionModalOpen}
					setOpen={setIsDeleteSolutionModalOpen}
					onConfirm={handleConfirmDeleteSolution}
					solutionName={solutions.find((s) => s._id === solutionId)?.name}
				/>
			)}

			{isEditSolutionModalOpen && (
				<EditSolutionModal
					open={isEditSolutionModalOpen}
					setOpen={setIsEditSolutionModalOpen}
					onSubmit={handleEditSolution}
					solutionNameToEdit={solutions.find((s) => s._id === solutionId)?.name}
				/>
			)}
		</>
	);
}
