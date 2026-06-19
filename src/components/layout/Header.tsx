import { Bell, Search, Sun, Moon } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../ThemeProvider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export const Header = () => {
  const user = useAuthStore((state) => state.user);
  const { setTheme } = useTheme();

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      header
    </header>
  );
};
