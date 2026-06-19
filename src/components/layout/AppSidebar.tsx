import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, SquareKanban, ChevronsUpDown, FolderGit2, LogOut, User2 } from "lucide-react";

export function AppSidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const { isMobile } = useSidebar();

  const navigation = [
    { name: "Tablero", href: "/", icon: LayoutDashboard },
    { name: "Pizarra", href: "/board", icon: SquareKanban },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FolderGit2 className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
              <span className="font-semibold">Kanso Project</span>
              <span className="text-xs text-muted-foreground">Kanso Org</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Proyectos
              </DropdownMenuLabel>
              <DropdownMenuItem>
                <FolderGit2 className="mr-2 size-4" />
                <span>Kanso Project</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver todos los proyectos</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton render={<Link to={item.href} />} isActive={location.pathname === item.href} tooltip={item.name}>
                    <item.icon />
                    <span className="group-data-[collapsible=icon]:hidden">{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
              <User2 className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
              <span className="font-semibold">{user?.email?.split('@')[0] || "Usuario"}</span>
              <span className="text-xs text-muted-foreground">{user?.email || "usuario@ejemplo.com"}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
                    <User2 className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">{user?.email?.split('@')[0] || "Usuario"}</span>
                    <span className="text-xs text-muted-foreground">{user?.email || "usuario@ejemplo.com"}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
              <LogOut className="mr-2 size-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
