"use client";

import { ArrowLeft, ArrowRight, Chevron } from "@/components/icons/HeaderIcons";

import { LogoWithSelect } from "./LogoWithSelect";
import { ButtonSave } from "./ButtonSave";
import { ButtonDuplicateVersion } from "./ButtonDuplicateVersion";


export const AppHeader = ({ title }: { title: string }) => {
	return (
		<header className="flex flex-row items-center justify-between w-full h-16 bg-secondary-gray p-4 text-white">
			<LogoWithSelect />
			<div className="flex items-center gap-8 mr-30">
				<div className="flex items-center gap-4">
					<ArrowLeft className="text-white" />
					<ArrowRight className="text-lighter-gray" />
				</div>
				<div className="flex items-center gap-3">
					<h1 className="text-h4 text-white">{title}</h1>
					<Chevron className="text-white" />
				</div>
			</div>
			<div className="flex items-center gap-4">
				<ButtonDuplicateVersion />
				<ButtonSave />
			</div>
		</header>
	);
};
