"use client";

import { ArrowLeft, ArrowRight, Chevron } from "@/components/icons/HeaderIcons";

import { LogoWithSelect } from "./LogoWithSelect";
import { ButtonSave } from "./ButtonSave";
import { ButtonDuplicateVersion } from "./ButtonDuplicateVersion";


export const AppHeader = ({ title }: { title: string }) => {
	return (
		<header className="flex flex-row items-center w-full h-16 bg-secondary-gray p-4 text-white relative">
			{/* Left section */}
			<div className="flex-shrink-0">
				<LogoWithSelect />
			</div>
			
			{/* Center section - absolutely centered */}
			<div className="flex-1 flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
				<div className="flex items-center gap-8">
					<div className="flex items-center gap-4">
						<ArrowLeft className="text-white" />
						<ArrowRight className="text-lighter-gray" />
					</div>
					<div className="flex items-center gap-3">
						<h1 className="text-h4 text-white">{title}</h1>
						<Chevron className="text-white" />
					</div>
				</div>
			</div>
			
			{/* Right section */}
			<div className="flex-shrink-0 ml-auto">
				<div className="flex items-center gap-4">
					<ButtonDuplicateVersion />
					<ButtonSave />
				</div>
			</div>
		</header>
	);
};
