import { ProjectsPage, getSolutions } from "@fsd/pages/projects";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

async function loadSolutions() {
	try {
		return await getSolutions();
	} catch (error) {
		// Re-lanzar errores de redirect inmediatamente para que Next.js los maneje
		if (isRedirectError(error)) {
			throw error;
		}
		
		if (error instanceof Error && error.message === "UNAUTHORIZED") {
			redirect("/login");
		}
		throw error;
	}
}

export default async function ProjectsRoute() {
	const solutions = await loadSolutions();

	return <ProjectsPage initialSolutions={solutions} />;
}
