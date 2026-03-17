"use client";

import { useRouter } from "next/navigation";
import { Edit, Trash } from "lucide-react";
import { useTranslation } from "@fsd/shared/i18n/use-translation";
import { useModelsStore } from "@fsd/features/project-management";
import { MoreButton } from "@fsd/shared/ui/MoreButton";
import { ModelImage } from "./ModelImage";
import { ManagedDropdownMenu } from "@fsd/shared/ui/ManagedDropdownMenu";
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@fsd/shared/ui/dropdown-menu";
import type { SolutionListItem } from "@fsd/entities/solution";

interface ModelCardProps extends SolutionListItem {
	requestDelete: () => void;
	requestEdit: () => void;
}

export function ModelCard({
	_id,
	name,
	src_img = "",
	last_updated_at,
	requestDelete,
	requestEdit,
}: ModelCardProps) {
	const { t } = useTranslation();
	const router = useRouter();
	const { setSolutionId } = useModelsStore.getState();

	const handleRequestDelete = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setSolutionId(_id);
		requestDelete();
	};

	const handleRequestEdit = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setSolutionId(_id);
		requestEdit();
	};

	return (
		<li className="model">
			<article
				onClick={() => {
					router.push(`/models/${_id}/canva`);
				}}
				className="focus:rounded-2xl"
			>
				<div className="model__thumbnail">
					<ModelImage
						src={src_img}
						alt="Model thumbnail"
						className="model__thumbnail-img"
					/>
				</div>
				<div className="model__info">
					<div className="flex items-center justify-between">
						<p className="text-white text-h3">{name}</p>
						<ManagedDropdownMenu>
							<DropdownMenuTrigger asChild>
								<MoreButton className="hover:text-lighter-gray text-white" />
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="z-50"
								side="right"
								variant="menu-1"
							>
								<DropdownMenuItem
									type="normal"
									onClick={(e) => handleRequestEdit(e)}
								>
									<Edit className="text-white" />
									{t("common.edit")}
								</DropdownMenuItem>

								<DropdownMenuSeparator className="bg-gray" />

								<DropdownMenuItem
									type="delete"
									className="text-red"
									onClick={(e) => handleRequestDelete(e)}
								>
									<Trash className="text-red" />
									{t("common.delete")}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</ManagedDropdownMenu>
					</div>
					<p className="text-lighter-gray text-p">
						{t("other.lastEdited")}{" "}
						{new Date(last_updated_at || new Date()).toLocaleDateString(
							"en-US",
							{ month: "short", day: "numeric", year: "numeric" },
						)}
					</p>
				</div>
			</article>
		</li>
	);
}
