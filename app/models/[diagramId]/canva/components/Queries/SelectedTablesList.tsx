import { Trash2 } from "lucide-react";

type SelectedTablesListProps = {
	selectedTables: string[];
	onRemove: (tableName: string) => void;
};

export function SelectedTablesList({
	selectedTables,
	onRemove,
}: SelectedTablesListProps) {
	if (selectedTables.length === 0) {
		return null;
	}

	return (
		<div className="w-full flex flex-col gap-2">
			{selectedTables.map((tableName) => (
				<div
					key={tableName}
					className="flex items-center justify-between px-4 py-3 bg-terciary-gray border border-gray rounded-lg group hover:border-secondary-white transition-colors duration-200"
				>
					<span className="text-secondary-white text-h4">{tableName}</span>
					<button
						type="button"
						onClick={() => onRemove(tableName)}
						className="text-lighter-gray hover:text-red-500 transition-colors duration-200"
						aria-label={`Remove ${tableName}`}
					>
						<Trash2 className="w-5 h-5" />
					</button>
				</div>
			))}
		</div>
	);
}
