import type { ReactElement } from "react";
import type { User } from "@fsd/entities/user";

export type NavItem = {
	title: string;
	icon: ReactElement;
	isActive?: boolean;
	content?: ReactElement;
	aditionalToTitle?: AditionalToTitleButton | AditionalToTitleExpand;
};

export type AditionalToTitleButton = {
	type: "button";
	onClick: () => void;
	titleButton: string;
};

export type AditionalToTitleExpand = {
	type: "expand";
	onClick: () => void;
};

export type Data = {
	navMain: NavItem[];
	user: User;
};
