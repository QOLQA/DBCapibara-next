import type { ReactElement } from "react";
import type { User } from "@/hooks/use-auth";

export type NavItem = {
	title: string;
	icon: ReactElement;
	isActive?: boolean;
	content?: ReactElement;
	aditionalToTitle?: aditionalToTitleButton | aditionalToTitleExpand;
};

export type aditionalToTitleButton = {
	type: "button";
	onClick: () => void;
	titleButton: string;
};

export type aditionalToTitleExpand = {
	type: "expand";
	onClick: () => void;
};


export type Data = {
	navMain: NavItem[];
	user: User;
};
