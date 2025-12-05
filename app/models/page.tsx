import ModelsClient from "./models-client";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

async function getModels() {
	const response = await fetch(`${backendUrl}/solutions`, {
		cache: 'no-store'
	});
	
	if (!response.ok) {
		throw new Error('Failed to fetch models');
	}
	
	return response.json();
}

export default async function ModelsPage() {
	const models = await getModels();
	
	return <ModelsClient initialModels={models} />;
}
