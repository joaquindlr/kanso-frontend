import React, { useState, useMemo } from "react";
import { useProjectStore } from "@/store/projectStore";
import { useIssues, useCreateStory, useUpdateIssue } from "@/hooks/useIssues";
import { useEpics } from "@/hooks/useEpics";
import { useSearchParams } from "react-router-dom";
import { IssueDetailDrawer } from "@/components/features/board/IssueDetailDrawer";
import { type IssueStatus, type IssueSeverity } from "@/types/board";
import {
  Box,
  CircleDashed,
  CircleDot,
  CheckCircle2,
  Rocket,
  Archive,
  Flag,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type TabType = "IDEAS" | "ALL" | "ARCHIVED";

export const BacklogView = () => {
  const { selectedProject } = useProjectStore();
  const { data: issues = [], isLoading } = useIssues(selectedProject?.id);
  const { data: epics = [] } = useEpics(selectedProject?.id);
  const createStoryMutation = useCreateStory();
  const updateIssueMutation = useUpdateIssue();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<TabType>("IDEAS");
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const issueIdParam = searchParams.get("issue");
  const selectedIssueForDrawer = useMemo(
    () => issues.find((i) => i.id === issueIdParam) || null,
    [issues, issueIdParam],
  );

  const filteredIssues = useMemo(() => {
    return issues
      .filter((issue) => {
        if (activeTab === "IDEAS") return issue.status === "ICEBOX";
        if (activeTab === "ARCHIVED")
          return issue.status === "CLOSED" || issue.status === "DEPLOYED";
        if (activeTab === "ALL")
          return issue.status !== "CLOSED" && issue.status !== "DEPLOYED";
        return true;
      })
      .sort((a, b) => {
        // Sort by position
        return a.position?.localeCompare(b.position) || 0;
      });
  }, [issues, activeTab]);

  const handleCloseDrawer = () => {
    searchParams.delete("issue");
    setSearchParams(searchParams);
  };

  const handleRowClick = (issueId: string) => {
    setSearchParams({ issue: issueId });
  };

  const handleCreateTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTaskTitle.trim() && selectedProject) {
      const status = activeTab === "IDEAS" ? "ICEBOX" : "NEW";
      createStoryMutation.mutate({
        projectId: selectedProject.id,
        payload: {
          title: newTaskTitle.trim(),
          status,
        },
      });
      setNewTaskTitle("");
    }
  };

  const handleUpdateEpic = (issueId: string, epicId: string | null) => {
    updateIssueMutation.mutate({
      issueId,
      payload: { epicId },
    });
  };

  const handleUpdateSeverity = (issueId: string, severity: IssueSeverity) => {
    updateIssueMutation.mutate({
      issueId,
      payload: { severity },
    });
  };

  const getStatusIcon = (status: IssueStatus) => {
    switch (status) {
      case "ICEBOX":
        return <Box className="w-4 h-4 text-muted-foreground" />;
      case "NEW":
        return <CircleDashed className="w-4 h-4 text-blue-500" />;
      case "IN_PROGRESS":
        return <CircleDot className="w-4 h-4 text-orange-500" />;
      case "DONE":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "DEPLOYED":
        return <Rocket className="w-4 h-4 text-purple-500" />;
      case "CLOSED":
        return <Archive className="w-4 h-4 text-slate-500" />;
      default:
        return <CircleDashed className="w-4 h-4" />;
    }
  };

  const getSeverityIcon = (severity: IssueSeverity) => {
    switch (severity) {
      case "LOW":
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
      case "MEDIUM":
        return <AlertCircle className="w-4 h-4 text-blue-400" />;
      case "HIGH":
        return <AlertCircle className="w-4 h-4 text-orange-400" />;
      case "CRITICAL":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  if (!selectedProject) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Por favor selecciona o crea un proyecto para ver el backlog.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-4 pb-4 border-b border-border/40">
        <h1 className="text-2xl font-bold tracking-tight">Backlog</h1>
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab("IDEAS")}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              activeTab === "IDEAS"
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-secondary/50",
            )}
          >
            Ideas (Icebox)
          </button>
          <button
            onClick={() => setActiveTab("ALL")}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              activeTab === "ALL"
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-secondary/50",
            )}
          >
            Todas
          </button>
          <button
            onClick={() => setActiveTab("ARCHIVED")}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              activeTab === "ARCHIVED"
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-secondary/50",
            )}
          >
            Archivadas
          </button>
        </div>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-auto py-2">
        {/* Inline Creator */}
        {(activeTab === "IDEAS" || activeTab === "ALL") && (
          <div className="group flex items-center gap-3 py-1.5 px-2 border-b border-border/20 text-sm hover:bg-muted/30 transition-colors">
            <div className="w-5 flex justify-center text-muted-foreground/40">
              <MoreHorizontal className="w-4 h-4" />
            </div>
            <div className="w-16 text-xs text-muted-foreground font-mono opacity-50">
              NEW
            </div>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleCreateTask}
              placeholder="+ Añadir tarea al backlog..."
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50"
            />
          </div>
        )}

        {/* Issues List */}
        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Cargando...
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No hay tareas en esta vista.
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="group flex items-center gap-3 py-1.5 px-2 border-b border-border/20 hover:bg-muted/50 cursor-pointer transition-colors text-sm"
                onClick={() => handleRowClick(issue.id)}
              >
                <div className="w-5 flex justify-center" title={issue.status}>
                  {getStatusIcon(issue.status)}
                </div>

                <div className="w-16 text-xs text-muted-foreground font-mono">
                  {issue.key}
                </div>

                <div className="flex-1 font-medium truncate pr-4 text-foreground/90">
                  {issue.title}
                </div>

                {/* Epic Popover */}
                <div
                  className="w-32 flex justify-start"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <button className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-secondary text-xs text-muted-foreground hover:text-foreground transition-colors truncate max-w-full" />
                      }
                    >
                      <Flag className="w-3 h-3 shrink-0" />
                      <span className="truncate">
                        {issue.epic?.title || "Sin Épica"}
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Asignar Épica</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleUpdateEpic(issue.id, null)}
                      >
                        Ninguna
                      </DropdownMenuItem>
                      {epics.map((epic) => (
                        <DropdownMenuItem
                          key={epic.id}
                          onClick={() => handleUpdateEpic(issue.id, epic.id)}
                        >
                          {epic.title}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Severity Popover */}
                <div
                  className="w-24 flex justify-end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <button
                          className="flex items-center justify-center p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          title={`Prioridad: ${issue.severity}`}
                        />
                      }
                    >
                      {getSeverityIcon(issue.severity)}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleUpdateSeverity(issue.id, "LOW")}
                      >
                        Baja (LOW)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleUpdateSeverity(issue.id, "MEDIUM")}
                      >
                        Media (MEDIUM)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleUpdateSeverity(issue.id, "HIGH")}
                      >
                        Alta (HIGH)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleUpdateSeverity(issue.id, "CRITICAL")
                        }
                      >
                        Crítica (CRITICAL)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <IssueDetailDrawer
        issue={selectedIssueForDrawer}
        onClose={handleCloseDrawer}
      />
    </div>
  );
};
