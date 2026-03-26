import { api } from "@fsd/shared/api";
import type { Query } from "@fsd/entities/solution";

type CreateQueryPayload = Omit<Query, "_id"> & { solution_id: string };
type UpdateQueryPayload = Partial<Omit<Query, "_id">>;

export async function createQueryRequest(
	payload: CreateQueryPayload,
): Promise<Query> {
	return api.post<Query>("/queries", payload);
}

export async function updateQueryRequest(
	queryId: string,
	payload: UpdateQueryPayload,
): Promise<Query> {
	return api.patch<Query>(`/queries/${queryId}`, payload);
}

export async function deleteQueryRequest(queryId: string): Promise<void> {
	return api.delete(`/queries/${queryId}`);
}

export async function getQueriesBySolutionRequest(
	solutionId: string,
): Promise<Query[]> {
	return api.get<Query[]>(`/queries/solution/${solutionId}`);
}
