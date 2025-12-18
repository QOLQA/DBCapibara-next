'use client'

import { ManagedDropdownMenu } from "@/components/managedDropdownMenu";
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreButton } from "../Diagram/MoreButton";
import { useState } from "react";
import { ModalNewQuery } from "./ModalNewQuery";
import type { Query } from "../../types";
import { useCanvasStore } from "@/state/canvaStore";

export const DropDownQuerys = ({ editQuery }: { editQuery: Query }) => {
	const [open, setOpen] = useState(false);
	const [queryText, setQueryText] = useState("");

	const deleteQuery = useCanvasStore((state) => state.removeQuery);

	const handleDelete = () => {
		deleteQuery(editQuery.id);
	};

	const handleEdit = () => {
		setQueryText(editQuery?.full_query || "");
		setOpen(true);
	};

	return (
		<div className="absolute bottom-1.5 right-[0px]">
			<ManagedDropdownMenu>
				<DropdownMenuTrigger asChild>
					<MoreButton
						className="text-lighter-gray "
						onClick={(e) => {
							e.stopPropagation();
						}}
					/>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="z-50 !bg-gray"
					side="right"
					variant="menu-1"
				>
					<DropdownMenuItem
						className="hover:!bg-cuartenary-gray"
						type="normal"
						onClick={handleEdit}
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>edit icon</title>
							<path
								d="M13.9681 2.03162C13.0364 1.09994 11.5258 1.09998 10.5942 2.03172L2.62751 9.99934C2.35663 10.2703 2.16623 10.611 2.07749 10.9837L1.3471 14.0513C1.30689 14.2203 1.35718 14.3979 1.47995 14.5207C1.60273 14.6435 1.78041 14.6938 1.94932 14.6536L5.01682 13.9232C5.38962 13.8344 5.73047 13.644 6.00143 13.373L12.6665 6.70713C13.1186 7.16303 13.1175 7.89913 12.663 8.35357L11.4741 9.54252C11.2788 9.73778 11.2788 10.0544 11.4741 10.2496C11.6693 10.4449 11.9859 10.4449 12.1812 10.2496L13.3701 9.06068C14.2151 8.2157 14.2163 6.84641 13.3736 5.99998L13.9682 5.40529C14.8997 4.47364 14.8997 2.96322 13.9681 2.03162ZM11.3013 2.73878C11.8425 2.19761 12.7198 2.19758 13.261 2.73872C13.8021 3.27982 13.8021 4.1571 13.261 4.69823L5.29429 12.6659C5.15419 12.806 4.97795 12.9045 4.7852 12.9504L2.5081 13.4926L3.0503 11.2153C3.09618 11.0226 3.19462 10.8465 3.33466 10.7064L11.3013 2.73878Z"
								fill="#DFDFDF"
							/>
						</svg>
						Edit
					</DropdownMenuItem>
					<DropdownMenuSeparator className="bg-secondary-white" />
					<DropdownMenuItem
						type="delete"
						className="text-red hover:!bg-cuartenary-gray"
						onClick={handleDelete}
					>
						<svg
							width="15"
							height="15"
							viewBox="0 0 15 15"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>delete icon</title>
							<path
								d="M6.25 3.125H8.75C8.75 2.43464 8.19036 1.875 7.5 1.875C6.80964 1.875 6.25 2.43464 6.25 3.125ZM5.3125 3.125C5.3125 1.91688 6.29188 0.9375 7.5 0.9375C8.70812 0.9375 9.6875 1.91688 9.6875 3.125H13.2812C13.5401 3.125 13.75 3.33487 13.75 3.59375C13.75 3.85263 13.5401 4.0625 13.2812 4.0625H12.4568L11.7243 11.632C11.608 12.8334 10.5984 13.75 9.39144 13.75H5.60856C4.40159 13.75 3.39197 12.8334 3.27571 11.632L2.54317 4.0625H1.71875C1.45987 4.0625 1.25 3.85263 1.25 3.59375C1.25 3.33487 1.45987 3.125 1.71875 3.125H5.3125ZM6.5625 6.09375C6.5625 5.83487 6.35263 5.625 6.09375 5.625C5.83487 5.625 5.625 5.83487 5.625 6.09375V10.7812C5.625 11.0401 5.83487 11.25 6.09375 11.25C6.35263 11.25 6.5625 11.0401 6.5625 10.7812V6.09375ZM8.90625 5.625C9.16513 5.625 9.375 5.83487 9.375 6.09375V10.7812C9.375 11.0401 9.16513 11.25 8.90625 11.25C8.64737 11.25 8.4375 11.0401 8.4375 10.7812V6.09375C8.4375 5.83487 8.64737 5.625 8.90625 5.625ZM4.20885 11.5417C4.2786 12.2625 4.88437 12.8125 5.60856 12.8125H9.39144C10.1156 12.8125 10.7214 12.2625 10.7912 11.5417L11.5149 4.0625H3.48505L4.20885 11.5417Z"
								fill="#E93544"
							/>
						</svg>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</ManagedDropdownMenu>
			<ModalNewQuery
				open={open}
				setOpen={setOpen}
				mode="edit"
				queryEdit={editQuery}
				queryText={queryText}
				setQueryText={setQueryText}
			/>
		</div>
	);
};
