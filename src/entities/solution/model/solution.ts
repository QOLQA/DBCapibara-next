/**
 * Solution entity types for list/grid views
 */

export interface SolutionListItem {
	_id: string;
	name: string;
	src_img?: string;
	last_updated_at?: string;
	submodels?: unknown;
	queries?: unknown;
}
