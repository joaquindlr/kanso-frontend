import React from "react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarDropdownTriggerProps {
  icon: React.ReactNode;
  iconBgClass: string;
  title: string;
  subtitle: string;
}

export function SidebarDropdownTrigger({
  icon,
  iconBgClass,
  title,
  subtitle,
}: SidebarDropdownTriggerProps) {
  // We use @ts-ignore because render prop might be custom in this specific Shadcn UI implementation
  // @ts-ignore
  return (
    <DropdownMenuTrigger
      render={
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        />
      }
    >
      <div className={cn("flex aspect-square size-8 items-center justify-center rounded-lg", iconBgClass)}>
        {icon}
      </div>
      <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden overflow-hidden">
        <span className="font-semibold truncate w-full">{title}</span>
        <span className="text-xs text-muted-foreground truncate w-full">{subtitle}</span>
      </div>
      <ChevronsUpDown className="ml-auto size-4 shrink-0 group-data-[collapsible=icon]:hidden" />
    </DropdownMenuTrigger>
  );
}
