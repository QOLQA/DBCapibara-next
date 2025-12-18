"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import type { User } from "@/hooks/use-auth";

export function NavUser({ user }: { user: User }) {
	const { isMobile } = useSidebar();

	const getInitials = (name: string) => {
		const names = name.trim().split(' ');
		if (names.length >= 2) {
			return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
		}
		return name.substring(0, 2).toUpperCase();
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="!h-[2.375rem] !w-[2.375rem] md:p-0 mx-auto text-lighter-gray"
						>
							<Avatar className="!h-[2.375rem] !w-[2.375rem] mx-auto rounded-full">
								<AvatarImage src={user.avatar} alt={user.username} />
								<AvatarFallback className="rounded-full">{getInitials(user.username)}</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight md:hidden">
								<span className="truncate font-semibold">{user.username}</span>
								<span className="truncate text-xs">{user.email}</span>
							</div>
							<ChevronsUpDown className="ml-auto md:hidden" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg "
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8">
									<AvatarImage src={user.avatar} alt={user.username} />
									<AvatarFallback className="rounded-lg">{getInitials(user.username)}</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{user.username}</span>
									<span className="truncate text-xs">{user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
