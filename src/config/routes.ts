import React, { lazy } from "react";
import {
  LayoutDashboard,
  Presentation,
  ListTodo,
  Flag,
} from "lucide-react";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Dashboard } from "@/pages/Dashboard";
import { BacklogView } from "@/pages/BacklogView";
import { Projects } from "@/pages/Projects";
import { Epics } from "@/pages/Epics";
import { Team } from "@/pages/Team";

const Whiteboard = lazy(() =>
  import("@/pages/Whiteboard").then((module) => ({
    default: module.Whiteboard,
  })),
);

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  isPublic?: boolean;
  hideLayout?: boolean;
  navbarConfig?: {
    name: string;
    icon: React.ComponentType;
  };
}

export const appRoutes: RouteConfig[] = [
  // Public Routes
  { path: "/login", component: Login, isPublic: true, hideLayout: true },
  { path: "/register", component: Register, isPublic: true, hideLayout: true },

  // Protected Main Navigation Routes (These appear in Navbar)
  {
    path: "/",
    component: Dashboard,
    navbarConfig: { name: "Tablero", icon: LayoutDashboard },
  },
  {
    path: "/backlog",
    component: BacklogView,
    navbarConfig: { name: "Backlog", icon: ListTodo },
  },
  {
    path: "/epics",
    component: Epics,
    navbarConfig: { name: "Epicas", icon: Flag },
  },
  {
    path: "/whiteboard",
    component: Whiteboard,
    navbarConfig: { name: "Pizarra", icon: Presentation },
  },

  // Protected Other Routes (Not in Navbar)
  { path: "/proyects", component: Projects },
  { path: "/team", component: Team },
];

export const getNavbarRoutes = () =>
  appRoutes.filter((route) => route.navbarConfig);
