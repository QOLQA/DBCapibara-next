"use client";

import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import Link from "next/link";
import { useState, useOptimistic, useTransition } from "react";
import AddSolutionModal from "./components/AddSolutionModal";
import type { SolutionModel } from "./[diagramId]/canva/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/icons/HeaderIcons";
import { cn } from "@/lib/utils";

interface ModelProps {
	name: string;
	submodels: unknown;
	queries: unknown;
	_id: string;
	src_img: string;
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
	const [imageError, setImageError] = useState(false);
	const [imageLoading, setImageLoading] = useState(true);

	if (imageError) {
		return (
			<div
				className={`${className} bg-primary-gray flex items-center justify-center text-gray-400`}
			>
				Sin imagen
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
					<div className="text-gray-400 text-sm">Cargando...</div>
				</div>
			)}
		</div>
	);
};

const Model = ({ _id, name, src_img }: ModelProps) => {
	return (
		<li className="model">
			<Link href={`/models/${_id}/canva`} className="focus:rounded-2xl">
				<div className="model__thumbnail">
					<ModelImage
						src={src_img}
						alt="Model thumbnail"
						className="model__thumbnail-img"
					/>
				</div>
				<div className="model__info">
					<p className="text-white text-h3">{name}</p>
					<p className="text-lighter-gray text-p">Editado el 24 / 10 / 24</p>
				</div>
			</Link>
		</li>
	);
};

export default function ModelsClient({
	initialModels,
}: {
	initialModels: any[];
}) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const router = useRouter();
	const { user, logout } = useAuth();
	const [isPending, startTransition] = useTransition();

	// Optimistic updates for models
	const [optimisticModels, addOptimisticModel] = useOptimistic<any[], any>(
		initialModels,
		(state, newModel) => [...state, newModel]
	);

	const handleAddSolution = async (name: string) => {
		setIsModalOpen(false);

		try {
			const data = await api.post<SolutionModel>("/solutions", {
				name: name,
			});

			console.log("Modelo creado:", data);

			// Navigate to the new model's canvas
			router.push(`/models/${data._id}/canva`);
		} catch (error) {
			console.error("Error creating solution:", error);
			// No rethrow - el manejo de auth está en fetchWithAuth
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
								setIsModalOpen(true);
							}}
							className="text-white font-weight-900 cursor-pointer bg-black"
						>
							<Plus /> Nuevo Modelo
						</Button>
						<div className="flex items-center gap-3">
							{user && (
								<span className="text-white text-sm">{user.username}</span>
							)}
							<Button
								className="rounded-full"
								size="icon"
								onClick={handleLogout}
								title="Cerrar sesión"
							>
								<LogOut className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</header>
			<main className="bg-secondary-gray pb-36 min-h-[90vh]">
				<div className="max-w-[1330px] mx-auto">
					<h1 className="text-center text-white text-h2">Tus modelos</h1>
					<hr className="mt-[33px] mb-20 border-gray" />

					{isPending && (
						<div className="text-center text-white mb-4">
							<p className="text-sm">Cargando...</p>
						</div>
					)}

					<ul className="models grid grid-cols-3 gap-10">
						{optimisticModels.map((model) => (
							<Model {...model} key={model._id} />
						))}
					</ul>
				</div>
			</main>

			{isModalOpen && (
				<AddSolutionModal
					open={isModalOpen}
					setOpen={setIsModalOpen}
					onSubmit={handleAddSolution}
				/>
			)}
		</>
	);
}
