import { useState, useEffect } from "react";

/**
 * Auto-selects table names based on word similarity (first 3 letters match)
 * Returns both matched tables and the words that matched them
 */
function autoSelectTables(words: string[], tableNames: string[]): {
	tables: string[];
	matchedWords: string[];
} {
	const selectedTables = new Set<string>();
	const selectedWords = new Set<string>();

	words.forEach(word => {
		const wordPrefix = word.toLowerCase().slice(0, 3);

		tableNames.forEach(tableName => {
			const tablePrefix = tableName.toLowerCase().slice(0, 3);
			if (wordPrefix === tablePrefix) {
				selectedTables.add(tableName);
				selectedWords.add(word);
			}
		});
	});

	return {
		tables: Array.from(selectedTables),
		matchedWords: Array.from(selectedWords),
	};
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
	const [highlightedWords, setHighlightedWords] = useState<string[]>([]);
	const [error, setError] = useState(false);
	const words = queryText.trim().split(/\s+/);

	// Auto-select tables when modal opens or queryText changes
	useEffect(() => {
		if (isOpen && queryText.trim()) {
			const { tables, matchedWords } = autoSelectTables(words, availableTableNames);
			setSelectedTables(tables);
			setHighlightedWords(matchedWords);
		}
	}, [isOpen, queryText]);

	const addTable = (tableName: string) => {
		if (!selectedTables.includes(tableName)) {
			setSelectedTables((prev) => [...prev, tableName]);

			// Find the word that matches this table
			const matchingWord = words.find(word =>
				word.toLowerCase().slice(0, 3) === tableName.toLowerCase().slice(0, 3)
			);

			if (matchingWord && !highlightedWords.includes(matchingWord)) {
				setHighlightedWords((prev) => [...prev, matchingWord]);
			}
		}
		setError(false);
	};

	const removeTable = (tableName: string) => {
		setSelectedTables((prev) => prev.filter((t) => t !== tableName));

		// Remove the corresponding highlighted word
		const matchingWord = words.find(word =>
			word.toLowerCase().slice(0, 3) === tableName.toLowerCase().slice(0, 3)
		);

		if (matchingWord) {
			setHighlightedWords((prev) => prev.filter((w) => w !== matchingWord));
		}
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
		setHighlightedWords([]);
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
		highlightedWords,
		error,
		words,
		addTable,
		removeTable,
		toggleWord,
		clearSelection,
		validateSelection,
	};
}
