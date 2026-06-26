import { CreateEpicModal } from "../components/features/CreateEpicModal";
import { useEpics } from "@/hooks/useEpics";
import { useProjectStore } from "@/store/projectStore";
import { Card } from "@/components/ui/card";
import { Flag, FolderGit2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { EntityCard } from "@/components/features/EntityCard";

export function Epics() {
  const { selectedProject } = useProjectStore();
  const { data: epics = [], isLoading } = useEpics(selectedProject?.id);

  if (!selectedProject) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <EmptyState
          icon={FolderGit2}
          title="No hay proyecto seleccionado"
          description="Selecciona o crea un proyecto para ver sus épicas."
        />
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
        <EmptyState
          icon={Flag}
          title="No hay épicas"
          description="Aún no has creado ninguna épica en este proyecto. Comienza creando una nueva para organizar tus tareas."
        >
          <CreateEpicModal />
        </EmptyState>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {epics.map((epic) => (
            <EntityCard
              key={epic.id}
              title={epic.title}
              description={epic.description}
              totalTasks={epic.totalTasks || 0}
              completedTasks={epic.completedTasks || 0}
              icon={<Flag className="size-5" />}
            />
          ))}
        </div>
      )}
    </div>
  );
}
