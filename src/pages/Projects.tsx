import { CreateProjectModal } from "../components/features/CreateProjectModal";
import { useProjects } from "@/hooks/useProjects";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { EntityCard } from "@/components/features/EntityCard";
import {
  Layers,
  Box,
  LayoutGrid,
  SquareDashedBottomCode,
  Blocks,
  Hexagon,
  Component,
  Boxes
} from "lucide-react";

const ICONS = [
  Layers,
  Box,
  LayoutGrid,
  SquareDashedBottomCode,
  Blocks,
  Hexagon,
  Component,
  Boxes
];

function getProjectIcon(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % ICONS.length;
  const Icon = ICONS[index];
  return <Icon className="size-5" />;
}

export function Projects() {
  const { data: projects = [], isLoading } = useProjects();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mis Proyectos</h2>
          <p className="text-muted-foreground">
            Gestiona tus proyectos activos
          </p>
        </div>
        <CreateProjectModal />
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-48 animate-pulse bg-muted/50" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No hay proyectos"
          description="Aún no has creado ningún proyecto. Comienza creando uno nuevo para empezar a gestionar tus tareas."
        >
          <CreateProjectModal />
        </EmptyState>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <EntityCard
              key={project.id}
              title={project.name}
              description={project.description}
              totalTasks={project.totalTasks || 0}
              completedTasks={project.completedTasks || 0}
              icon={getProjectIcon(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
