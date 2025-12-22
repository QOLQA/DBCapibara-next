import { transformSolutionModel } from "@/lib/solutionConversion";
import ComparisonView from "./ComparisonView";
import { getAuthenticatedSolution } from "@/lib/apiServer";
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

export default async function ComparisonPage({
	params,
}: {
	params: Promise<{ diagramId: string }>;
}) {
	const { diagramId } = await params;
	const loaderData = await getSolutionData(diagramId);
	return <ComparisonView loaderData={loaderData} />;
}
