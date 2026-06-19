import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

export const MainLayout = () => {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-screen bg-background font-sans w-full overflow-hidden">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            <Header />
            <main className="flex-1 overflow-y-auto p-6 text-foreground">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};
