import ModelsClient from "./modelsClient";
import { getAuthenticatedSolutions } from "@/lib/apiServer";
import { redirect } from "next/navigation";

async function getModels() {
	try {
		return await getAuthenticatedSolutions();
	} catch (error) {
		if (error instanceof Error && error.message === 'UNAUTHORIZED') {
			redirect('/login');
		}
		throw error;
	}
}

export default async function ModelsPage() {
	const models = await getModels();

	return <ModelsClient initialModels={models} />;
}
