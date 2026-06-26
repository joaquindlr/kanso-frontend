import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useProjectStore } from "@/store/projectStore";
import { useZenModeStore } from "@/store/zenModeStore";
import { useProjects } from "@/hooks/useProjects";
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
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, Presentation, FolderGit2, LogOut, User2, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarDropdownTrigger } from "./SidebarDropdownTrigger";

export function AppSidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const { isMobile } = useSidebar();
  const { data: projects = [] } = useProjects();
  const { selectedProject, setSelectedProject } = useProjectStore();
  const { isZenMode } = useZenModeStore();

  useEffect(() => {
    if (!selectedProject && projects.length > 0) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject, setSelectedProject]);

  const navigation = [
    { name: "Tablero", href: "/", icon: LayoutDashboard },
    { name: "Epicas", href: "/epics", icon: Flag },
    { name: "Pizarra", href: "/whiteboard", icon: Presentation },
  ];

  return (
    <Sidebar collapsible="icon" className={cn("transition-all duration-300 ease-in-out z-50", isZenMode && "-translate-x-full opacity-0 pointer-events-none")}>
      <SidebarHeader>
        <DropdownMenu>
          <SidebarDropdownTrigger
            icon={<FolderGit2 className="size-4" />}
            iconBgClass="bg-primary text-primary-foreground"
            title={selectedProject ? selectedProject.name : "Proyectos"}
            subtitle="Mis Proyectos"
          />
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
              {projects.map((project) => (
                <DropdownMenuItem key={project.id} onClick={() => setSelectedProject(project)} className="cursor-pointer">
                  <FolderGit2 className="mr-2 size-4" />
                  <span className="truncate">{project.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <Link to="/proyects" className="cursor-pointer block w-full">
              <DropdownMenuItem className="cursor-pointer w-full">
                Ver todos los proyectos
              </DropdownMenuItem>
            </Link>
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
                  <SidebarMenuButton 
                    render={<Link to={item.href} />} 
                    isActive={location.pathname === item.href} 
                    tooltip={item.name}
                    className="h-10 text-base [&>svg]:size-5"
                  >
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
          <SidebarDropdownTrigger
            icon={<User2 className="size-4" />}
            iconBgClass="bg-muted"
            title={user?.email?.split('@')[0] || "Usuario"}
            subtitle={user?.email || "usuario@ejemplo.com"}
          />
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
            <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer font-semibold">
              <LogOut className="mr-2 size-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
