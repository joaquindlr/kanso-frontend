import { SidebarTrigger } from "@/components/ui/sidebar";

export const Header = () => {
  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-xl font-bold">Kanso</h1>
      </div>
    </header>
  );
};
