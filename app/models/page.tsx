import ModelsClient from "./modelsClient";
import { getAuthenticatedSolutions } from "@/lib/api/server";
import { redirect } from "next/navigation";

async function getSolutions() {
	try {
		return await getAuthenticatedSolutions();
	} catch (error) {
		if (error instanceof Error && error.message === "UNAUTHORIZED") {
			redirect("/login");
		}
		throw error;
	}
}

export default async function ModelsPage() {
	const solutions = await getSolutions();

	return <ModelsClient initialSolutions={solutions} />;
}
