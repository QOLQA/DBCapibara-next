"use client";

import { useRouter } from "next/navigation";
import { Edit, Trash } from "lucide-react";
import { useTranslation } from "@fsd/shared/i18n/use-translation";
import { MoreButton } from "@fsd/shared/ui/MoreButton";
import { SolutionImage } from "./solution-image";
import { ManagedDropdownMenu } from "@fsd/shared/ui/ManagedDropdownMenu";
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@fsd/shared/ui/dropdown-menu";
import type { SolutionListItem } from "../model/solution";

interface SolutionCardProps extends SolutionListItem {
	onRequestDelete: (solutionId: string) => void;
	onRequestEdit: (solutionId: string) => void;
}

export function SolutionCard({
	_id,
	name,
	src_img = "",
	last_updated_at,
	onRequestDelete,
	onRequestEdit,
}: SolutionCardProps) {
	const { t } = useTranslation();
	const router = useRouter();

	const handleRequestDelete = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		onRequestDelete(_id);
	};

	const handleRequestEdit = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		onRequestEdit(_id);
	};

	return (
		<li className="project">
			<article
				onClick={() => {
					router.push(`/projects/${_id}/canva`);
				}}
				className="focus:rounded-2xl"
			>
				<div className="project__thumbnail">
					<SolutionImage
						src={src_img}
						alt="Project thumbnail"
						className="project__thumbnail-img"
					/>
				</div>
				<div className="project__info">
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
