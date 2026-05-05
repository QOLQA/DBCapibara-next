import { api } from "@fsd/shared/api";
import type { VersionBackend } from "../model/solution-model";

export async function updateVersionDescriptionRequest(
	solutionId: string,
	versionId: string,
	description: string,
): Promise<VersionBackend> {
	return api.patch<VersionBackend>(
		`/solutions/${solutionId}/versions/${versionId}`,
		{ description },
	);
}
