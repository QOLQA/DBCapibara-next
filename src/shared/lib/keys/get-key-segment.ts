/**
 * Get a segment of a compound key (e.g. "parent-child-grandchild").
 * @param key - The compound key string
 * @param index - 1-based index; returns elements from start up to and including index
 * @returns Joined segment or null if index out of range
 */
export const getKeySegment = (key: string, index: number): string | null => {
	const parts = key.split("-");
	if (index < 1 || index > parts.length) return null;
	return parts.slice(0, index).join("-");
};
