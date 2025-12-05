import type { ReactElement } from "react";

export type NavItem = {
	title: string;
	icon: ReactElement;
	isActive?: boolean;
	content?: ReactElement;
};

export type User = {
	name: string;
	email: string;
	avatar: string;
};

export type Data = {
  navMain: NavItem[];
	user: User;
}
