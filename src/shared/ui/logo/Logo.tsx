"use client";

import Link from "next/link";
import { Logo as LogoSvg } from "@fsd/shared/ui/icons/HeaderIcons";

type LogoProps = {
	/** Clases del contenedor (enlace) */
	className?: string;
	/** Clases del SVG del logo */
	logoClassName?: string;
};

/**
 * Logo de la app con enlace a la lista de proyectos. Reutilizable en headers u otras barras.
 */
export function Logo({
	className = "inline-block cursor-pointer",
	logoClassName = "text-blue",
}: LogoProps) {
	return (
		<Link href="/projects" className={className} aria-label="Ir a proyectos">
			<LogoSvg className={logoClassName} />
		</Link>
	);
}
