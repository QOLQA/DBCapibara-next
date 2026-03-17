const getKeySegment = (key: string, index: number): string | null => {
	const parts = key.split("-");
	if (index < 1 || index > parts.length) return null;
	return parts.slice(0, index).join("-");
};

export default getKeySegment;
