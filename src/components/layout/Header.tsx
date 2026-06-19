import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bell } from "lucide-react";

export const Header = () => {
  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 shrink-0">
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
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
};
