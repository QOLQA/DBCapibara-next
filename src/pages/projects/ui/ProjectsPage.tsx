"use client";

import { Button } from "@fsd/shared/ui/button";
import { Plus, LogOut } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { api } from "@fsd/shared/api";
import { useAuth } from "@fsd/features/auth";
import { Logo } from "@fsd/shared/ui/icons/HeaderIcons";
import { useTranslation } from "@fsd/shared/i18n/use-translation";
import {
	AddProjectModal,
	EditProjectModal,
	DeleteProjectModal,
	useProjectsStore,
} from "@fsd/features/manage-projects";
import { SolutionCard, type SolutionListItem } from "@fsd/entities/solution";

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
	const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
	const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
	const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] =
		useState(false);

	const router = useRouter();
	const { user, logout } = useAuth();

	const [isPending, startTransition] = useTransition();
	const [solutions, setSolutions] = useState(initialSolutions);

	const { solutionId } = useProjectsStore.getState();

	const handleAddSolution = async (name: string) => {
		setIsAddProjectModalOpen(false);

		try {
			const data = await api.post<CreateSolutionResponse>("/solutions", {
				name: name,
			});

			router.push(`/projects/${data._id}/modeling`);
		} catch (error) {
			console.error("Error creating solution:", error);
		}
	};

	const handleRequestDeleteSolution = (solutionId: string) => {
		useProjectsStore.getState().setSolutionId(solutionId);
		setIsDeleteProjectModalOpen(true);
	};

	const handleRequestEditSolution = (solutionId: string) => {
		useProjectsStore.getState().setSolutionId(solutionId);
		setIsEditProjectModalOpen(true);
	};

	const handleOpenSolution = (solutionId: string) => {
		router.push(`/projects/${solutionId}/modeling`);
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
		const { solutionId: sid, solutionDataToEdit } = useProjectsStore.getState();
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
					<Logo />
					<div className="flex gap-[68px] items-center">
						<Button
							type="button"
							onClick={() => {
								setIsAddProjectModalOpen(true);
							}}
							className="text-white font-weight-900 cursor-pointer bg-black hover:bg-primary-gray"
						>
							<Plus /> {t("other.newProject")}
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

					<ul className="projects grid grid-cols-3 gap-10">
						{solutions.map((solution) => (
							<SolutionCard
								{...solution}
								key={solution._id}
								onRequestDelete={handleRequestDeleteSolution}
								onRequestEdit={handleRequestEditSolution}
								onOpen={handleOpenSolution}
							/>
						))}
					</ul>
				</div>
			</main>

			{isAddProjectModalOpen && (
				<AddProjectModal
					open={isAddProjectModalOpen}
					setOpen={setIsAddProjectModalOpen}
					onSubmit={handleAddSolution}
				/>
			)}

			{isDeleteProjectModalOpen && (
				<DeleteProjectModal
					open={isDeleteProjectModalOpen}
					setOpen={setIsDeleteProjectModalOpen}
					onConfirm={handleConfirmDeleteSolution}
					solutionName={solutions.find((s) => s._id === solutionId)?.name}
				/>
			)}

			{isEditProjectModalOpen && (
				<EditProjectModal
					open={isEditProjectModalOpen}
					setOpen={setIsEditProjectModalOpen}
					onSubmit={handleEditSolution}
					solutionNameToEdit={
						solutions.find((s) => s._id === solutionId)?.name ?? ""
					}
				/>
			)}
		</>
	);
}
