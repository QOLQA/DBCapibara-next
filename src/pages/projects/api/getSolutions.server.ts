import { getAuthenticatedSolutions } from "@fsd/shared/api/server";

export async function getSolutions() {
	return getAuthenticatedSolutions();
}
