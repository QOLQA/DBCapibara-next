import { useState, useEffect } from "react";

/**
 * Auto-selects table names based on word similarity (first 3 letters match)
 */
function autoSelectTables(words: string[], tableNames: string[]): string[] {
	const selected = new Set<string>();

	words.forEach(word => {
		const wordPrefix = word.toLowerCase().slice(0, 3);

		tableNames.forEach(tableName => {
			const tablePrefix = tableName.toLowerCase().slice(0, 3);
			if (wordPrefix === tablePrefix) {
				selected.add(tableName);
			}
		});
	});

	return Array.from(selected);
}

/**
 * Custom hook to manage table selection logic
 */
export function useTableSelection(
	queryText: string,
	availableTableNames: string[],
	isOpen: boolean
) {
	const [selectedTables, setSelectedTables] = useState<string[]>([]);
	const [error, setError] = useState(false);
	const words = queryText.trim().split(/\s+/);

	// Auto-select tables when modal opens or queryText changes
	useEffect(() => {
		if (isOpen && queryText.trim()) {
			const autoSelected = autoSelectTables(words, availableTableNames);
			setSelectedTables(autoSelected);
		}
	}, [isOpen, queryText]);

	const addTable = (tableName: string) => {
		if (!selectedTables.includes(tableName)) {
			setSelectedTables((prev) => [...prev, tableName]);
		}
		setError(false);
	};

	const removeTable = (tableName: string) => {
		setSelectedTables((prev) => prev.filter((t) => t !== tableName));
	};

	const toggleWord = (word: string) => {
		const wordPrefix = word.toLowerCase().slice(0, 3);
		const matchingTable = availableTableNames.find(
			(tableName) => tableName.toLowerCase().slice(0, 3) === wordPrefix
		);

		if (matchingTable) {
			if (selectedTables.includes(matchingTable)) {
				removeTable(matchingTable);
			} else {
				addTable(matchingTable);
			}
		}
		setError(false);
	};

	const clearSelection = () => {
		setSelectedTables([]);
		setError(false);
	};

	const validateSelection = (): boolean => {
		if (selectedTables.length === 0) {
			setError(true);
			return false;
		}
		setError(false);
		return true;
	};

	return {
		selectedTables,
		error,
		words,
		addTable,
		removeTable,
		toggleWord,
		clearSelection,
		validateSelection,
	};
}
