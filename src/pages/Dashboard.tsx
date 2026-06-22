import React from 'react';
import { BoardColumn } from '@/components/features/board/BoardColumn';
import type { Issue, IssueStatus } from '@/types/board';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { IssueCard } from '@/components/features/board/IssueCard';
import { useProjectStore } from '@/store/projectStore';
import { useIssues, useCreateStory, useMoveIssue } from '@/hooks/useIssues';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { IssueDetailDrawer } from '@/components/features/board/IssueDetailDrawer';

export const Dashboard = () => {
  const { selectedProject } = useProjectStore();
  const { data: serverIssues, isLoading } = useIssues(selectedProject?.id);
  const createStoryMutation = useCreateStory();
  const moveIssueMutation = useMoveIssue();
  const queryClient = useQueryClient();

  const issues = React.useMemo(() => serverIssues || [], [serverIssues]);
  const [activeIssue, setActiveIssue] = React.useState<Issue | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const issueIdParam = searchParams.get('issue');
  const selectedIssueForDrawer = React.useMemo(
    () => issues.find(i => i.id === issueIdParam) || null,
    [issues, issueIdParam]
  );

  const handleCloseDrawer = () => {
    searchParams.delete('issue');
    setSearchParams(searchParams);
  };

  const setIssues = (updater: (prev: Issue[]) => Issue[]) => {
    if (!selectedProject) return;
    queryClient.setQueryData(['issues', selectedProject.id], (old: Issue[] | undefined) => updater(old || []));
  };

  const handleCreateIssue = (title: string, description?: string) => {
    if (!selectedProject) return;
    
    createStoryMutation.mutate({
      projectId: selectedProject.id,
      payload: { title, detail: description }
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const newIssues = React.useMemo(() => issues.filter((i) => i.status === 'NEW'), [issues]);
  const inProgressIssues = React.useMemo(() => issues.filter((i) => i.status === 'IN_PROGRESS'), [issues]);
  const doneIssues = React.useMemo(() => issues.filter((i) => i.status === 'DONE'), [issues]);
  const deployedIssues = React.useMemo(() => issues.filter((i) => i.status === 'DEPLOYED'), [issues]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const issue = issues.find((i) => i.id === active.id);
    if (issue) setActiveIssue(issue);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const isActiveIssue = active.data.current?.type === 'Issue';
    const isOverIssue = over.data.current?.type === 'Issue';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveIssue) return;

    if (isActiveIssue && isOverIssue) {
      setIssues((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === activeId);
        const overIndex = prev.findIndex((t) => t.id === overId);

        if (activeIndex === overIndex && prev[activeIndex].status === prev[overIndex].status) {
          return prev;
        }

        if (prev[activeIndex].status !== prev[overIndex].status) {
          const newIssues = [...prev];
          newIssues[activeIndex] = { ...newIssues[activeIndex], status: prev[overIndex].status as IssueStatus };
          return arrayMove(newIssues, activeIndex, overIndex);
        }

        return arrayMove(prev, activeIndex, overIndex);
      });
    }

    if (isActiveIssue && isOverColumn) {
      setIssues((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === activeId);
        if (prev[activeIndex].status !== overId) {
          const newIssues = [...prev];
          newIssues[activeIndex] = { ...newIssues[activeIndex], status: overId as IssueStatus };
          return newIssues;
        }
        return prev;
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveIssue(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    setIssues((prev) => {
      const activeIndex = prev.findIndex((t) => t.id === activeId);
      const overIndex = prev.findIndex((t) => t.id === overId);
      
      let newIssues = prev;
      if (activeId !== overId && overIndex !== -1) {
         newIssues = arrayMove(newIssues, activeIndex, overIndex);
      }

      const statusMap = new Map<string, number>();
      const calculatedIssues = newIssues.map(issue => {
        const currentCount = statusMap.get(issue.status) || 0;
        statusMap.set(issue.status, currentCount + 1);
        return { ...issue, position: String(currentCount + 1).padStart(5, '0') };
      });
      
      const updatedIssue = calculatedIssues.find(i => i.id === activeId);
      if (updatedIssue) {
        moveIssueMutation.mutate({
          issueId: updatedIssue.id,
          payload: { status: updatedIssue.status, position: updatedIssue.position }
        });
      }

      return calculatedIssues;
    });
  };

  if (!selectedProject) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Por favor selecciona o crea un proyecto para ver el tablero.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Cargando tablero...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex gap-2 overflow-x-auto pb-4 h-full">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <BoardColumn id="NEW" title="Nuevo" issues={newIssues} onCreateIssue={handleCreateIssue} />
          <BoardColumn id="IN_PROGRESS" title="En progreso" issues={inProgressIssues} dotColor="bg-primary" />
          <BoardColumn id="DONE" title="Hecho" issues={doneIssues} />
          <BoardColumn id="DEPLOYED" title="Desplegado" issues={deployedIssues} dotColor="bg-foreground" />
          
          <DragOverlay>
            {activeIssue ? <IssueCard issue={activeIssue} isOverlay={true} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
      
      <IssueDetailDrawer issue={selectedIssueForDrawer} onClose={handleCloseDrawer} />
    </div>
  );
};
