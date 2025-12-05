import { transformSolutionModel } from "@/lib/solutionConversion";
import DiagramClient from "./diagram-client";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

async function getDiagram(diagramId: string) {
	const response = await fetch(`${backendUrl}/solutions/${diagramId}`, {
		cache: 'no-store'
	});
	
	if (!response.ok) {
		throw new Error('Failed to fetch diagram');
	}
	
	const data = await response.json();
	return transformSolutionModel(data);
}

export default async function DiagramPage({ 
	params 
}: { 
	params: Promise<{ diagramId: string }> 
}) {
	const { diagramId } = await params;
	const loaderData = await getDiagram(diagramId);
	
	return <DiagramClient loaderData={loaderData} />;
}
