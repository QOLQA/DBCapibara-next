"use client";

import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { useAuth } from "@fsd/features/auth";
import { Logo } from "@/components/icons/HeaderIcons";
import { useTranslation } from "@/hooks/use-translation";
import {
	AddSolutionModal,
	EditSolutionModal,
	DeleteSolutionModal,
	useModelsStore,
} from "@fsd/features/project-management";
import { ModelCard } from "./ModelCard";
import type { SolutionListItem } from "@fsd/entities/solution";

interface CreateSolutionResponse {
	_id: string;
	name: string;
}

export function ProjectsPage({
	initialSolutions,
}: {
	initialSolutions: SolutionListItem[];
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
			const data = await api.post<CreateSolutionResponse>("/solutions", {
				name: name,
			});

			router.push(`/models/${data._id}/canva`);
		} catch (error) {
			console.error("Error creating solution:", error);
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
		} catch (error: unknown) {
			const err = error as Error;
			if (
				err?.message?.includes("does not exists") ||
				err?.message?.includes("404")
			) {
				return;
			}

			console.error("Error deleting solution:", error);
			router.refresh();
		}
	};

	const handleEditSolution = async () => {
		const { solutionId: sid, solutionDataToEdit } = useModelsStore.getState();
		if (!sid) return;

		try {
			await api.patch(`/solutions/${sid}`, {
				name: solutionDataToEdit?.name,
			});
			setSolutions(
				solutions.map((solution) =>
					solution._id === sid
						? { ...solution, name: solutionDataToEdit?.name ?? solution.name }
						: solution,
				),
			);
		} catch (error) {
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
							<ModelCard
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
					solutionNameToEdit={
						solutions.find((s) => s._id === solutionId)?.name ?? ""
					}
				/>
			)}
		</>
	);
}
