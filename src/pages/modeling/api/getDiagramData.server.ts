import { transformSolutionModel } from "@fsd/entities/solution/lib/conversions";
import { getSolutionRequest } from "@fsd/entities/solution/api";
import { redirect } from "next/navigation";

export async function getDiagramData(solutionId: string) {
	try {
		const data = await getSolutionRequest(solutionId);
		return transformSolutionModel(data);
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
