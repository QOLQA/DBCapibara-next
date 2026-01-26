import { transformSolutionModel } from "@/lib/conversions/solution";
import AnalysisView from "./AnalysisView";
import { getAuthenticatedSolution } from "@/lib/api/server";
import { redirect } from "next/navigation";

async function getSolutionData(solutionId: string) {
	try {
		const data = await getAuthenticatedSolution(solutionId);
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

export default async function AnalysisPage({
	params,
}: {
	params: Promise<{ diagramId: string }>;
}) {
	const { diagramId } = await params;
	const loaderData = await getSolutionData(diagramId);
	return <AnalysisView loaderData={loaderData} />;
}
