import { ProjectsPage, getSolutions } from "@fsd/pages/projects";
import { redirect } from "next/navigation";

async function loadSolutions() {
	try {
		return await getSolutions();
	} catch (error) {
		if (error instanceof Error && error.message === "UNAUTHORIZED") {
			redirect("/login");
		}
		throw error;
	}
}

export default async function ModelsPage() {
	const solutions = await loadSolutions();

	return <ProjectsPage initialSolutions={solutions} />;
}
