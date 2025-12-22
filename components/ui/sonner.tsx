"use client";

import {
	CircleCheckIcon,
	InfoIcon,
	Loader2Icon,
	OctagonXIcon,
	TriangleAlertIcon,
	CheckIcon,
} from "lucide-react";
// import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	// const { theme = "system" } = useTheme();

	return (
		<Sonner
			// theme={theme as ToasterProps["theme"]}
			theme="dark"
			richColors
			className="toaster group bg-secondary-gray text-white"
			toastOptions={{
				classNames: {
					toast:
						"bg-[var(--color-secondary-gray)] text-[var(--color-white)] border border-[var(--color-gray)]",
					title: "pl-3 text-[var(--color-white)]",
					description: "text-[var(--color-lighter-gray)]",
					actionButton: "bg-[var(--color-blue)] text-[var(--color-white)]",
					cancelButton: "bg-[var(--color-gray)] text-[var(--color-white)]",
				},
			}}
			icons={{
				success: (
					<div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600">
						<CheckIcon
							className="h-4 w-4 text-secondary-gray"
							strokeWidth={3}
						/>
					</div>
				),
				info: (
					<div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-blue)]">
						<InfoIcon className="h-4 w-4 text-secondary-gray" strokeWidth={3} />
					</div>
				),
				warning: (
					<div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500">
						<TriangleAlertIcon
							className="h-4 w-4 text-secondary-gray"
							strokeWidth={3}
						/>
					</div>
				),
				error: (
					<div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-red)]">
						<OctagonXIcon
							className="h-4 w-4 text-secondary-gray"
							strokeWidth={3}
						/>
					</div>
				),
				loading: (
					<div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-gray)]">
						<Loader2Icon
							className="h-4 w-4 animate-spin text-secondary-gray"
							strokeWidth={3}
						/>
					</div>
				),
			}}
			style={
				{
					"--normal-bg": "var(--color-secondary-gray)",
					"--normal-text": "var(--color-white)",
					"--normal-border": "var(--color-gray)",
					"--border-radius": "var(--radius)",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
