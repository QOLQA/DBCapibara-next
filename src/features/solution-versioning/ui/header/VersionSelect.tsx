"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@fsd/shared/ui/select";
import { useVersionSelect } from "../../model/use-version-select";

export function VersionSelect() {
	const { versions, selectedVersionId, onVersionChange } = useVersionSelect();

	return (
		<Select value={selectedVersionId} onValueChange={onVersionChange}>
			<SelectTrigger className="border-gray rounded-full !text-white text-h6 w-[200px] py-[7px] px-[20px]">
				<SelectValue />
			</SelectTrigger>
			<SelectContent className="!text-white bg-secondary-gray border-gray p-[10px] w-[240px]">
				{versions.map((version) => (
					<SelectItem
						key={version._id}
						value={version._id}
						className="border-b-[1px] text-h6 !border-cuartenary-gray hover:!bg-gray hover:!text-white focus:!bg-gray focus:!text-white !rounded-md"
					>
						{version.description}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
