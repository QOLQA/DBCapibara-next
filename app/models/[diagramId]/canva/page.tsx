import { transformSolutionModel } from "@/lib/solutionConversion";
import DiagramClient from "./diagram-client";
import { getAuthenticatedSolution } from "@/lib/apiServer";
import { redirect } from "next/navigation";

async function getDiagram(solutionId: string) {
	try {
		const data = await getAuthenticatedSolution(solutionId);
		console.log("data", data);
		return transformSolutionModel(data);
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === "UNAUTHORIZED") {
				redirect("/login");
			}
			if (error.message === "FORBIDDEN") {
				redirect("/models");
			}
		}
		throw error;
	}
}

export default async function DiagramPage({
	params,
}: {
	params: Promise<{ diagramId: string }>;
}) {
	const { diagramId } = await params;
	const loaderData = await getDiagram(diagramId);

	return <DiagramClient loaderData={loaderData} />;
}
