import React, { useState } from "react";
import { Bookmark, Bug, MoreHorizontal, X, Check, ChevronsUpDown, ArrowUp, Equal, ArrowDown, AlertCircle } from "lucide-react";
import type { Issue, IssueSeverity } from "@/types/board";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useEpics } from "@/hooks/useEpics";
import { useProjectStore } from "@/store/projectStore";
import { useUpdateIssue } from "@/hooks/useIssues";
import { cn } from "@/lib/utils";

interface IssueDetailDrawerProps {
  issue: Issue | null;
  onClose: () => void;
}

export const IssueDetailDrawer: React.FC<IssueDetailDrawerProps> = ({
  issue,
  onClose,
}) => {
  const isOpen = !!issue;

  const { selectedProject } = useProjectStore();
  const { data: epics } = useEpics(selectedProject?.id);
  const updateIssueMutation = useUpdateIssue();
  const [epicOpen, setEpicOpen] = useState(false);

  const priorityOptions: { value: IssueSeverity; label: string; icon: React.ElementType; color: string }[] = [
    { value: 'CRITICAL', label: 'Crítica', icon: AlertCircle, color: 'text-destructive' },
    { value: 'HIGH', label: 'Alta', icon: ArrowUp, color: 'text-orange-500' },
    { value: 'MEDIUM', label: 'Media', icon: Equal, color: 'text-orange-300' },
    { value: 'LOW', label: 'Baja', icon: ArrowDown, color: 'text-indigo-400' },
  ];

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

  const handlePriorityChange = (val: string) => {
    if (!safeIssue.id) return;
    updateIssueMutation.mutate({
      issueId: safeIssue.id,
      payload: { severity: val as IssueSeverity }
    });
  };

  const handleEpicChange = (epicId: string) => {
    if (!safeIssue.id) return;
    updateIssueMutation.mutate({
      issueId: safeIssue.id,
      payload: { epicId: epicId === 'none' ? null : epicId }
    });
    setEpicOpen(false);
  };

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
                Épica
              </span>
              <Popover open={epicOpen} onOpenChange={setEpicOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={epicOpen}
                    className="w-full justify-between"
                  >
                    {safeIssue.epic ? (
                      <div className="flex items-center gap-2 truncate">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: safeIssue.epic.color || '#3b82f6' }}
                        />
                        <span className="truncate">{safeIssue.epic.title}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground font-normal">Seleccionar épica...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar épica..." />
                    <CommandList>
                      <CommandEmpty>No se encontraron épicas.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          key="none"
                          value="none"
                          onSelect={() => handleEpicChange('none')}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              !safeIssue.epic ? "opacity-100" : "opacity-0"
                            )}
                          />
                          Sin épica
                        </CommandItem>
                        {epics?.map((epic) => (
                          <CommandItem
                            key={epic.id}
                            value={epic.title}
                            onSelect={() => handleEpicChange(epic.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                safeIssue.epic?.id === epic.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div
                              className="w-3 h-3 rounded-full mr-2 shrink-0"
                              style={{ backgroundColor: '#3b82f6' }}
                            />
                            <span className="truncate">{epic.title}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Prioridad
              </span>
              <Select value={safeIssue.severity} onValueChange={handlePriorityChange}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const selected = priorityOptions.find(p => p.value === safeIssue.severity);
                      if (!selected) return null;
                      const Icon = selected.icon;
                      return <Icon className={cn("w-4 h-4 shrink-0", selected.color)} />;
                    })()}
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className={cn("w-4 h-4", option.color)} />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
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
