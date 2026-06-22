import React from "react";
import { Bookmark, Bug, MoreHorizontal, X } from "lucide-react";
import type { Issue } from "@/types/board";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface IssueDetailDrawerProps {
  issue: Issue | null;
  onClose: () => void;
}

export const IssueDetailDrawer: React.FC<IssueDetailDrawerProps> = ({
  issue,
  onClose,
}) => {
  const isOpen = !!issue;

  const prevIssueRef = React.useRef<Issue | null>(null);
  if (issue) {
    prevIssueRef.current = issue;
  }
  const displayIssue = issue || prevIssueRef.current;

  const safeIssue =
    displayIssue ||
    ({
      id: "",
      title: "",
      key: "",
      status: "NEW",
      type: "STORY",
      severity: "LOW",
    } as Issue);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "NEW":
        return "Nuevo";
      case "IN_PROGRESS":
        return "En progreso";
      case "DONE":
        return "Hecho";
      case "DEPLOYED":
        return "Desplegado";
      default:
        return status;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[700px] sm:max-w-none p-0 flex flex-col gap-0 border-l border-border bg-card"
      >
        <SheetHeader className="flex flex-row items-center justify-between p-6 border-b border-border shrink-0 space-y-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded bg-secondary text-secondary-foreground font-medium text-xs">
              {getStatusLabel(safeIssue.status)}
            </span>
            <span className="text-muted-foreground font-mono text-sm">
              {safeIssue.key}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              {safeIssue.type === "STORY" ? (
                <Bookmark className="w-4 h-4 text-primary" />
              ) : (
                <Bug className="w-4 h-4 text-primary" />
              )}
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                {safeIssue.type === "STORY" ? "User Story" : "Bug"}
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight leading-tight">
              {safeIssue.title}
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-8 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Asignado a
              </span>
              <button className="flex items-center justify-between w-full p-2 bg-background border border-border rounded hover:border-primary/50 transition-colors text-left group">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-[10px] font-medium">
                    US
                  </div>
                  <span className="text-foreground text-sm">Unassigned</span>
                </div>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Prioridad
              </span>
              <button className="flex items-center justify-between w-full p-2 bg-background border border-border rounded hover:border-primary/50 transition-colors text-left group">
                <div className="flex items-center gap-2">
                  <span className="text-foreground text-sm font-medium">
                    {safeIssue.severity === "CRITICAL" && (
                      <span className="text-destructive">Critica</span>
                    )}
                    {safeIssue.severity === "HIGH" && <span>Alta</span>}
                    {safeIssue.severity === "MEDIUM" && (
                      <span className="text-muted-foreground">Media</span>
                    )}
                    {safeIssue.severity === "LOW" && (
                      <span className="text-muted-foreground">Baja</span>
                    )}
                  </span>
                </div>
              </button>
            </div>

            <div className="flex flex-col gap-2 col-span-2">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Etiquetas
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                  Frontend
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded bg-secondary border border-border text-secondary-foreground text-xs font-medium">
                  Visuals
                </span>
                <button className="inline-flex items-center px-2 py-1 rounded bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors text-xs font-medium gap-1">
                  + Add Label
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Descripción
              </span>
              <button className="text-primary hover:text-primary/80 text-xs font-medium transition-colors">
                Editar
              </button>
            </div>
            <div className="text-muted-foreground text-sm leading-relaxed max-w-none pt-2">
              <p>
                No hay descripción disponible para esta issue. Haga click en
                Editar para agregar detalles adicionales relevantes para el
                equipo.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider border-b border-border pb-2">
              Actividad
            </span>

            <div className="flex gap-3 mt-2">
              <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-medium shrink-0">
                YO
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <textarea
                  className="w-full bg-background border border-border rounded-md p-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none text-sm transition-all"
                  placeholder="Agregar un comentario..."
                  rows={2}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm">
                    Cancelar
                  </Button>
                  <Button size="sm">Comentar</Button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium shrink-0">
                AM
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-foreground">
                    Alex Mercer
                  </span>
                  <span className="text-xs text-muted-foreground">
                    hace 2 horas
                  </span>
                </div>
                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md border border-border">
                  He comenzado a trabajar en esta tarea. Necesito confirmación
                  sobre los estilos finales antes de subir el PR.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
