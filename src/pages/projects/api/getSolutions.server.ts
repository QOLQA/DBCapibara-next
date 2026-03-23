import { getSolutionsRequest } from "@fsd/entities/solution/api";

export async function getSolutions() {
	return getSolutionsRequest();
}
