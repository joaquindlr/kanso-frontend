import { CreateEpicModal } from "../components/features/CreateEpicModal";
import { useEpics } from "@/hooks/useEpics";
import { useProjectStore } from "@/store/projectStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flag, CheckCircle2, FolderGit2 } from "lucide-react";

export function Epics() {
  const { selectedProject } = useProjectStore();
  const { data: epics = [], isLoading } = useEpics(selectedProject?.id);

  if (!selectedProject) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center border rounded-xl border-dashed">
          <FolderGit2 className="size-10 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg">No hay proyecto seleccionado</h3>
          <p className="text-muted-foreground max-w-sm mb-4">
            Selecciona o crea un proyecto para ver sus épicas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Épicas del proyecto {selectedProject.name}
          </h2>
          <p className="text-muted-foreground">
            Gestiona las épicas activas en tu proyecto
          </p>
        </div>
        <CreateEpicModal />
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-48 animate-pulse bg-muted/50" />
          ))}
        </div>
      ) : epics.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center border rounded-xl border-dashed">
          <Flag className="size-10 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg">No hay épicas</h3>
          <p className="text-muted-foreground max-w-sm mb-4">
            Aún no has creado ninguna épica en este proyecto. Comienza creando una nueva para organizar tus tareas.
          </p>
          <CreateEpicModal />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {epics.map((epic) => {
            const total = Number(epic.totalTasks) || 0;
            const completed = Number(epic.completedTasks) || 0;
            const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

            return (
              <Card key={epic.id} className="flex flex-col border-border/50 bg-card/50 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4 p-8 pb-4">
                  <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Flag className="size-5" />
                  </div>
                  <h3 className="font-semibold text-lg leading-none tracking-tight line-clamp-1 flex-1">
                    {epic.title}
                  </h3>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-6 p-8 pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
                    {epic.description || "Sin descripción proporcionada."}
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
