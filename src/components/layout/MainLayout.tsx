import { Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useZenModeStore } from "@/store/zenModeStore";
import { useProjectStore } from "@/store/projectStore";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export const MainLayout = () => {
  const { isZenMode, toggleZenMode } = useZenModeStore();
  const { selectedProject } = useProjectStore();
  const location = useLocation();
  const isWhiteboard = location.pathname.startsWith("/whiteboard");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "\\" || e.key === ".")) {
        e.preventDefault();
        toggleZenMode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleZenMode]);

  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": isZenMode ? "0px" : "16rem",
            "--sidebar-width-icon": isZenMode ? "0px" : "4rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset className="overflow-hidden relative">
          <Header />
          <div
            className={cn(
              "flex-1 overflow-y-auto text-foreground transition-[padding] duration-300 ease-in-out",
              isWhiteboard ? "p-0" : "p-6",
              isZenMode
                ? isWhiteboard
                  ? "pt-0"
                  : "pt-6"
                : isWhiteboard
                  ? "pt-16"
                  : "pt-[calc(4rem+1.5rem)]",
            )}
          >
            <Outlet />
          </div>

          {isZenMode && selectedProject && (
            <div className="absolute bottom-4 right-16 pointer-events-none z-50 flex flex-col items-end gap-1.5 opacity-60 transition-opacity duration-500">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-xs font-medium text-muted-foreground shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary/70"></span>
                {selectedProject.name}
              </div>
              <span className="text-[10px] text-muted-foreground/70 mr-1">
                Cmd/Ctrl + \ o . para salir del modo zen.
              </span>
            </div>
          )}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};
