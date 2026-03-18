import { transformSolutionModel } from "@fsd/entities/solution/lib/conversions";
import { getAuthenticatedSolution } from "@fsd/shared/api/server";
import { redirect } from "next/navigation";
import type { SolutionModel } from "@fsd/entities/solution";

export async function getAnalysisData(solutionId: string) {
	try {
		const data = await getAuthenticatedSolution(solutionId);
		return transformSolutionModel(data as SolutionModel);
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === "UNAUTHORIZED") {
				redirect("/login");
			}
			if (error.message === "FORBIDDEN") {
				redirect("/projects");
			}
		}
		throw error;
	}
}
