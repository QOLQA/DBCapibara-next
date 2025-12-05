'use client'

import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AddSolutionModal from "@/features/modals/views/AddSolutionModal";
import type { SolutionModel } from "@/features/modals/canva/types";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ModelProps {
	name: string;
	submodels: unknown;
	queries: unknown;
	_id: string;
	src_img: string;
}

const Model = ({ _id, name, src_img }: ModelProps) => {
	return (
		<li className="model">
			<Link href={`/models/${_id}/canva`} className="focus:rounded-2xl">
				<div className="model__thumbnail">
					<Image
						src={src_img}
						alt="Model thumbnail"
						className="model__thumbnail-img"
						width={300}
						height={198}
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

export default function ModelsClient({ initialModels }: { initialModels: any[] }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const router = useRouter();

	const handleAddSolution = async (name: string) => {
		const response = await fetch('http://localhost:8000/solutions', {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: name,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.detail || "Failed to add solution");
		}

		const data = (await response.json()) as SolutionModel;
		router.push(`/models/${data._id}/canva`);
	};

	return (
		<>
			<header className="bg-secondary-gray pt-[27px] pb-16">
				<div className="max-w-[1330px] mx-auto flex justify-between items-start">
					<div>Logo</div>
					<div className="flex gap-[68px]">
						<Button
							type="button"
							onClick={() => {
								setIsModalOpen(true);
							}}
							className="text-white font-weight-900 cursor-pointer bg-black"
						>
							<Plus /> Nuevo Modelo
						</Button>
						<Button className="rounded-full" size="icon">
							<User />
						</Button>
					</div>
				</div>
			</header>
			<main className="bg-secondary-gray pb-36 min-h-[90vh]">
				<div className="max-w-[1330px] mx-auto">
					<h1 className="text-center text-white text-h2">Tus modelos</h1>
					<hr className="mt-[33px] mb-10 border-gray-400" />
					<ul className="models grid grid-cols-3 gap-10">
						{initialModels.map((model) => (
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
