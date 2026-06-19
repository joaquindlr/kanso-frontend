import { CreateProjectModal } from "../components/features/CreateProjectModal";
import { useProjects } from "@/hooks/useProjects";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Layers,
  Box,
  LayoutGrid,
  SquareDashedBottomCode,
  Blocks,
  Hexagon,
  Component,
  Boxes,
  CheckCircle2
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
        <div className="flex flex-col items-center justify-center h-64 text-center border rounded-xl border-dashed">
          <Layers className="size-10 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg">No hay proyectos</h3>
          <p className="text-muted-foreground max-w-sm mb-4">
            Aún no has creado ningún proyecto. Comienza creando uno nuevo para empezar a gestionar tus tareas.
          </p>
          <CreateProjectModal />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const total = Number(project.totalTasks) || 0;
            const completed = Number(project.completedTasks) || 0;
            const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

            return (
              <Card key={project.id} className="flex flex-col border-border/50 bg-card/50 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4 p-8 pb-4">
                  <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {getProjectIcon(project.id)}
                  </div>
                  <h3 className="font-semibold text-lg leading-none tracking-tight line-clamp-1 flex-1">
                    {project.name}
                  </h3>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-6 p-8 pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
                    {project.description || "Sin descripción proporcionada."}
                  </p>

                  <div className="mt-auto space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center text-muted-foreground gap-1.5 font-medium">
                        <CheckCircle2 className="size-4" />
                        {completed}/{total} Tareas
                      </span>
                      <span className="font-medium">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
