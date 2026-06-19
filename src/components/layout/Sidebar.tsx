import { LayoutDashboard, Users, FolderKanban, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="w-64 bg-card text-card-foreground flex flex-col h-full border-r border-border">
      sidebar
    </aside>
  );
};
