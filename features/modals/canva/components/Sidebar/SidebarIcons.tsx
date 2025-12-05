'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "./NavUser";
import type { Data, NavItem } from "./types";

type SidebarIconsProps = {
  data: Data;
  activeItem: NavItem;
  setActiveItem: (item: NavItem) => void;
  setOpen: (open: boolean) => void;
};

const databaseItem = "Database";

export const SidebarIcons = ({
  data,
  setActiveItem,
  setOpen,
  activeItem,
}: SidebarIconsProps) => {
  return (
    <Sidebar
      collapsible="none"
      className="!w-[calc(var(--sidebar-width-icon)+1px)] bg-secondary-gray"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-1. md:px-auto">
            <SidebarMenu className="gap-4">
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={{
                      children: item.title,
                      hidden: false,
                    }}
                    onClick={() => {
                      if (item.title !== databaseItem) {
                        setActiveItem(item);
                        setOpen(true);
                      } else {
                        setOpen(false);
                        setActiveItem(item);
                      }
                    }}
                    isActive={activeItem?.title === item.title}
                    className="!h-[2.375rem] !w-[2.375rem] flex items-center justify-center mx-auto text-lighter-gray hover:bg-cuartenary-gray hover:text-lighter-gray [&>svg]:w-[1.25rem] [&>svg]:h-[1.25rem]"
                  >
                    {item.icon && item.icon}
                    <span className="md:hidden">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-0 w-[calc(var(--sidebar-width-icon)+1px)]">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
};
