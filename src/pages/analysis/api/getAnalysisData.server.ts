import { transformSolutionModel } from "@fsd/entities/solution/lib/conversions";
import { redirect } from "next/navigation";
import { getSolutionRequest } from "@fsd/entities/solution/api";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function getAnalysisData(solutionId: string) {
	try {
		const data = await getSolutionRequest(solutionId);
		return transformSolutionModel(data);
	} catch (error) {
		// Re-lanzar errores de redirect inmediatamente para que Next.js los maneje
		if (isRedirectError(error)) {
			throw error;
		}
		
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
