import { serverFetchWithAuth } from "@fsd/shared/api/server";
import type { SolutionListItem } from "../model/solution";
import type { SolutionModel } from "../model/solution-model";

export async function getSolutionRequest(
	solutionId: string,
): Promise<SolutionModel> {
	const response = await serverFetchWithAuth(`/solutions/${solutionId}`);

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error("UNAUTHORIZED");
		}
		if (response.status === 403) {
			throw new Error("FORBIDDEN");
		}
		throw new Error("Failed to fetch solution");
	}

	return response.json();
}

export async function getSolutionsRequest(): Promise<SolutionListItem[]> {
	const response = await serverFetchWithAuth("/solutions");

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error("UNAUTHORIZED");
		}
		throw new Error("Failed to fetch solutions");
	}

	return response.json();
}

export async function deleteSolutionRequest(solutionId: string): Promise<void> {
	const response = await serverFetchWithAuth(`/solutions/${solutionId}`, {
		method: "DELETE",
	});

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error("UNAUTHORIZED");
		}
		throw new Error("Failed to delete solution");
	}
}
