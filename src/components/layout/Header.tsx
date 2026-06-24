import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bell, Monitor } from "lucide-react";
import { useZenModeStore } from "@/store/zenModeStore";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const Header = () => {
  const { isZenMode, toggleZenMode } = useZenModeStore();

  return (
    <header className={cn(
      "absolute top-0 left-0 right-0 h-16 bg-background border-b border-border flex items-center justify-between px-6 shrink-0 transition-transform duration-300 ease-in-out z-40",
      isZenMode ? "-translate-y-full" : "translate-y-0"
    )}>
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger />

        <div className="relative w-full max-w-md ml-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-full pl-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={toggleZenMode}>
              <Monitor className="h-5 w-5 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Modo Zen (Cmd + \ o Ctrl + .)</p>
          </TooltipContent>
        </Tooltip>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
};
