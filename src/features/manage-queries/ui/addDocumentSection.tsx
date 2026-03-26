import { useState } from "react";
import { Plus } from "lucide-react";

type AddDocumentSectionProps = {
	availableTableNames: string[];
	selectedTables: string[];
	onAddTable: (tableName: string) => void;
};

export function AddDocumentSection({
	availableTableNames,
	selectedTables,
	onAddTable,
}: AddDocumentSectionProps) {
	const [showSearch, setShowSearch] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const filteredTables = availableTableNames.filter(
		(tableName) =>
			tableName.toLowerCase().includes(searchTerm.toLowerCase()) &&
			!selectedTables.includes(tableName)
	);

	const handleAddTable = (tableName: string) => {
		onAddTable(tableName);
		setSearchTerm("");
		setShowSearch(false);
	};

	const handleAddCustomTable = () => {
		if (searchTerm.trim() && !selectedTables.includes(searchTerm.trim())) {
			onAddTable(searchTerm.trim());
			setSearchTerm("");
			setShowSearch(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && searchTerm.trim()) {
			e.preventDefault();
			if (filteredTables.length === 1) {
				handleAddTable(filteredTables[0]);
			} else {
				handleAddCustomTable();
			}
		}
	};

	const handleCancel = () => {
		setShowSearch(false);
		setSearchTerm("");
	};

	if (!showSearch) {
		return (
			<button
				type="button"
				onClick={() => setShowSearch(true)}
				className="flex items-center justify-center gap-2 px-4 py-3 bg-transparent border border-dashed border-gray rounded-lg hover:border-secondary-white hover:bg-terciary-gray transition-all duration-200 group"
			>
				<Plus className="w-5 h-5 text-lighter-gray group-hover:text-white transition-colors duration-200" />
				<span className="text-lighter-gray group-hover:text-white transition-colors duration-200">
					Add Document
				</span>
			</button>
		);
	}

	return (
		<div className="flex flex-col gap-2 px-4 py-3 bg-terciary-gray border border-gray rounded-lg">
			<input
				type="text"
				placeholder="Search or type a table name..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				onKeyDown={handleKeyDown}
				className="w-full px-3 py-2 bg-primary-black border border-gray rounded-md text-white placeholder:text-lighter-gray focus:outline-none focus:border-secondary-white"
				autoFocus
			/>
			{searchTerm && (
				<div className="max-h-40 overflow-y-auto flex flex-col gap-1">
					{filteredTables.length > 0 ? (
						<>
							{filteredTables.map((tableName) => (
								<button
									key={tableName}
									type="button"
									onClick={() => handleAddTable(tableName)}
									className="px-3 py-2 text-left text-secondary-white hover:bg-gray rounded transition-colors duration-200"
								>
									{tableName}
								</button>
							))}
						</>
					) : (
						<button
							type="button"
							onClick={handleAddCustomTable}
							className="px-3 py-2 text-left text-secondary-white hover:bg-gray rounded transition-colors duration-200 flex items-center gap-2"
						>
							<Plus className="w-4 h-4" />
							Add "{searchTerm}"
						</button>
					)}
				</div>
			)}
			<button
				type="button"
				onClick={handleCancel}
				className="text-sm text-lighter-gray hover:text-white transition-colors duration-200"
			>
				Cancel
			</button>
		</div>
	);
}
