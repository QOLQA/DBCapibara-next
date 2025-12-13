import clsx from "clsx";

type WordToggleButtonsProps = {
	words: string[];
	availableTableNames: string[];
	selectedTables: string[];
	onToggle: (word: string) => void;
};

export function WordToggleButtons({
	words,
	availableTableNames,
	selectedTables,
	onToggle,
}: WordToggleButtonsProps) {
	return (
		<div className="flex flex-wrap gap-3">
			{words.map((word, index) => {
				const wordPrefix = word.toLowerCase().slice(0, 3);
				const matchingTable = availableTableNames.find(
					(tableName) => tableName.toLowerCase().slice(0, 3) === wordPrefix
				);
				const isSelected = matchingTable && selectedTables.includes(matchingTable);

				return (
					<button
						key={`${index}-${word}`}
						type="button"
						onClick={() => onToggle(word)}
						className={clsx(
							"cursor-pointer px-4 py-2 rounded-lg border border-gray transition-colors duration-200",
							isSelected
								? "bg-gray text-white"
								: "bg-transparent text-secondary-white",
						)}
						aria-pressed={!!isSelected}
						aria-label={`Seleccionar colección ${word}`}
					>
						{word}
					</button>
				);
			})}
		</div>
	);
}
