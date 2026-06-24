import { useProjectStore } from "@/store/projectStore";
import { ProjectWhiteboard } from "@/components/features/ProjectWhiteboard";
import { useProjects } from "@/hooks/useProjects";
import { Loader2 } from "lucide-react";

export const Whiteboard = () => {
  const { selectedProject } = useProjectStore();
  const { data: projects, isLoading } = useProjects();

  if (!selectedProject) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Por favor selecciona o crea un proyecto para ver la pizarra.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Cargando pizarra...
      </div>
    );
  }

  const project = projects?.find((p) => p.id === selectedProject.id) || selectedProject;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 w-full h-full relative">
        <ProjectWhiteboard
          key={project.id}
          projectId={project.id}
          initialData={project.excalidrawData}
        />
      </div>
    </div>
  );
};
