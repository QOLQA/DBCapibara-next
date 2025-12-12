"use client";

import { Logo } from "@/components/icons/HeaderIcons";

export default function AppHeader({ title }: { title: string }) {
	return (
		<header className="relative flex flex-row items-center justify-between w-full h-16 bg-secondary-gray p-4 text-white">
			<Logo className="text-blue" />
			<div className="absolute w-full flex justify-center ">
				<h1 className="text-h4 text-white">{title}</h1>
			</div>
		</header>
	);
}
