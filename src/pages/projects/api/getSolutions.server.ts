import { getAuthenticatedSolutions } from "@/lib/api/server";

export async function getSolutions() {
	return getAuthenticatedSolutions();
}
